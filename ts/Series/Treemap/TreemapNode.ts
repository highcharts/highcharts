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
        parentNode?: Node;
        pointValues?: NodeValuesObject;
        sortIndex?: number;
        val: number = void 0 as any;
        values?: NodeValuesObject;
        visible = false;
        zIndex?: number;
        series: TreemapSeries = void 0 as any;

        public init(
            id: string,
            i: number,
            children: Array<Node>,
            height: number,
            level: number,
            series: TreemapSeries,
            parent?: string
        ): Node {
            this.id = id;
            this.i = i;
            this.children = children;
            this.height = height;
            this.level = level;
            this.series = series;
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
                child = series.NodeClass.buildNode(
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
            node = new series.NodeClass().init(
                id,
                index,
                children,
                height,
                level,
                series,
                parent
            );

            children.forEach((child): void => {
                child.parentNode = node;
            });

            series.nodeMap[node.id] = node;
            series.nodeList.push(node);
            if (point) {
                point.node = node;
            }
            return node;
        }
    }
}
export default TreemapNode;
