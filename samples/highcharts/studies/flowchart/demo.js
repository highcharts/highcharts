// Sugiyama-style flowchart layout.
//
// Phase 1 — Cycle removal.
// A layered layout requires a DAG, but flowcharts contain feedback loops. This
// step reverses a small set of "back" edges so every cycle is broken, using the
// greedy heuristic of Eades, Lin & Smyth (1993). Reversed edges are recorded so
// a later phase can restore their original arrow direction.
//
// Phase 2 — Layer assignment.
// Each node is ranked into a horizontal layer by longest-path (ASAP) layering:
// sources sit in layer 0, every other node one layer below its deepest
// predecessor. The layer drives the node's Y position.
//
// Phase 3 — Crossing reduction.
// Edges that span more than one layer are broken with dummy nodes so every edge
// connects adjacent layers. Nodes within each layer are then reordered with the
// median heuristic, sweeping down and up until crossings stop dropping. Each
// edge is drawn bent through its dummy lane so the reversed back-edge routes
// around the side instead of through the middle.
//
// Phase 4 — Coordinate assignment.
// The within-layer order is fixed; this phase turns it into real X coordinates
// with the priority method: sweep down and up, pulling each node toward the
// median X of its neighbours, while keeping a minimum gap and never letting a
// node cross a higher-priority one. Dummy nodes get top priority, so long edges
// straighten into vertical runs and the bends from Phase 3 disappear.
//
// The `Solver` object below implements the four phases; `Solver.solve(edges)`
// runs them in order and returns everything the chart needs to render.

// Two datasets to lay out. Flip `useComplex` to switch between them.
const useComplex = true;

// A small graph with a single feedback loop (F → A).
const simpleEdges = [
    ['A', 'B'],
    ['A', 'C'],
    ['A', 'G'],
    ['B', 'D'],
    ['C', 'D'],
    ['C', 'E'],
    ['C', 'G'],
    ['G', 'E'],
    ['D', 'F'],
    ['E', 'F'],
    ['F', 'A']
];

// A larger, tangled graph: two sources (Start branches to A/B), several
// feedback loops (F→B, K→D, M→A, N→E), long edges that span many layers
// (Start→End, H→End, A→I) and wide layers — a stress test for every phase.
const complexEdges = [
    ['Start', 'A'], ['Start', 'B'],
    ['A', 'C'], ['A', 'D'],
    ['B', 'D'], ['B', 'E'],
    ['C', 'F'], ['D', 'F'], ['D', 'G'], ['E', 'G'], ['E', 'H'],
    ['F', 'I'], ['G', 'I'], ['G', 'J'], ['H', 'J'],
    ['I', 'K'], ['J', 'K'], ['J', 'L'],
    ['K', 'M'], ['L', 'M'], ['L', 'N'],
    ['M', 'End'], ['N', 'End'],
    // Long edges spanning several layers.
    ['Start', 'End'], ['H', 'End'], ['A', 'I'],
    // Back edges, each closing a cycle.
    ['F', 'B'], ['K', 'D'], ['M', 'A'], ['N', 'E']
];

const edges = useComplex ? complexEdges : simpleEdges;

const Solver = {

    // Tunables.
    crossingReductionSweeps: 8,
    coordinateSweeps: 12,
    minSeparation: 1,

    // Build successor (`out`) and predecessor (`in`) adjacency from an edge
    // list, preserving first-seen node order for deterministic results.
    buildAdjacency(edgeList) {
        const out = new Map();
        const inn = new Map();
        const nodes = [];

        const ensure = id => {
            if (!out.has(id)) {
                out.set(id, []);
                inn.set(id, []);
                nodes.push(id);
            }
        };

        edgeList.forEach(([from, to]) => {
            ensure(from);
            ensure(to);
            out.get(from).push(to);
            inn.get(to).push(from);
        });

        return { nodes, out, inn };
    },

    // Phase 1 — Eades–Lin–Smyth GR heuristic. Returns the vertex order it
    // produces, the original edges that must be reversed, and the edge list
    // re-oriented to DAG direction (back edges flipped), each tagged.
    greedyCycleRemoval(edgeList) {
        const { nodes, out, inn } = this.buildAdjacency(edgeList);

        const outDeg = new Map();
        const inDeg = new Map();
        const removed = new Set();
        nodes.forEach(id => {
            outDeg.set(id, out.get(id).length);
            inDeg.set(id, inn.get(id).length);
        });

        const left = [];
        const right = [];

        // Removing a node lowers the degree of its present neighbours.
        const remove = id => {
            removed.add(id);
            out.get(id).forEach(to => {
                if (!removed.has(to)) {
                    inDeg.set(to, inDeg.get(to) - 1);
                }
            });
            inn.get(id).forEach(from => {
                if (!removed.has(from)) {
                    outDeg.set(from, outDeg.get(from) - 1);
                }
            });
        };

        const present = () => nodes.filter(id => !removed.has(id));

        while (removed.size < nodes.length) {
            let changed = true;
            while (changed) {
                changed = false;
                // Peel sinks to the front of `right`.
                for (const id of present()) {
                    if (outDeg.get(id) === 0) {
                        remove(id);
                        right.unshift(id);
                        changed = true;
                    }
                }
                // Peel sources to the back of `left`.
                for (const id of present()) {
                    if (inDeg.get(id) === 0) {
                        remove(id);
                        left.push(id);
                        changed = true;
                    }
                }
            }

            // Otherwise take the node with the greatest out−in degree.
            const rest = present();
            if (rest.length) {
                let best = rest[0];
                let bestScore = outDeg.get(best) - inDeg.get(best);
                rest.forEach(id => {
                    const score = outDeg.get(id) - inDeg.get(id);
                    if (score > bestScore) {
                        best = id;
                        bestScore = score;
                    }
                });
                remove(best);
                left.push(best);
            }
        }

        const order = left.concat(right);
        const rank = new Map(order.map((id, i) => [id, i]));

        // An edge u → v is a back edge when v precedes u in the order.
        const reversed = [];
        const dagEdges = edgeList.map(([from, to]) => {
            if (rank.get(to) < rank.get(from)) {
                reversed.push([from, to]);
                return { from: to, to: from, reversed: true };
            }
            return { from, to, reversed: false };
        });

        return { order, reversed, dagEdges };
    },

    // Sanity check (Kahn's algorithm): the re-oriented graph must be acyclic.
    isAcyclic(dag) {
        const { nodes, out, inn } = this.buildAdjacency(
            dag.map(e => [e.from, e.to])
        );
        const inDeg = new Map(nodes.map(id => [id, inn.get(id).length]));
        const queue = nodes.filter(id => inDeg.get(id) === 0);
        let visited = 0;
        while (queue.length) {
            const id = queue.shift();
            visited++;
            out.get(id).forEach(to => {
                inDeg.set(to, inDeg.get(to) - 1);
                if (inDeg.get(to) === 0) {
                    queue.push(to);
                }
            });
        }
        return visited === nodes.length;
    },

    // Phase 2 — Longest-path (ASAP) layering: layer(v) = 0 for sources,
    // otherwise 1 + max(layer(predecessor)). Input must be a DAG. Returns a
    // Map of node id → layer index.
    assignLayers(dag) {
        const { nodes, inn } = this.buildAdjacency(
            dag.map(e => [e.from, e.to])
        );
        const layer = new Map();

        const visit = id => {
            if (layer.has(id)) {
                return layer.get(id);
            }
            let l = 0;
            for (const pred of inn.get(id)) {
                l = Math.max(l, visit(pred) + 1);
            }
            layer.set(id, l);
            return l;
        };

        nodes.forEach(visit);
        return layer;
    },

    // Expand the DAG into a proper layered graph: an edge spanning several
    // layers is split through a chain of dummy nodes. Returns the per-layer
    // node ordering (real + dummy), `up`/`down` adjacency maps, the dummy ids,
    // and the per-layer `segments` each edge is broken into.
    buildLayeredGraph(dag, layer) {
        const layers = [];
        const up = new Map();
        const down = new Map();
        const dummies = [];
        const segments = [];
        const arrows = [];

        const place = (id, l) => {
            if (!up.has(id)) {
                up.set(id, []);
                down.set(id, []);
                (layers[l] || (layers[l] = [])).push(id);
            }
        };

        layer.forEach((l, id) => place(id, l));

        dag.forEach(({ from, to, reversed }) => {
            let prev = from;
            let second = to;
            for (let l = layer.get(from) + 1; l < layer.get(to); l++) {
                const dummy = 'dummy' + dummies.length;
                dummies.push(dummy);
                place(dummy, l);
                down.get(prev).push(dummy);
                up.get(dummy).push(prev);
                segments.push({ from: prev, to: dummy, reversed });
                if (prev === from) {
                    second = dummy;
                }
                prev = dummy;
            }
            down.get(prev).push(to);
            up.get(to).push(prev);
            segments.push({ from: prev, to, reversed });

            // Arrowhead marks the edge's original direction: into `to` for a
            // normal edge, back into `from` for a reversed one. `tail` is the
            // adjacent chain node, used only to orient the head.
            arrows.push(
                reversed ?
                    { head: from, tail: second, reversed } :
                    { head: to, tail: prev, reversed }
            );
        });

        return { layers, up, down, dummies, segments, arrows };
    },

    // Number of inversions in a sequence — the count of out-of-order pairs.
    countInversions(seq) {
        let count = 0;
        for (let i = 0; i < seq.length; i++) {
            for (let j = i + 1; j < seq.length; j++) {
                if (seq[i] > seq[j]) {
                    count++;
                }
            }
        }
        return count;
    },

    // Edge crossings between two adjacent layers, given their orderings. Walk
    // the upper layer, list each node's lower-layer neighbour slots, and count
    // inversions in the concatenated sequence.
    countCrossingsBetween(upper, lower, down) {
        const lowerPos = new Map(lower.map((id, i) => [id, i]));
        const seq = [];
        upper.forEach(u => {
            const slots = down.get(u)
                .map(v => lowerPos.get(v))
                .sort((a, b) => a - b);
            seq.push(...slots);
        });
        return this.countInversions(seq);
    },

    // Total crossings summed over every adjacent layer pair.
    totalCrossings(layers, down) {
        let total = 0;
        for (let l = 0; l < layers.length - 1; l++) {
            total += this.countCrossingsBetween(
                layers[l], layers[l + 1], down
            );
        }
        return total;
    },

    // Reorder a layer by the median position of each node's neighbours in the
    // adjacent fixed layer. Nodes with no neighbour there keep their spot.
    sortByMedian(nodes, fixed, neighbours) {
        const fixedPos = new Map(fixed.map((id, i) => [id, i]));
        const key = new Map();
        nodes.forEach((id, i) => {
            const slots = neighbours.get(id)
                .map(n => fixedPos.get(n))
                .filter(p => p !== undefined)
                .sort((a, b) => a - b);
            if (!slots.length) {
                key.set(id, i);
            } else {
                const m = Math.floor(slots.length / 2);
                key.set(
                    id,
                    slots.length % 2 ?
                        slots[m] :
                        (slots[m - 1] + slots[m]) / 2
                );
            }
        });
        return nodes
            .map((id, i) => ({ id, i }))
            .sort((a, b) => key.get(a.id) - key.get(b.id) || a.i - b.i)
            .map(o => o.id);
    },

    // Phase 3 — Median-heuristic crossing reduction: sweep down then up,
    // keeping the ordering with the fewest crossings seen.
    reduceCrossings(layers, up, down) {
        const current = layers.map(l => l.slice());
        let best = current.map(l => l.slice());
        let bestCount = this.totalCrossings(current, down);

        for (let iter = 0; iter < this.crossingReductionSweeps; iter++) {
            if (iter % 2 === 0) {
                for (let l = 1; l < current.length; l++) {
                    current[l] = this.sortByMedian(
                        current[l], current[l - 1], up
                    );
                }
            } else {
                for (let l = current.length - 2; l >= 0; l--) {
                    current[l] = this.sortByMedian(
                        current[l], current[l + 1], down
                    );
                }
            }
            const count = this.totalCrossings(current, down);
            if (count < bestCount) {
                bestCount = count;
                best = current.map(l => l.slice());
            }
        }
        return { layers: best, crossings: bestCount };
    },

    // Median X of a set of neighbour nodes (undefined if there are none).
    medianX(ids, xMap) {
        if (!ids.length) {
            return undefined;
        }
        const xs = ids.map(id => xMap.get(id)).sort((a, b) => a - b);
        const m = Math.floor(xs.length / 2);
        return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2;
    },

    // Move node `i` within its layer toward `desired`, pushing lower-priority
    // neighbours aside but stopping at the first equal-or-higher-priority node
    // (a wall), so the minimum gap is always preserved.
    placeNode(x, prio, i, desired, minSep) {
        if (desired > x[i]) {
            let wall = Infinity;
            for (let k = i + 1; k < x.length; k++) {
                if (prio[k] >= prio[i]) {
                    wall = x[k] - (k - i) * minSep;
                    break;
                }
            }
            const target = Math.min(desired, wall);
            if (target > x[i]) {
                x[i] = target;
                for (let k = i + 1; k < x.length; k++) {
                    if (x[k] >= x[k - 1] + minSep) {
                        break;
                    }
                    x[k] = x[k - 1] + minSep;
                }
            }
        } else if (desired < x[i]) {
            let wall = -Infinity;
            for (let k = i - 1; k >= 0; k--) {
                if (prio[k] >= prio[i]) {
                    wall = x[k] + (i - k) * minSep;
                    break;
                }
            }
            const target = Math.max(desired, wall);
            if (target < x[i]) {
                x[i] = target;
                for (let k = i - 1; k >= 0; k--) {
                    if (x[k] <= x[k + 1] - minSep) {
                        break;
                    }
                    x[k] = x[k + 1] - minSep;
                }
            }
        }
    },

    // Position one layer: give each node its desired X in order of priority
    // (highest first), so high-priority nodes settle before lower ones move.
    positionLayer(nodes, desired, xMap, prioMap, minSep) {
        const x = nodes.map(id => xMap.get(id));
        const prio = nodes.map(id => prioMap.get(id));
        const byPriority = nodes
            .map((id, i) => i)
            .sort((a, b) => prio[b] - prio[a]);
        for (const i of byPriority) {
            const d = desired.get(nodes[i]);
            if (d !== undefined) {
                this.placeNode(x, prio, i, d, minSep);
            }
        }
        nodes.forEach((id, i) => xMap.set(id, x[i]));
    },

    // Phase 4 — Priority-method coordinate assignment. Dummy nodes get top
    // priority (so long edges straighten); real nodes are ranked by degree.
    // Returns a map of node id → X coordinate in arbitrary units.
    assignCoordinates(layers, up, down, dummies) {
        const minSep = this.minSeparation;
        const dummySet = new Set(dummies);
        const xMap = new Map();
        const prioMap = new Map();

        layers.forEach(ids => ids.forEach((id, i) => {
            xMap.set(id, i);
            prioMap.set(
                id,
                dummySet.has(id) ?
                    Infinity :
                    up.get(id).length + down.get(id).length
            );
        }));

        const sweep = (l, neighbours) => {
            const desired = new Map();
            layers[l].forEach(id => {
                const d = this.medianX(neighbours.get(id), xMap);
                if (d !== undefined) {
                    desired.set(id, d);
                }
            });
            this.positionLayer(layers[l], desired, xMap, prioMap, minSep);
        };

        for (let iter = 0; iter < this.coordinateSweeps; iter++) {
            if (iter % 2 === 0) {
                for (let l = 1; l < layers.length; l++) {
                    sweep(l, up);
                }
            } else {
                for (let l = layers.length - 2; l >= 0; l--) {
                    sweep(l, down);
                }
            }
        }
        return xMap;
    },

    // Turn layer indices and X coordinates into fractional (0–1) positions: Y
    // from the layer (layer 0 at top), X normalised into a [0.1, 0.9] band.
    positionsFromCoordinates(layers, xMap) {
        const maxLayer = layers.length - 1;
        let minX = Infinity;
        let maxX = -Infinity;
        xMap.forEach(x => {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
        });
        const span = maxX - minX || 1;

        const pos = {};
        layers.forEach((ids, l) => {
            const y = maxLayer === 0 ? 0.5 : (l + 1) / (maxLayer + 2);
            ids.forEach(id => {
                pos[id] = { x: 0.1 + 0.8 * (xMap.get(id) - minX) / span, y };
            });
        });
        return pos;
    },

    // Run all four phases and return everything the chart needs to render.
    solve(edgeList) {
        const { order, reversed, dagEdges } =
            this.greedyCycleRemoval(edgeList);
        const layer = this.assignLayers(dagEdges);
        const { layers, up, down, dummies, segments, arrows } =
            this.buildLayeredGraph(dagEdges, layer);
        const crossingsBefore = this.totalCrossings(layers, down);
        const reduced = this.reduceCrossings(layers, up, down);
        const xMap = this.assignCoordinates(
            reduced.layers, up, down, dummies
        );
        const positions = this.positionsFromCoordinates(
            reduced.layers, xMap
        );

        return {
            order,
            reversed,
            dagEdges,
            layer,
            layers: reduced.layers,
            dummies,
            segments,
            arrows,
            positions,
            crossingsBefore,
            crossingsAfter: reduced.crossings
        };
    }
};

const {
    order,
    reversed,
    dagEdges,
    layer,
    layers,
    dummies,
    segments,
    arrows,
    positions,
    crossingsBefore,
    crossingsAfter
} = Solver.solve(edges);

// Make the result observable.
console.log('vertex order:', order.join(' → '));
console.log('reversed edges:', reversed);
console.table(dagEdges);
console.assert(
    Solver.isAcyclic(dagEdges),
    'cycle removal failed: still cyclic'
);
console.table(
    order.map(id => ({ node: id, layer: layer.get(id) }))
);
console.log(
    'crossings:', crossingsBefore, '→', crossingsAfter,
    '\nlayer orders:', layers.map(l => l.join(' ')).join(' | ')
);

// Render each edge as its chain of segments so long (and reversed) edges bend
// through their dummy lane instead of cutting straight across the chart.
// Reversed segments are styled distinctly so the flip stays visible.
const seriesData = segments.map(seg => Object.assign(
    { from: seg.from, to: seg.to },
    seg.reversed ? { color: '#e6373b', dashStyle: 'Dash' } : {}
));

// Dummy nodes only exist to route long edges — hide them. They need a non-zero
// mass: a chain of zero-mass nodes makes the layout's force integration divide
// by zero and collapse them to (0, 0).
const nodeOptions = dummies.map(id => ({
    id,
    mass: 1,
    marker: { radius: 0 },
    dataLabels: { enabled: false }
}));

// Networkgraph has no built-in arrowheads, so draw one at the head of every
// edge after each layout, pointing in the edge's original direction (reversed
// back-edges point back up into their target, matching the red dashed style).
function drawArrows(chart) {
    const series = chart.series[0];
    if (!series) {
        return;
    }
    if (chart.flowArrows) {
        chart.flowArrows.destroy();
    }
    const group = chart.flowArrows = chart.renderer.g('flow-arrows')
        .attr({ zIndex: 4 })
        .add();

    const nodeById = {};
    series.nodes.forEach(node => {
        nodeById[node.id] = node;
    });

    arrows.forEach(arrow => {
        const head = nodeById[arrow.head];
        const tail = nodeById[arrow.tail];
        if (!head || !tail) {
            return;
        }

        const hx = chart.plotLeft + head.plotX;
        const hy = chart.plotTop + head.plotY;
        let dx = hx - (chart.plotLeft + tail.plotX);
        let dy = hy - (chart.plotTop + tail.plotY);
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        dx /= len;
        dy /= len;

        // Tip sits on the node's edge; base and the two wings make a triangle.
        const radius = (head.graphic && head.graphic.attr('r')) || 6;
        const length = 9;
        const halfWidth = 4;
        const tipX = hx - dx * radius;
        const tipY = hy - dy * radius;
        const baseX = tipX - dx * length;
        const baseY = tipY - dy * length;

        chart.renderer
            .path([
                ['M', tipX, tipY],
                ['L', baseX - dy * halfWidth, baseY + dx * halfWidth],
                ['L', baseX + dy * halfWidth, baseY - dx * halfWidth],
                ['Z']
            ])
            .attr({ fill: arrow.reversed ? '#e6373b' : '#34495e' })
            .add(group);
    });
}

const chart = Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        // Redraw arrows on resize; the layout has already repositioned nodes
        // by the time this fires.
        events: {
            redraw() {
                drawArrows(this);
            }
        }
    },

    title: {
        text: 'Flowchart layout — coordinate assignment'
    },

    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: false,
                // Gravity turned off: nodes are not pulled toward the center.
                gravitationalConstant: 0,
                // Attraction (along links) and repulsion (between nodes)
                // turned off: both forces return zero.
                attractiveForce: function () {
                    return 0;
                },
                repulsiveForce: function () {
                    return 0;
                },
                // Place each node at its own starting position.
                initialPositions: function () {
                    const box = this.box;
                    this.nodes.forEach(function (node) {
                        const pos = positions[node.id] || { x: 0.5, y: 0.5 };
                        node.plotX = node.prevX = pos.x * box.width;
                        node.plotY = node.prevY = pos.y * box.height;
                        node.dispX = 0;
                        node.dispY = 0;
                    });
                }
            }
        }
    },

    series: [{
        name: 'Connections',
        keys: ['from', 'to'],
        data: seriesData,
        nodes: nodeOptions,
        dataLabels: {
            enabled: true,
            linkFormat: ''
        }
    }]
});

// Initial arrow draw. The layout runs synchronously (simulation disabled), so
// node positions are already final by the time the chart is returned.
drawArrows(chart);
