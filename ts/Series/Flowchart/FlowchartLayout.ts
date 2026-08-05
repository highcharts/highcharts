/* *
 *
 *  Flowchart series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Tord Vikestad
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A directed edge, as given by the series data.
 * @internal
 */
export interface FlowchartLayoutEdge {
    from: string;
    to: string;
}

/**
 * A position in pixels, relative to the top left of the laid out graph's own
 * bounding box - not the plot area. The series places that box.
 * @internal
 */
export interface FlowchartLayoutPosition {
    x: number;
    y: number;
}

/**
 * The space a node's shape needs, in pixels.
 * @internal
 */
export interface FlowchartLayoutSize {
    height: number;
    width: number;
}

/**
 * How one edge is routed: the chain of waypoint ids it passes through -
 * always oriented in the data's original `from` -> `to` direction - and
 * whether the layout had to reverse it to break a cycle.
 * @internal
 */
export interface FlowchartLayoutRoute {
    reversed: boolean;
    waypointIds: Array<string>;
}

/**
 * Everything about the graph that does not depend on how big anything is:
 * which layer each node sits in, the order within each layer, and the waypoint
 * chain per edge. Phases 1-3 produce this, and none of them consult a pixel
 * size - so it survives a resize untouched and is worth caching.
 * @internal
 */
export interface FlowchartLayoutTopology {
    down: Map<string, Array<string>>;
    dummies: Array<string>;
    layers: Array<Array<string>>;
    routes: Array<FlowchartLayoutRoute>;
    up: Map<string, Array<string>>;
}

/**
 * Where everything ends up, in pixels, plus the size the graph needs in order
 * to be drawn without overlap. The series compares `intrinsic` against the plot
 * area to decide how to place - or whether to scale - the result.
 * @internal
 */
export interface FlowchartLayoutGeometry {
    intrinsic: FlowchartLayoutSize;
    positions: Record<string, FlowchartLayoutPosition>;
}

/**
 * Spacing the geometry phase works to, in pixels.
 * @internal
 */
export interface FlowchartLayoutSpacing {
    layerSpacing: number;
    nodeSpacing: number;
}

/** @internal */
interface Adjacency {
    inn: Map<string, Array<string>>;
    nodes: Array<string>;
    out: Map<string, Array<string>>;
}

/** @internal */
interface DAGEdge extends FlowchartLayoutEdge {
    reversed: boolean;
}

/** @internal */
interface LayeredGraph {
    down: Map<string, Array<string>>;
    dummies: Array<string>;
    layers: Array<Array<string>>;
    up: Map<string, Array<string>>;
    waypointIds: Array<Array<string>>;
}

/* *
 *
 *  Namespace
 *
 * */

/**
 * A Sugiyama-style layered layout for directed graphs, in four phases.
 *
 * Phase 1 - Cycle removal.
 * A layered layout requires a DAG, but flowcharts contain feedback loops.
 * This step reverses a small set of "back" edges so every cycle is broken,
 * using the greedy heuristic of Eades, Lin & Smyth (1993). Reversed edges
 * are recorded so the arrowhead can still be drawn in the data's original
 * direction.
 *
 * Phase 2 - Layer assignment.
 * Each node is ranked into a horizontal layer by longest-path (ASAP)
 * layering: sources sit in layer 0, every other node one layer below its
 * deepest predecessor. The layer drives the node's Y position.
 *
 * Phase 3 - Crossing reduction.
 * Edges that span more than one layer are broken with dummy nodes so every
 * edge connects adjacent layers. Nodes within each layer are then reordered
 * with the median heuristic, sweeping down and up until crossings stop
 * dropping. Dummy nodes exist only inside this computation - they never
 * become series points, they just bend the real edge's rendered path into a
 * polyline.
 *
 * Phase 4 - Coordinate assignment.
 * The within-layer order is fixed; this phase turns it into real X
 * coordinates with the priority method: sweep down and up, pulling each node
 * toward the median X of its neighbours, while keeping a minimum gap and
 * never letting a node cross a higher-priority one. Dummy nodes get top
 * priority, so long edges straighten into vertical runs and the bends from
 * Phase 3 disappear.
 *
 * Phases 1-3 are pure ordering: they never look at how big a node is, so
 * `solveTopology()` returns them on their own and the result stays valid
 * across a resize. Only phase 4 and the layer placement need pixel sizes, and
 * those live in `solveGeometry()` - which is what a resize re-runs.
 *
 * The gap phase 4 keeps is the real one: half of each neighbour's width plus
 * `nodeSpacing`, so two wide nodes in the same layer are pushed apart by as
 * much as they actually need. Layers are likewise spaced by the tallest node
 * in each. Positions come back in pixels relative to the graph's own bounding
 * box, together with the size that box needs.
 *
 * @internal
 */
namespace FlowchartLayout {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Down-and-up sweeps run by the median heuristic in phase 3. Each sweep
     * is cheap, and the best ordering seen is kept, so a handful is enough
     * to settle the graphs a flowchart realistically contains.
     * @internal
     */
    const crossingReductionSweeps = 8;

    /**
     * Down-and-up sweeps run by the priority method in phase 4.
     * @internal
     */
    const coordinateSweeps = 12;

    /**
     * A waypoint is a bend in an edge, not a box, so it takes up no width or
     * height of its own - the surrounding `nodeSpacing` alone leaves a routed
     * edge half a gap of clearance either side of the nodes it passes between.
     * @internal
     */
    const waypointSize: FlowchartLayoutSize = { width: 0, height: 0 };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Build successor (`out`) and predecessor (`inn`) adjacency from an edge
     * list, preserving first-seen node order for deterministic results.
     * @internal
     */
    function buildAdjacency(
        edgeList: Array<FlowchartLayoutEdge>
    ): Adjacency {
        const out = new Map<string, Array<string>>(),
            inn = new Map<string, Array<string>>(),
            nodes: Array<string> = [];

        const ensure = (id: string): void => {
            if (!out.has(id)) {
                out.set(id, []);
                inn.set(id, []);
                nodes.push(id);
            }
        };

        for (const { from, to } of edgeList) {
            ensure(from);
            ensure(to);
            out.get(from)!.push(to);
            inn.get(to)!.push(from);
        }

        return { nodes, out, inn };
    }

    /**
     * Phase 1 - Eades-Lin-Smyth greedy cycle removal. Returns the edge list
     * re-oriented to DAG direction, with the flipped ones tagged.
     * @internal
     */
    function greedyCycleRemoval(
        edgeList: Array<FlowchartLayoutEdge>
    ): Array<DAGEdge> {
        const { nodes, out, inn } = buildAdjacency(edgeList),
            outDeg = new Map<string, number>(),
            inDeg = new Map<string, number>(),
            removed = new Set<string>(),
            left: Array<string> = [],
            right: Array<string> = [];

        for (const id of nodes) {
            outDeg.set(id, out.get(id)!.length);
            inDeg.set(id, inn.get(id)!.length);
        }

        // Removing a node lowers the degree of its present neighbours.
        const remove = (id: string): void => {
            removed.add(id);
            for (const to of out.get(id)!) {
                if (!removed.has(to)) {
                    inDeg.set(to, inDeg.get(to)! - 1);
                }
            }
            for (const from of inn.get(id)!) {
                if (!removed.has(from)) {
                    outDeg.set(from, outDeg.get(from)! - 1);
                }
            }
        };

        const present = (): Array<string> =>
            nodes.filter((id): boolean => !removed.has(id));

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

            // Otherwise take the node with the greatest out-in degree.
            const rest = present();
            if (rest.length) {
                let best = rest[0],
                    bestScore = outDeg.get(best)! - inDeg.get(best)!;

                for (const id of rest) {
                    const score = outDeg.get(id)! - inDeg.get(id)!;
                    if (score > bestScore) {
                        best = id;
                        bestScore = score;
                    }
                }
                remove(best);
                left.push(best);
            }
        }

        const rank = new Map<string, number>(
            left.concat(right).map((id, i): [string, number] => [id, i])
        );

        // An edge u -> v is a back edge when v precedes u in the order.
        return edgeList.map(({ from, to }): DAGEdge => (
            rank.get(to)! < rank.get(from)! ?
                { from: to, to: from, reversed: true } :
                { from, to, reversed: false }
        ));
    }

    /**
     * Whether a graph is acyclic, by Kahn's algorithm: peel off nodes with
     * no remaining predecessor, and if that reaches every node there was no
     * cycle to get stuck behind.
     * @internal
     */
    function isAcyclic(dag: Array<FlowchartLayoutEdge>): boolean {
        const { nodes, out, inn } = buildAdjacency(dag),
            inDeg = new Map<string, number>(
                nodes.map((id): [string, number] => [id, inn.get(id)!.length])
            ),
            queue = nodes.filter((id): boolean => inDeg.get(id) === 0);

        let visited = 0;

        while (queue.length) {
            const id = queue.shift()!;
            visited++;
            for (const to of out.get(id)!) {
                inDeg.set(to, inDeg.get(to)! - 1);
                if (inDeg.get(to) === 0) {
                    queue.push(to);
                }
            }
        }

        return visited === nodes.length;
    }

    /**
     * Phase 2 - Longest-path (ASAP) layering: layer(v) = 0 for sources,
     * otherwise 1 + max(layer(predecessor)). Input must be a DAG; the
     * `visiting` guard only keeps a malformed one from recursing forever.
     * @internal
     */
    function assignLayers(dag: Array<DAGEdge>): Map<string, number> {
        const { nodes, inn } = buildAdjacency(dag),
            layer = new Map<string, number>(),
            visiting = new Set<string>();

        const visit = (id: string): number => {
            const known = layer.get(id);
            if (known !== void 0) {
                return known;
            }
            if (visiting.has(id)) {
                return 0;
            }
            visiting.add(id);

            let l = 0;
            for (const pred of inn.get(id)!) {
                l = Math.max(l, visit(pred) + 1);
            }

            visiting.delete(id);
            layer.set(id, l);
            return l;
        };

        nodes.forEach(visit);
        return layer;
    }

    /**
     * Expand the DAG into a proper layered graph: an edge spanning several
     * layers is split through a chain of dummy nodes, which exist only for
     * this computation. Returns the per-layer node ordering (real + dummy),
     * `up`/`down` adjacency maps, the dummy ids, and - per DAG edge, in
     * input order - the full `[from, ...dummyChain, to]` id chain it routes
     * through.
     * @internal
     */
    function buildLayeredGraph(
        dag: Array<DAGEdge>,
        layer: Map<string, number>
    ): LayeredGraph {
        const layers: Array<Array<string>> = [],
            up = new Map<string, Array<string>>(),
            down = new Map<string, Array<string>>(),
            dummies: Array<string> = [],
            waypointIds: Array<Array<string>> = [];

        const place = (id: string, l: number): void => {
            if (!up.has(id)) {
                up.set(id, []);
                down.set(id, []);
                (layers[l] || (layers[l] = [])).push(id);
            }
        };

        layer.forEach((l, id): void => place(id, l));

        for (const { from, to } of dag) {
            const chain = [from];
            let prev = from;

            for (let l = layer.get(from)! + 1; l < layer.get(to)!; l++) {
                const dummy = 'dummy' + dummies.length;
                dummies.push(dummy);
                place(dummy, l);
                down.get(prev)!.push(dummy);
                up.get(dummy)!.push(prev);
                chain.push(dummy);
                prev = dummy;
            }

            down.get(prev)!.push(to);
            up.get(to)!.push(prev);
            chain.push(to);
            waypointIds.push(chain);
        }

        return { layers, up, down, dummies, waypointIds };
    }

    /**
     * Number of inversions in a sequence - the count of out-of-order pairs.
     * @internal
     */
    function countInversions(seq: Array<number>): number {
        let count = 0;
        for (let i = 0; i < seq.length; i++) {
            for (let j = i + 1; j < seq.length; j++) {
                if (seq[i] > seq[j]) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Edge crossings between two adjacent layers, given their orderings.
     * Walk the upper layer, list each node's lower-layer neighbour slots,
     * and count inversions in the concatenated sequence.
     * @internal
     */
    function countCrossingsBetween(
        upper: Array<string>,
        lower: Array<string>,
        down: Map<string, Array<string>>
    ): number {
        const lowerPos = new Map<string, number>(
                lower.map((id, i): [string, number] => [id, i])
            ),
            seq: Array<number> = [];

        for (const u of upper) {
            const slots = down.get(u)!
                .map((v): number => lowerPos.get(v)!)
                .sort((a, b): number => a - b);

            seq.push(...slots);
        }

        return countInversions(seq);
    }

    /**
     * Total crossings summed over every adjacent layer pair.
     * @internal
     */
    function totalCrossings(
        layers: Array<Array<string>>,
        down: Map<string, Array<string>>
    ): number {
        let total = 0;
        for (let l = 0; l < layers.length - 1; l++) {
            total += countCrossingsBetween(layers[l], layers[l + 1], down);
        }
        return total;
    }

    /**
     * Reorder a layer by the median position of each node's neighbours in
     * the adjacent fixed layer. Nodes with no neighbour there keep their
     * spot.
     * @internal
     */
    function sortByMedian(
        nodes: Array<string>,
        fixed: Array<string>,
        neighbours: Map<string, Array<string>>
    ): Array<string> {
        const fixedPos = new Map<string, number>(
                fixed.map((id, i): [string, number] => [id, i])
            ),
            key = new Map<string, number>();

        nodes.forEach((id, i): void => {
            const slots = neighbours.get(id)!
                .map((n): (number|undefined) => fixedPos.get(n))
                .filter((p): p is number => p !== void 0)
                .sort((a, b): number => a - b);

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
            .map((id, i): [string, number] => [id, i])
            .sort((a, b): number =>
                key.get(a[0])! - key.get(b[0])! || a[1] - b[1]
            )
            .map((entry): string => entry[0]);
    }

    /**
     * Phase 3 - Median-heuristic crossing reduction: sweep down then up,
     * keeping the ordering with the fewest crossings seen.
     * @internal
     */
    function reduceCrossings(
        layers: Array<Array<string>>,
        up: Map<string, Array<string>>,
        down: Map<string, Array<string>>
    ): Array<Array<string>> {
        const current = layers.map((l): Array<string> => l.slice());

        let best = current.map((l): Array<string> => l.slice()),
            bestCount = totalCrossings(current, down);

        for (let iter = 0; iter < crossingReductionSweeps; iter++) {
            if (iter % 2 === 0) {
                for (let l = 1; l < current.length; l++) {
                    current[l] = sortByMedian(current[l], current[l - 1], up);
                }
            } else {
                for (let l = current.length - 2; l >= 0; l--) {
                    current[l] = sortByMedian(current[l], current[l + 1], down);
                }
            }

            const count = totalCrossings(current, down);
            if (count < bestCount) {
                bestCount = count;
                best = current.map((l): Array<string> => l.slice());
            }
        }

        return best;
    }

    /**
     * Median X of a set of neighbour nodes (undefined if there are none).
     * @internal
     */
    function medianX(
        ids: Array<string>,
        xMap: Map<string, number>
    ): (number|undefined) {
        if (!ids.length) {
            return void 0;
        }
        const xs = ids
            .map((id): number => xMap.get(id)!)
            .sort((a, b): number => a - b);
        const m = Math.floor(xs.length / 2);
        return xs.length % 2 ? xs[m] : (xs[m - 1] + xs[m]) / 2;
    }

    /**
     * The minimum centre-to-centre distance each neighbouring pair in a layer
     * needs - half of each one's width, plus the gap that has to stay open
     * between them - accumulated from the left so the minimum distance from
     * node `i` to node `k` is a single subtraction, `cum[k] - cum[i]`.
     *
     * This is what makes the layout size-aware. With one flat separation for
     * every pair, two nodes with wide labels sit as close together as two
     * narrow ones and overlap however much room the plot area has.
     * @internal
     */
    function separations(
        widths: Array<number>,
        nodeSpacing: number
    ): Array<number> {
        const cum = [0];

        for (let i = 0; i < widths.length - 1; i++) {
            cum.push(
                cum[i] + (widths[i] + widths[i + 1]) / 2 + nodeSpacing
            );
        }

        return cum;
    }

    /**
     * Move node `i` within its layer toward `desired`, pushing lower-priority
     * neighbours aside but stopping at the first equal-or-higher-priority node
     * (a wall), so every pair keeps at least the distance `cum` requires.
     * @internal
     */
    function placeNode(
        x: Array<number>,
        prio: Array<number>,
        cum: Array<number>,
        i: number,
        desired: number
    ): void {
        if (desired > x[i]) {
            let wall = Infinity;
            for (let k = i + 1; k < x.length; k++) {
                if (prio[k] >= prio[i]) {
                    wall = x[k] - (cum[k] - cum[i]);
                    break;
                }
            }

            const target = Math.min(desired, wall);
            if (target > x[i]) {
                x[i] = target;
                for (let k = i + 1; k < x.length; k++) {
                    const min = x[k - 1] + (cum[k] - cum[k - 1]);
                    if (x[k] >= min) {
                        break;
                    }
                    x[k] = min;
                }
            }

        } else if (desired < x[i]) {
            let wall = -Infinity;
            for (let k = i - 1; k >= 0; k--) {
                if (prio[k] >= prio[i]) {
                    wall = x[k] + (cum[i] - cum[k]);
                    break;
                }
            }

            const target = Math.max(desired, wall);
            if (target < x[i]) {
                x[i] = target;
                for (let k = i - 1; k >= 0; k--) {
                    const max = x[k + 1] - (cum[k + 1] - cum[k]);
                    if (x[k] <= max) {
                        break;
                    }
                    x[k] = max;
                }
            }
        }
    }

    /**
     * Position one layer: give each node its desired X in order of priority
     * (highest first), so high-priority nodes settle before lower ones move.
     * @internal
     */
    function positionLayer(
        nodes: Array<string>,
        desired: Map<string, number>,
        xMap: Map<string, number>,
        prioMap: Map<string, number>,
        sizeMap: Map<string, FlowchartLayoutSize>,
        nodeSpacing: number
    ): void {
        const x = nodes.map((id): number => xMap.get(id)!),
            prio = nodes.map((id): number => prioMap.get(id)!),
            cum = separations(
                nodes.map((id): number => sizeMap.get(id)!.width),
                nodeSpacing
            ),
            byPriority = nodes
                .map((_id, i): number => i)
                .sort((a, b): number => prio[b] - prio[a]);

        for (const i of byPriority) {
            const d = desired.get(nodes[i]);
            if (d !== void 0) {
                placeNode(x, prio, cum, i, d);
            }
        }

        nodes.forEach((id, i): void => {
            xMap.set(id, x[i]);
        });
    }

    /**
     * Phase 4 - Priority-method coordinate assignment. Dummy nodes get top
     * priority (so long edges straighten); real nodes are ranked by degree.
     * Returns a map of node id -> X coordinate, in pixels.
     *
     * Each layer starts packed left at the minimum spacing its own node widths
     * require, rather than at one slot per node, so the arrangement the sweeps
     * begin from is already free of overlap and they only ever improve it.
     * @internal
     */
    function assignCoordinates(
        layers: Array<Array<string>>,
        up: Map<string, Array<string>>,
        down: Map<string, Array<string>>,
        dummies: Array<string>,
        sizeMap: Map<string, FlowchartLayoutSize>,
        nodeSpacing: number
    ): Map<string, number> {
        const dummySet = new Set(dummies),
            xMap = new Map<string, number>(),
            prioMap = new Map<string, number>();

        for (const ids of layers) {
            const cum = separations(
                ids.map((id): number => sizeMap.get(id)!.width),
                nodeSpacing
            );

            ids.forEach((id, i): void => {
                xMap.set(id, cum[i]);
                prioMap.set(
                    id,
                    dummySet.has(id) ?
                        Infinity :
                        up.get(id)!.length + down.get(id)!.length
                );
            });
        }

        const sweep = (
            l: number,
            neighbours: Map<string, Array<string>>
        ): void => {
            const desired = new Map<string, number>();

            for (const id of layers[l]) {
                const d = medianX(neighbours.get(id)!, xMap);
                if (d !== void 0) {
                    desired.set(id, d);
                }
            }

            positionLayer(
                layers[l], desired, xMap, prioMap, sizeMap, nodeSpacing
            );
        };

        for (let iter = 0; iter < coordinateSweeps; iter++) {
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
    }

    /**
     * The priority method only ever pulls a node toward its neighbours'
     * median - there's nothing keeping a whole layer's coordinate frame
     * anchored to any particular center. A long edge's dummy chain (top
     * priority throughout) drags the layers it passes through toward
     * wherever *it* settles, and lower-priority real nodes get pushed along
     * for the ride with no compensating pull back the other way. Left
     * unchecked this compounds layer after layer, so nodes drift further
     * off-center the deeper the layer.
     *
     * The fix doesn't touch the sweeps themselves - it re-centers each layer
     * afterwards, shifting every node in it (real and dummy alike, so edges
     * bending through a layer's dummies stay consistent with that layer's
     * real nodes) so the layer's own bounding range is centered on the same
     * point as the graph's overall bounding range. Relative spacing and
     * order within a layer - and therefore the crossing count - are
     * unaffected, since a layer only ever moves as a rigid block.
     * @internal
     */
    function centerLayers(
        layers: Array<Array<string>>,
        xMap: Map<string, number>,
        sizeMap: Map<string, FlowchartLayoutSize>
    ): Map<string, number> {
        // A layer's extent runs from its leftmost node's left edge to its
        // rightmost node's right edge, not between their centers - a layer
        // holding one very wide node is not centered by its center alone.
        const extent = (ids: Array<string>): {max: number; min: number} => {
            let min = Infinity,
                max = -Infinity;

            for (const id of ids) {
                const x = xMap.get(id)!,
                    half = sizeMap.get(id)!.width / 2;

                min = Math.min(min, x - half);
                max = Math.max(max, x + half);
            }

            return { min, max };
        };

        let graphMin = Infinity,
            graphMax = -Infinity;

        for (const ids of layers) {
            const { min, max } = extent(ids);
            graphMin = Math.min(graphMin, min);
            graphMax = Math.max(graphMax, max);
        }

        const graphCenter = (graphMin + graphMax) / 2,
            centered = new Map<string, number>();

        for (const ids of layers) {
            const { min, max } = extent(ids),
                offset = graphCenter - (min + max) / 2;

            for (const id of ids) {
                centered.set(id, xMap.get(id)! + offset);
            }
        }

        return centered;
    }

    /**
     * Stack the layers vertically and shift the whole graph so its own top
     * left corner is the origin, giving every node a pixel center relative to
     * the graph's bounding box - plus the size of that box.
     *
     * Each gap between two layers is the bottom half of the tallest node above
     * it, `layerSpacing`, and the top half of the tallest node below. A layer
     * of plain boxes therefore does not reserve the room a layer containing a
     * tall diamond needs, which a single uniform row height would force it to.
     * @internal
     */
    function placeLayers(
        layers: Array<Array<string>>,
        xMap: Map<string, number>,
        sizeMap: Map<string, FlowchartLayoutSize>,
        spacing: FlowchartLayoutSpacing
    ): FlowchartLayoutGeometry {
        const centered = centerLayers(layers, xMap, sizeMap);

        let minX = Infinity,
            maxX = -Infinity;

        centered.forEach((x, id): void => {
            const half = sizeMap.get(id)!.width / 2;

            minX = Math.min(minX, x - half);
            maxX = Math.max(maxX, x + half);
        });

        const positions: Record<string, FlowchartLayoutPosition> = {};

        let y = 0,
            previousHeight = 0;

        layers.forEach((ids, l): void => {
            const height = ids.reduce(
                (tallest, id): number =>
                    Math.max(tallest, sizeMap.get(id)!.height),
                0
            );

            y += l === 0 ?
                height / 2 :
                previousHeight / 2 + spacing.layerSpacing + height / 2;

            for (const id of ids) {
                positions[id] = { x: centered.get(id)! - minX, y };
            }

            previousHeight = height;
        });

        return {
            intrinsic: {
                width: maxX - minX,
                height: y + previousHeight / 2
            },
            positions
        };
    }

    /**
     * Phases 1 to 3: everything about the graph that holds regardless of how
     * big anything is. Returns which layer each node sits in, the order within
     * each layer, and - per input edge, in `edgeList` order - whether it was
     * reversed and the waypoint id chain to route it through.
     *
     * That chain is already re-oriented to the ORIGINAL from -> to direction,
     * so an arrowhead drawn at the end of it always lands on the data's real
     * `to` node, even for a back edge that renders going "up".
     *
     * Nothing here depends on a pixel size, so the result survives a resize
     * and only needs recomputing when the links themselves change. Feed it to
     * `solveGeometry()` to get actual positions.
     *
     * Self-referencing edges are excluded from the layered graph - they are
     * a cycle no reversal can break, and would leave phase 2 with a node
     * that is its own predecessor - but still get a route, so the returned
     * `routes` stay aligned with `edgeList`.
     * @internal
     */
    export function solveTopology(
        edgeList: Array<FlowchartLayoutEdge>
    ): FlowchartLayoutTopology {
        const graphEdges: Array<FlowchartLayoutEdge> = [],
            // Index in `edgeList` of each entry in `graphEdges`.
            sourceIndex: Array<number> = [],
            // Self-referencing edges start and end on the same node.
            routes = edgeList.map((edge, i): FlowchartLayoutRoute => {
                if (edge.from !== edge.to) {
                    sourceIndex.push(i);
                    graphEdges.push(edge);
                }
                return {
                    reversed: false,
                    waypointIds: [edge.from, edge.to]
                };
            });

        if (!graphEdges.length) {
            return {
                down: new Map(),
                dummies: [],
                layers: [],
                routes,
                up: new Map()
            };
        }

        const dag = greedyCycleRemoval(graphEdges);

        // Phase 1 is supposed to guarantee this, and phase 2 is where a
        // remaining cycle does its damage: longest-path layering walks a
        // node's predecessors, so a cycle would recurse forever. Its
        // `visiting` guard stops that, but only by breaking the cycle at an
        // arbitrary point - which quietly produces a layering that isn't a
        // longest-path one at all, and a diagram whose arrows contradict the
        // order they are drawn in. Better to fail loudly here than to render
        // something wrong: reaching this means a bug in cycle removal, not
        // anything a chart config can ask for.
        if (!isAcyclic(dag)) {
            throw new Error(
                'Highcharts flowchart: cycle removal left a cycle behind.'
            );
        }

        const layer = assignLayers(dag),
            { layers, up, down, dummies, waypointIds } =
                buildLayeredGraph(dag, layer),
            ordered = reduceCrossings(layers, up, down);

        dag.forEach((edge, i): void => {
            routes[sourceIndex[i]] = {
                reversed: edge.reversed,
                waypointIds: edge.reversed ?
                    waypointIds[i].slice().reverse() :
                    waypointIds[i]
            };
        });

        return { down, dummies, layers: ordered, routes, up };
    }

    /**
     * Phase 4 and the layer placement: turn a topology plus the pixel size of
     * every node into pixel positions, and report how much room the result
     * needs. This is the half of the layout that a resize has to re-run, and
     * it is the cheap half - O(sweeps x nodes), against the O(sweeps x edges^2)
     * crossing counting in `solveTopology()`.
     *
     * `sizes` only has to cover the real nodes. The waypoints a long edge is
     * routed through are bends rather than boxes, and are sized accordingly.
     * @internal
     */
    export function solveGeometry(
        topology: FlowchartLayoutTopology,
        sizes: Record<string, FlowchartLayoutSize>,
        spacing: FlowchartLayoutSpacing
    ): FlowchartLayoutGeometry {
        const { layers, up, down, dummies } = topology;

        if (!layers.length) {
            return {
                intrinsic: { width: 0, height: 0 },
                positions: {}
            };
        }

        const sizeMap = new Map<string, FlowchartLayoutSize>();

        for (const ids of layers) {
            for (const id of ids) {
                // A node with no measured size is treated as a point, the same
                // as a waypoint - it can only occur if the caller left one out.
                sizeMap.set(id, sizes[id] || waypointSize);
            }
        }

        return placeLayers(
            layers,
            assignCoordinates(
                layers, up, down, dummies, sizeMap, spacing.nodeSpacing
            ),
            sizeMap,
            spacing
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartLayout;
