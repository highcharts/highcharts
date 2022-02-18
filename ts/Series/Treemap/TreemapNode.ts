import type TreemapSeries from './TreemapSeries.js';
import type BBoxObject from '../../Core/Renderer/BBoxObject.js';

namespace TreemapNode {
    export interface NodeValuesObject extends BBoxObject {
        direction: number;
        val: number;
    }

    export class Node {
        children: Array<Node> = void 0 as any;
        childrenTotal = 0;
        height: number = void 0 as any;
        i: number = void 0 as any;
        id: string = void 0 as any;
        ignore?: boolean;
        isLeaf?: boolean;
        level: number = void 0 as any;
        levelDynamic?: number;
        name?: string;
        parent?: string;
        pointValues?: NodeValuesObject;
        sortIndex?: number;
        val: number = void 0 as any;
        values?: NodeValuesObject;
        visible = false;
        zIndex?: number;

        public init(
            id: string,
            i: number,
            children: Array<Node>,
            height: number,
            level: number,
            parent?: string
        ): Node {
            this.id = id;
            this.i = i;
            this.children = children;
            this.height = height;
            this.level = level;
            this.parent = parent;
            return this;
        }

        public static buildNode(
            series: TreemapSeries,
            id: string,
            index: number,
            level: number,
            list: Record<string, number[]>,
            parent?: string
        ): Node {
            let children: Array<Node> = [],
                point = series.points[index],
                height = 0,
                node: Node,
                child: Node;

            // Actions
            (list[id] || []).forEach(function (i: number): void {
                child = Node.buildNode(
                    series,
                    series.points[i].id,
                    i,
                    level + 1,
                    list,
                    id
                );
                height = Math.max(child.height + 1, height);
                children.push(child);
            });
            node = new Node().init(id, index, children, height, level, parent);

            series.nodeMap[node.id] = node;
            if (point) {
                point.node = node;
            }
            return node;
        }
    }
}
export default TreemapNode;
