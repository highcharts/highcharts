// A `flowchart` series type, defined here as a custom extension of
// `networkgraph`, that lays out its nodes and links automatically using a
// Sugiyama-style layered layout, instead of a force simulation.
//
// Phase 1 — Cycle removal.
// A layered layout requires a DAG, but flowcharts contain feedback loops. This
// step reverses a small set of "back" edges so every cycle is broken, using the
// greedy heuristic of Eades, Lin & Smyth (1993). Reversed edges are recorded so
// the arrowhead can still be drawn in the data's original direction.
//
// Phase 2 — Layer assignment.
// Each node is ranked into a horizontal layer by longest-path (ASAP) layering:
// sources sit in layer 0, every other node one layer below its deepest
// predecessor. The layer drives the node's Y position.
//
// Phase 3 — Crossing reduction.
// Edges that span more than one layer are broken with dummy nodes so every edge
// connects adjacent layers. Nodes within each layer are then reordered with the
// median heuristic, sweeping down and up until crossings stop dropping. Dummy
// nodes exist only inside this computation — they never become series points,
// they just bend the real edge's rendered path into a polyline.
//
// Phase 4 — Coordinate assignment.
// The within-layer order is fixed; this phase turns it into real X coordinates
// with the priority method: sweep down and up, pulling each node toward the
// median X of its neighbours, while keeping a minimum gap and never letting a
// node cross a higher-priority one. Dummy nodes get top priority, so long edges
// straighten into vertical runs and the bends from Phase 3 disappear.
//
// `FlowchartLayout.solve(edges)` runs all four phases and returns the
// fractional node positions plus, per edge, the chain of waypoint ids to
// route it through.
// The `flowchart` series (defined below) calls this once per `translate()` and
// renders the result directly — no manual positioning or arrow-drawing code is
// needed in chart configs that use it.

// Three datasets to lay out. Flip `datasetName` to switch between them.
const datasetName = 'realistic';

// Debugging aid: show the internal dummy points long edges are routed
// through (see `series.debug` on the `flowchart` series defined below).
const showDummyPoints = true;

// A small graph with a single feedback loop (F → A). The loop-closing edge
// is labeled so it reads the same way in the chart as it does in this
// comment, rather than only being visible as a dashed/reversed styling cue.
const simpleEdges = [
    ['A', 'B', ''],
    ['A', 'C', ''],
    ['A', 'G', ''],
    ['B', 'D', ''],
    ['C', 'D', ''],
    ['C', 'E', ''],
    ['C', 'G', ''],
    ['G', 'E', ''],
    ['D', 'F', ''],
    ['E', 'F', ''],
    ['F', 'A', 'loop back']
];

// A larger, tangled graph: two sources (Start branches to A/B), several
// feedback loops (F→B, K→D, M→A, N→E), long edges that span many layers
// (Start→End, H→End, A→I) and wide layers — a stress test for every phase.
// As with `simpleEdges`, the back edges and long edges are labeled so the
// phases they exercise are visible on the chart, not just in this comment.
const complexEdges = [
    ['Start', 'A', ''], ['Start', 'B', ''],
    ['A', 'C', ''], ['A', 'D', ''],
    ['B', 'D', ''], ['B', 'E', ''],
    ['C', 'F', ''], ['D', 'F', ''], ['D', 'G', ''], ['E', 'G', ''],
    ['E', 'H', ''],
    ['F', 'I', ''], ['G', 'I', ''], ['G', 'J', ''], ['H', 'J', ''],
    ['I', 'K', ''], ['J', 'K', ''], ['J', 'L', ''],
    ['K', 'M', ''], ['L', 'M', ''], ['L', 'N', ''],
    ['M', 'End', ''], ['N', 'End', ''],
    // Long edges spanning several layers.
    ['Start', 'End', 'shortcut'], ['H', 'End', 'shortcut'],
    ['A', 'I', 'shortcut'],
    // Back edges, each closing a cycle.
    ['F', 'B', 'loop back'], ['K', 'D', 'loop back'],
    ['M', 'A', 'loop back'], ['N', 'E', 'loop back']
];

// An order-fulfillment process: two retry loops (a backorder waiting on
// restock, a payment retry) closing cycles back onto earlier steps, two
// decisions, and two ways to reach the end (a shipped order or a
// cancellation) - a realistic flowchart rather than an abstract graph.
//
// Each edge is a `[from, to, text]` triple; `text` labels what that path
// out of a decision (or loop) represents, and is left empty ('') for the
// edges that don't need one.
const realisticEdges = [
    ['Start', 'ReceiveOrder', ''],
    ['ReceiveOrder', 'CheckInventory', ''],
    ['CheckInventory', 'InStock', ''],
    ['InStock', 'ProcessPayment', 'Yes'],
    ['InStock', 'Backorder', 'No'],
    // Back edge: wait for restock, then check again.
    ['Backorder', 'CheckInventory', 'Restocked'],
    ['Backorder', 'CancelOrder', 'Unable'],
    ['ProcessPayment', 'PaymentValid', ''],
    ['PaymentValid', 'ShipItem', 'Yes'],
    ['PaymentValid', 'RequestRetry', 'No'],
    // Back edge: retry payment.
    ['RequestRetry', 'ProcessPayment', 'Retry'],
    ['RequestRetry', 'CancelOrder', 'Give up'],
    ['CancelOrder', 'End', ''],
    ['ShipItem', 'NotifyCustomer', ''],
    ['NotifyCustomer', 'End', '']
];

// Node shapes/labels for each dataset, in classic flowchart style: ovals
// for start/end terminals, diamonds for decisions, rectangles (the
// `flowchart` series' default `nodeShape`, so left unlisted here) for
// everything else.
const nodeShapesByDataset = {
    simple: [
        { id: 'A', shape: 'oval' },
        { id: 'F', shape: 'oval' },
        { id: 'D', shape: 'diamond' }
    ],
    complex: [
        { id: 'Start', shape: 'oval' },
        { id: 'End', shape: 'oval' },
        { id: 'A', shape: 'diamond' },
        { id: 'J', shape: 'diamond' }
    ],
    realistic: [
        { id: 'Start', shape: 'oval' },
        { id: 'End', shape: 'oval', name: 'Order closed' },
        { id: 'ReceiveOrder', name: 'Receive order' },
        { id: 'CheckInventory', name: 'Check inventory' },
        { id: 'InStock', shape: 'diamond', name: 'In stock?' },
        { id: 'Backorder', name: 'Backorder item' },
        { id: 'ProcessPayment', name: 'Process payment' },
        { id: 'PaymentValid', shape: 'diamond', name: 'Payment valid?' },
        { id: 'RequestRetry', name: 'Request retry' },
        { id: 'CancelOrder', name: 'Cancel order' },
        { id: 'ShipItem', name: 'Ship item' },
        { id: 'NotifyCustomer', name: 'Notify customer' }
    ]
};

const datasets = {
    simple: simpleEdges,
    complex: complexEdges,
    realistic: realisticEdges
};

const edges = datasets[datasetName];
const nodeShapes = nodeShapesByDataset[datasetName];

const FlowchartLayout = {

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
    // layers is split through a chain of dummy nodes, which exist only for
    // this computation. Returns the per-layer node ordering (real + dummy),
    // `up`/`down` adjacency maps, the dummy ids, and — per original edge, in
    // input order — the full `[from, ...dummyChain, to]` id chain it routes
    // through.
    buildLayeredGraph(dag, layer) {
        const layers = [];
        const up = new Map();
        const down = new Map();
        const dummies = [];
        const waypointIds = [];

        const place = (id, l) => {
            if (!up.has(id)) {
                up.set(id, []);
                down.set(id, []);
                (layers[l] || (layers[l] = [])).push(id);
            }
        };

        layer.forEach((l, id) => place(id, l));

        dag.forEach(({ from, to }) => {
            const chain = [from];
            let prev = from;
            for (let l = layer.get(from) + 1; l < layer.get(to); l++) {
                const dummy = 'dummy' + dummies.length;
                dummies.push(dummy);
                place(dummy, l);
                down.get(prev).push(dummy);
                up.get(dummy).push(prev);
                chain.push(dummy);
                prev = dummy;
            }
            down.get(prev).push(to);
            up.get(to).push(prev);
            chain.push(to);
            waypointIds.push(chain);
        });

        return { layers, up, down, dummies, waypointIds };
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

    // The priority method only ever pulls a node toward its neighbours'
    // median - there's nothing keeping a whole layer's coordinate frame
    // anchored to any particular center. A long edge's dummy chain (top
    // priority throughout) drags the layers it passes through toward
    // wherever *it* settles, and lower-priority real nodes get pushed along
    // for the ride with no compensating pull back the other way. Left
    // unchecked this compounds layer after layer, so nodes drift further
    // off-center the deeper the layer.
    //
    // The fix doesn't touch the sweeps themselves - it re-centers each
    // layer afterwards, shifting every node in it (real and dummy alike, so
    // edges bending through a layer's dummies stay consistent with that
    // layer's real nodes) so the layer's own bounding range is centered on
    // the same point as the graph's overall bounding range. Relative
    // spacing and order within a layer - and therefore the crossing count -
    // are unaffected, since a layer only ever moves as a rigid block.
    centerLayers(layers, xMap) {
        let minX = Infinity;
        let maxX = -Infinity;
        xMap.forEach(x => {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
        });
        const globalCenter = (minX + maxX) / 2;

        const centered = new Map();
        layers.forEach(ids => {
            let layerMin = Infinity;
            let layerMax = -Infinity;
            ids.forEach(id => {
                layerMin = Math.min(layerMin, xMap.get(id));
                layerMax = Math.max(layerMax, xMap.get(id));
            });
            const offset = globalCenter - (layerMin + layerMax) / 2;
            ids.forEach(id => centered.set(id, xMap.get(id) + offset));
        });
        return centered;
    },

    // Turn layer indices and X coordinates into fractional (0–1) positions: Y
    // from the layer (layer 0 at top), X normalised into a [0.1, 0.9] band.
    positionsFromCoordinates(layers, xMap) {
        const maxLayer = layers.length - 1;
        const centeredXMap = this.centerLayers(layers, xMap);

        let minX = Infinity;
        let maxX = -Infinity;
        centeredXMap.forEach(x => {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
        });
        const span = maxX - minX || 1;

        const pos = {};
        layers.forEach((ids, l) => {
            const y = maxLayer === 0 ? 0.5 : (l + 1) / (maxLayer + 2);
            ids.forEach(id => {
                pos[id] = {
                    x: 0.1 + 0.8 * (centeredXMap.get(id) - minX) / span,
                    y
                };
            });
        });
        return pos;
    },

    // Run all four phases and return everything the series needs to render:
    // fractional node positions, and, per input edge (same order as
    // `edgeList`), whether it was reversed and the waypoint id chain to route
    // it through — already re-oriented to the ORIGINAL from → to direction,
    // so an arrowhead drawn at the end of the chain always lands on the
    // data's real `to` node, even for a back edge that renders going "up".
    solve(edgeList) {
        const { order, reversed, dagEdges } =
            this.greedyCycleRemoval(edgeList);
        const layer = this.assignLayers(dagEdges);
        const { layers, up, down, dummies, waypointIds } =
            this.buildLayeredGraph(dagEdges, layer);
        const crossingsBefore = this.totalCrossings(layers, down);
        const reduced = this.reduceCrossings(layers, up, down);
        const xMap = this.assignCoordinates(
            reduced.layers, up, down, dummies
        );
        const positions = this.positionsFromCoordinates(
            reduced.layers, xMap
        );

        const edges = dagEdges.map((dagEdge, i) => ({
            reversed: dagEdge.reversed,
            waypointIds: dagEdge.reversed ?
                waypointIds[i].slice().reverse() :
                waypointIds[i]
        }));

        return {
            order,
            reversed,
            dagEdges,
            layer,
            positions,
            edges,
            crossingsBefore,
            crossingsAfter: reduced.crossings
        };
    }
};

// Make the algorithm's behaviour on this dataset observable, independently of
// the chart below (which runs the same solver internally, per series).
(function () {
    const solved = FlowchartLayout.solve(edges);
    console.log('vertex order:', solved.order.join(' → '));
    console.log('reversed edges:', solved.reversed);
    console.table(solved.dagEdges);
    console.assert(
        FlowchartLayout.isAcyclic(solved.dagEdges),
        'cycle removal failed: still cyclic'
    );
    console.table(
        solved.order.map(id => ({ node: id, layer: solved.layer.get(id) }))
    );
    console.log(
        'crossings:', solved.crossingsBefore, '→', solved.crossingsAfter
    );
}());

// Define the `flowchart` series type: a `networkgraph` extension that lays
// out its nodes with `FlowchartLayout` instead of a force simulation, and
// draws its links as bent polylines with arrowheads.
(function (H) {

    const NetworkgraphPointClass =
        H.seriesTypes.networkgraph.prototype.pointClass;

    // A full ellipse, drawn as two 180° arcs since an SVG path has no
    // native ellipse primitive - registered as a symbol so "oval" nodes go
    // through the same marker pipeline (states, halo, dragging) as the
    // built-in 'circle'/'square'/'diamond' shapes.
    H.SVGRenderer.prototype.symbols.oval = function (x, y, w, h) {
        return [
            ['M', x, y + h / 2],
            ['A', w / 2, h / 2, 0, 1, 0, x + w, y + h / 2],
            ['A', w / 2, h / 2, 0, 1, 0, x, y + h / 2],
            ['Z']
        ];
    };

    const SYMBOL_BY_SHAPE = {
        rectangle: 'square',
        oval: 'oval',
        diamond: 'diamond'
    };

    const SHAPE_PADDING = { x: 16, y: 10 };
    const MIN_SHAPE_SIZE = { width: 60, height: 36 };

    // Box dimensions that exactly inscribe a `textWidth`×`textHeight` box
    // (already padded) for the given shape:
    // - rectangle: the padded text box itself.
    // - diamond: a rhombus with half-diagonals p, q inscribes a rectangle
    //   of half-extents (rw, rh) exactly at its tightest fit when
    //   rw/p + rh/q = 1; choosing p = 2·rw, q = 2·rh satisfies that (both
    //   terms become 1/2), so the diamond's full width/height are simply
    //   double the text box's.
    // - oval: an ellipse with semi-axes a, b inscribes a rectangle of
    //   half-extents (rw, rh) exactly at its tightest fit when
    //   (rw/a)² + (rh/b)² = 1; choosing a = rw·√2, b = rh·√2 satisfies
    //   that, so the oval's full width/height are the text box's × √2.
    function shapeSize(shape, textWidth, textHeight) {
        const w = textWidth + SHAPE_PADDING.x * 2;
        const h = textHeight + SHAPE_PADDING.y * 2;
        const scale = shape === 'diamond' ? 2 :
            shape === 'oval' ? Math.SQRT2 : 1;

        return {
            width: Math.max(MIN_SHAPE_SIZE.width, w * scale),
            height: Math.max(MIN_SHAPE_SIZE.height, h * scale)
        };
    }

    // Distance from a shape's center to its boundary along a (unit)
    // direction (dx, dy) - used to pull an arrow's tip back to the node's
    // actual edge instead of its center, whichever of the three shapes the
    // node is. Each is the standard closed-form "ray from center to
    // boundary" formula for that shape.
    function shapeBoundaryDistance(shape, halfWidth, halfHeight, dx, dy) {
        if (shape === 'diamond') {
            const denom = Math.abs(dx) / halfWidth + Math.abs(dy) / halfHeight;
            return denom ? 1 / denom : 0;
        }
        if (shape === 'oval') {
            const denom = Math.sqrt(
                (dx / halfWidth) ** 2 + (dy / halfHeight) ** 2
            );
            return denom ? 1 / denom : 0;
        }
        // Rectangle.
        const denom = Math.max(
            Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight
        );
        return denom ? 1 / denom : 0;
    }

    // Measures `text` as it would render with `style` applied, using a
    // throwaway SVG text element. Only the node's plain name/id is
    // measured (not a custom `dataLabels.formatter` result, if one is
    // set) - close enough to size a box around the label that's actually
    // shown for the simple text labels this demo uses.
    function measureText(chart, text, style) {
        const el = chart.renderer.text(text).css(style).add();
        const bbox = el.getBBox();
        el.destroy();
        return { width: bbox.width, height: bbox.height };
    }

    const FlowchartSeries = H.seriesType('flowchart', 'networkgraph', {
        draggable: false,
        marker: {
            radius: 16
        },
        // Default shape for nodes that don't set their own via
        // `nodes: [{ id, shape }]` - one of 'rectangle', 'oval', 'diamond'.
        nodeShape: 'rectangle',
        nodeLabelStyle: {
            fontSize: '12px',
            fontWeight: 'bold'
        },
        // A link's data label (see `dataLabels.linkFormatter` below) shows
        // whatever `text` came in on that edge's `[from, to, text]` data,
        // e.g. "Yes"/"No" out of a decision. Applied per-point in
        // `translate()`, not here, so it only ever affects link labels,
        // never node ones.
        //
        // Color uses Highcharts' own `--highcharts-neutral-color-100` CSS
        // custom property (the same one its default styles use) instead of
        // a fixed hex value, so both light and dark mode stay readable - a
        // fixed dark gray blends into a dark background. This is a plain
        // `var(...)` reference, not the fancier nested `color(from ...)`
        // contrast expression the *node* labels deliberately avoid below
        // (see that comment) - single-level `var()` doesn't have the same
        // paint-vs-compute discrepancy.
        linkLabelOptions: {
            style: {
                color: 'var(--highcharts-neutral-color-100)',
                fontSize: '11px',
                fontWeight: 'normal',
                textOutline: 'none'
            }
        },
        // Text inside the shape is a node's whole point, so it's on by
        // default here rather than left for chart configs to opt into.
        //
        // Color/textOutline are set explicitly (matching `nodeLabelStyle`,
        // which `measureText` uses to size each shape around this same
        // text) rather than left at the inherited 'contrast'/'{point.color}'
        // defaults, which resolve via a CSS relative-color() expression -
        // some browsers compute it fine for getComputedStyle() but fail to
        // actually paint with it, silently leaving the label invisible.
        //
        // `align`/`verticalAlign`/`x`/`y` are pinned to dead-center too:
        // the inherited networkgraph default (`verticalAlign: 'bottom'`)
        // was tuned to roughly center a label over a small circular
        // marker, which no longer holds now that node boxes are sized to
        // the label itself and vary a lot in height (a short oval vs. a
        // tall diamond).
        dataLabels: {
            enabled: true,
            // `linkFormat` (even as an empty string) always takes
            // precedence over `linkFormatter`, so the edge's own `text` -
            // absent from a plain `[from, to]` pair - has to be read via
            // the formatter instead.
            linkFormatter: function () {
                return this.options.text || '';
            },
            // The inherited `networkgraph` default has this on, which
            // draws a link's label following the curve it's attached to
            // (rotated with it) rather than as plain horizontal text - and
            // per its own doc comment, disables the label's background and
            // border while it's on, which is why `linkLabelOptions`'s
            // backing plate wasn't showing up either.
            linkTextPath: {
                enabled: false
            },
            align: 'center',
            verticalAlign: 'middle',
            x: 0,
            y: 0,
            style: {
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold',
                textOutline: '1.5px rgba(0,0,0,0.6)',
                // The inherited `networkgraph` default is 2000ms - tuned
                // for labels gradually fading in as a force simulation
                // settles, which this series never runs. Left as-is, a
                // hovered node's own opacity change (`states.inactive`,
                // 50ms) finishes 40x faster than its label's, so the label
                // visibly lags behind the shape/link it belongs to. Match
                // that 50ms here so both fade together.
                transition: 'opacity 50ms'
            }
        },
        // Extends the inherited `['from', 'to']` so plain array data can be
        // given as `[from, to, text]`.
        pointArrayMap: ['from', 'to', 'text'],
        link: {
            // Same reasoning as `linkLabelOptions`: a fixed gray (the
            // inherited networkgraph default is `rgba(100, 100, 100,
            // 0.5)`) reads fine on a light background and disappears into
            // a dark one. `getArrowPath()`'s fill follows this same color
            // (it reads the link's own resolved `stroke`), so the
            // arrowhead adapts along with the line.
            color: 'var(--highcharts-neutral-color-60)',
            width: 1.5,
            arrowLength: 10,
            arrowWidth: 8
        },
        // Style override applied (in `translate()`) to a reversed link -
        // a "back" edge the cycle-removal phase flipped to lay the graph
        // out as a DAG, so it renders going against the general top-to-
        // bottom flow. `dashStyle`/`color` are read via the inherited
        // `NetworkgraphPoint.getLinkAttributes()`, which already prefers a
        // point's own `options.dashStyle`/`options.color` over the
        // series-level `link` defaults above - no extra rendering code
        // needed here, just per-point option overrides.
        reversedLink: {
            dashStyle: 'Dash'
        },
        // Debugging aid: the internal dummy nodes a long edge is routed
        // through (see `FlowchartLayout.buildLayeredGraph`) never become
        // real series points, so there is nothing to inspect on them by
        // default. Turning this on draws a small marker at each one.
        debug: {
            dummyPoints: false,
            dummyPointRadius: 3,
            dummyPointColor: '#e6373b'
        }
    }, {
        // Run the full layout once and assign final positions directly -
        // there is no force simulation to defer to.
        translate: function () {
            this.generatePoints();

            // The inherited `networkgraph` series defers data labels until
            // an `afterSimulation` event that never fires here.
            this.deferDataLabels = false;

            const chart = this.chart;
            const toPixels = pos => ({
                x: pos.x * chart.plotWidth,
                y: pos.y * chart.plotHeight
            });

            const solved = FlowchartLayout.solve(
                this.points.map(point => [point.from, point.to])
            );

            this.nodes.forEach(node => {
                // A node with no edges left (e.g. after removing its only
                // link) never appears in the solver's graph, so it has no
                // solved position - fall back to the plot area's center.
                const pixel = toPixels(
                    solved.positions[node.id] || { x: 0.5, y: 0.5 }
                );
                node.plotX = pixel.x;
                node.plotY = pixel.y;
                node.isInside = true;

                const shape = node.options.shape || this.options.nodeShape;
                const text = measureText(
                    chart, node.name, this.options.nodeLabelStyle
                );
                const box = shapeSize(shape, text.width, text.height);
                node.shape = shape;
                node.shapeWidth = box.width;
                node.shapeHeight = box.height;
                node.marker = H.merge(node.marker, {
                    symbol: SYMBOL_BY_SHAPE[shape]
                });
            });

            this.points.forEach((point, i) => {
                const edge = solved.edges[i];
                point.reversed = edge.reversed;
                if (point.reversed) {
                    const { dashStyle, color } = this.options.reversedLink;
                    point.options.dashStyle = dashStyle;
                    point.options.color = color;
                } else {
                    // Left undefined, a hover's hand-off from active to
                    // inactive state animates every changed link attribute
                    // together, `dashstyle` included - and, unlike the
                    // numeric ones, that setter has no defined value to
                    // animate *from*, which throws (`value.toLowerCase`
                    // on an in-between numeric tween value) partway
                    // through. Every link needs some real dash style, not
                    // just reversed ones.
                    point.options.dashStyle = 'Solid';
                }
                point.waypoints = edge.waypointIds.map(
                    id => toPixels(solved.positions[id])
                );
                point.shapeType = 'path';
                point.y = 1;

                // Only affects this link's own label - applied per-point
                // rather than at the series level, which would also (and
                // wrongly) restyle every node's label.
                point.options.dataLabels = H.merge(
                    point.options.dataLabels, this.options.linkLabelOptions
                );

                // `redrawLink()` recomputes this same anchor once the link
                // is actually rendered, but data labels can be drawn/
                // aligned before that first happens - and merely updating
                // `plotX`/`plotY` later doesn't move an already-rendered
                // label, so without the correct position here already, the
                // label gets stuck wherever it was first placed
                // (previously: a raw waypoint - visibly wrong when that
                // waypoint is a dummy point mid-edge - or, before that fix,
                // undefined, which `alignDataLabel` treated as outside the
                // plot and hid permanently) until some unrelated redraw
                // (e.g. a hover) forces a fresh alignment. Calling the
                // point's own `getLinkPath()` (rather than re-deriving the
                // same thing by hand) keeps this provisional value
                // identical to what `redrawLink()` computes, trimmed
                // endpoints included.
                const mid = pathMidpoint(point.getLinkPath());
                point.plotX = mid.x;
                point.plotY = mid.y;
            });
        },

        // The inherited `networkgraph` `setState` only re-renders once its
        // force simulation has settled. This series has no simulation, so
        // the layout is always considered settled.
        setState: function (state, inherit) {
            if (inherit) {
                this.points = this.nodes.concat(this.data);
                H.Series.prototype.setState.apply(this, arguments);
                this.points = this.data;
            } else {
                H.Series.prototype.setState.apply(this, arguments);
            }
            if (!state) {
                this.render();
            }
        },

        // Render nodes and links as usual, then (re)draw the debug overlay.
        render: function () {
            H.seriesTypes.networkgraph.prototype.render.call(this);
            this.renderDebugPoints();
        },

        // Nodes get a box sized to their shape and label (computed in
        // `translate()`) instead of the inherited networkgraph behaviour of
        // a single `radius` producing a fixed-size square bounding box.
        markerAttribs: function (point, state) {
            if (!point.isNode) {
                return H.seriesTypes.networkgraph.prototype.markerAttribs
                    .call(this, point, state);
            }
            return {
                x: point.plotX - point.shapeWidth / 2,
                y: point.plotY - point.shapeHeight / 2,
                width: point.shapeWidth,
                height: point.shapeHeight
            };
        },

        // Debugging aid: draw a marker at every internal dummy waypoint a
        // link was routed through - the points that make long edges bend,
        // but that are otherwise invisible since they never become real
        // series points. Rebuilt on every render so it stays in sync with
        // `translate()` and can be toggled live via `chart.update()`.
        //
        // Old markers are cleared by querying the DOM rather than by
        // destroying a tracked-elements array kept on the series instance:
        // `series.update()` reacts to an unrecognised option key (like our
        // `debug` option) by deleting most non-standard own properties and
        // re-running `init()` on the same instance - which would silently
        // wipe a tracked array without destroying what it pointed to,
        // orphaning the old markers. `this.group`'s DOM node is one of the
        // few things `update()` deliberately preserves across that reinit
        // (so graphics don't have to be torn down and rebuilt), so reading
        // it back from there is what actually survives.
        renderDebugPoints: function () {
            [...this.group.element.querySelectorAll(
                '.highcharts-flowchart-dummy-point'
            )].forEach(el => el.remove());

            const debugOptions = this.options.debug;
            if (!debugOptions || !debugOptions.dummyPoints) {
                return;
            }

            const renderer = this.chart.renderer;
            const radius = debugOptions.dummyPointRadius;
            const color = debugOptions.dummyPointColor;

            this.points.forEach(point => {
                point.waypoints.slice(1, -1).forEach(p => {
                    renderer.circle(p.x, p.y, radius)
                        .addClass('highcharts-flowchart-dummy-point', true)
                        .attr({ fill: color, 'stroke-width': 0 })
                        .add(this.group);
                });
            });
        }
    });

    // Returns a smooth SVG path (`M`, quadratic `Q` and a final `L`) that
    // starts and ends exactly on the first/last point in `points`, but only
    // loosely follows any points in between.
    //
    // The previous approach (Catmull-Rom) *interpolated* every point: the
    // curve was forced to pass exactly through each dummy waypoint, which
    // still produced visible zigzags whenever three consecutive waypoints
    // weren't already close to collinear, since the curve had no freedom to
    // round that corner off - it had to visit it exactly.
    //
    // Instead, each interior waypoint is used as the *control* point of a
    // quadratic Bezier ending at the midpoint between it and the next
    // waypoint, a standard technique for smoothing a polyline into a curve
    // that only needs to hit its true endpoints: consecutive segments share
    // their tangent direction at every midpoint join (the curve is smooth,
    // not just visually close), while a sharp zigzag between waypoints gets
    // rounded off instead of reproduced. The final short stretch back to
    // the real end point is a straight line, but one that continues the
    // same tangent the curve already had, so it reads as part of the same
    // smooth stroke rather than a kink.
    function smoothLinkPath(points) {
        if (points.length < 3) {
            return points.map((p, i) => [i === 0 ? 'M' : 'L', p.x, p.y]);
        }

        const path = [['M', points[0].x, points[0].y]];
        for (let i = 1; i < points.length - 1; i++) {
            const control = points[i];
            const next = points[i + 1];
            path.push([
                'Q',
                control.x, control.y,
                (control.x + next.x) / 2, (control.y + next.y) / 2
            ]);
        }
        const last = points[points.length - 1];
        path.push(['L', last.x, last.y]);
        return path;
    }

    // A link's data label anchor: the midpoint of the *rendered curve's*
    // middle segment - not one of the raw waypoints it was built from,
    // which for an edge with an odd number of waypoints is the actual
    // dummy point the layout routed it through (visibly wrong: the label
    // would sit right on top of a node-sized gap where nothing is drawn).
    // Each segment's endpoint is always its last two entries, whether it's
    // a straight 'L' (`[cmd, x, y]`) or a curved 'Q'/'C'.
    function pathMidpoint(path) {
        const end = segment => ({
            x: segment[segment.length - 2],
            y: segment[segment.length - 1]
        });
        const mid = Math.max(0, Math.floor((path.length - 2) / 2));
        const p0 = end(path[mid]);
        const p1 = end(path[mid + 1]);
        return { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    }

    class FlowchartPoint extends NetworkgraphPointClass {

        // A smooth curve through the waypoints computed in `translate()`,
        // instead of a straight line between the two nodes. Interior
        // waypoints (from routing through internal dummy nodes) are only
        // followed loosely, so the curve can round off a zigzag instead of
        // having to visit every bend exactly.
        //
        // Both ends are pulled back from the node's center to its actual
        // shape boundary - the same `shapeBoundaryDistance` math
        // `getArrowPath()` already uses for the arrowhead tip. Without
        // this, the line's endpoint sits at the center, so it visibly runs
        // *underneath* the node shape; normally hidden since the node is
        // drawn on top and fully opaque, it shows through the moment that
        // opacity drops - e.g. every other node dims via the `inactive`
        // state while hovering one of them.
        getLinkPath() {
            const wp = this.waypoints;

            // Moves `from` toward `to` by the node's own boundary
            // distance along that direction - direction only, not which
            // end it's at, since `shapeBoundaryDistance` uses `Math.abs()`
            // on its inputs and so doesn't care which way it points.
            const pullBack = (from, to, node) => {
                if (!node) {
                    return from;
                }
                let dx = to.x - from.x;
                let dy = to.y - from.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                dx /= len;
                dy /= len;
                const dist = shapeBoundaryDistance(
                    node.shape, node.shapeWidth / 2, node.shapeHeight / 2,
                    dx, dy
                );
                return { x: from.x + dx * dist, y: from.y + dy * dist };
            };

            const trimmed = wp.slice();
            trimmed[0] = pullBack(wp[0], wp[1], this.fromNode);
            trimmed[trimmed.length - 1] = pullBack(
                wp[wp.length - 1], wp[wp.length - 2], this.toNode
            );

            return smoothLinkPath(trimmed);
        }

        // A closed triangle path pointing along the final waypoint segment,
        // its tip pulled back to the `toNode`'s edge rather than its center.
        // `smoothLinkPath`'s final segment is a straight line built to
        // continue the curve's existing tangent there, which is parallel to
        // this same raw segment - so this direction is correct for the
        // curved path too, without needing calculus.
        getArrowPath() {
            const wp = this.waypoints;
            const tip = wp[wp.length - 1];
            const prev = wp[wp.length - 2];
            const { arrowLength, arrowWidth } = this.series.options.link;

            let dx = tip.x - prev.x;
            let dy = tip.y - prev.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            dx /= len;
            dy /= len;

            const node = this.toNode;
            const pullBack = node ?
                shapeBoundaryDistance(
                    node.shape, node.shapeWidth / 2, node.shapeHeight / 2,
                    dx, dy
                ) :
                0;
            const tipX = tip.x - dx * pullBack;
            const tipY = tip.y - dy * pullBack;
            const baseX = tipX - dx * arrowLength;
            const baseY = tipY - dy * arrowLength;
            const halfWidth = arrowWidth / 2;

            return [
                ['M', tipX, tipY],
                ['L', baseX - dy * halfWidth, baseY + dx * halfWidth],
                ['L', baseX + dy * halfWidth, baseY - dx * halfWidth],
                ['Z']
            ];
        }

        renderLink() {
            super.renderLink();

            if (!this.arrowGraphic) {
                this.arrowGraphic = this.series.chart.renderer
                    .path()
                    .addClass('highcharts-flowchart-arrow', true)
                    .add(this.series.group);
            }
        }

        // Hovering a node fades every other node/link via the `inactive`
        // state, but that machinery only knows about `this.graphic` (the
        // line) - it has no idea `arrowGraphic` exists, so without this,
        // the line fades and its arrowhead stays fully opaque.
        //
        // This mirrors `this.graphic`'s own resulting opacity rather than
        // independently recomputing one from `pointAttribs(this,
        // this.state)`, because `this.state` becomes 'inactive' for
        // *every* other point during a hover, including ones connected to
        // the hovered node - which `networkgraph`'s own hover handling
        // (`NodesComposition.setNodeState`) deliberately re-applies 'hover'
        // to right afterwards, bypassing this override entirely (it calls
        // the base `Point.prototype.setState` on connected links directly,
        // not through this subclass), so `this.state` ends up saying
        // 'inactive' for a link this override never actually got to
        // process as 'hover'. `this.graphic.opacity` reflects the real
        // outcome either way; `this.state` doesn't.
        //
        // `this.graphic.opacity` isn't settled to that target synchronously
        // though - reading it immediately after `super.setState()` can
        // still catch the old value mid-transition. Reading it one tick
        // after `states.inactive.animation.duration` (50ms) instead of
        // immediately is a pragmatic way to sidestep both problems without
        // re-implementing the connected/inactive decision here.
        setState(state) {
            super.setState(state);
            setTimeout(() => {
                if (this.arrowGraphic && this.graphic) {
                    this.arrowGraphic.attr({ opacity: this.graphic.opacity });
                }
            }, 60);
        }

        // Reposition the line, the arrowhead, and the data label anchor.
        // Not inherited from `networkgraph`, which assumes an exact 2-point
        // path when computing the label midpoint.
        redrawLink() {
            if (!this.graphic) {
                return;
            }

            const path = this.getLinkPath();
            this.shapeArgs = { d: path };

            let attribs;
            if (!this.series.chart.styledMode) {
                attribs = this.series.pointAttribs(this);
                this.graphic.attr(attribs);
                (this.dataLabels || []).forEach(label => {
                    if (label) {
                        label.attr({ opacity: attribs.opacity });
                    }
                });
            }
            this.graphic.attr(this.shapeArgs);

            if (this.arrowGraphic) {
                this.arrowGraphic.attr({
                    d: this.getArrowPath(),
                    fill: (attribs && attribs.stroke) || 'inherit',
                    opacity: (attribs && attribs.opacity) ?? 1
                });
            }

            const mid = pathMidpoint(path);
            this.plotX = mid.x;
            this.plotY = mid.y;
        }

        destroy() {
            if (this.arrowGraphic) {
                this.arrowGraphic = this.arrowGraphic.destroy();
            }
            // Mirrors the inherited `networkgraph` point's node-removal
            // cleanup, minus its `series.layout` bookkeeping - this series
            // never registers with a graph layout.
            if (this.isNode) {
                this.linksFrom.concat(this.linksTo).forEach(link => {
                    if (link.destroyElements) {
                        link.destroyElements();
                    }
                });
            }
            return H.Point.prototype.destroy.apply(this, arguments);
        }

        // CSS hook only - no default color/dash change for reversed links.
        getClassName() {
            return super.getClassName() +
                (this.reversed ? ' highcharts-link-reversed' : '');
        }
    }

    FlowchartSeries.prototype.pointClass = FlowchartPoint;

}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'flowchart'
    },

    title: {
        text: 'Flowchart series — automatic layered layout'
    },

    series: [{
        name: 'Connections',
        // Explicit, unlike the inherited `pointArrayMap` alone: Highcharts'
        // generic array-data parsing has a leading-`x` special case that
        // otherwise shifts a 3-element `[from, to, text]` row by one index.
        keys: ['from', 'to', 'text'],
        data: edges,
        // dataLabels: {
        //     enabled: true,
        //     linkFormat: ''
        // },
        nodes: nodeShapes,
        debug: {
            dummyPoints: showDummyPoints
        }
    }]
});
