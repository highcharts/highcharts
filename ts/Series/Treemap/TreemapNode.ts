import type TreemapSeries from './TreemapSeries.js';
import type BBoxObject from '../../Core/Renderer/BBoxObject.js';
import type TreemapPoint from './TreemapPoint.js';

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
        point: TreemapPoint = void 0 as any;

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

    }
}

export default TreemapNode;
