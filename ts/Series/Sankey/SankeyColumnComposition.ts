import type SankeySeries from './SankeySeries';
import SankeyPoint from './SankeyPoint';
import U from '../../Core/Utilities.js';
const {
    relativeLength
} = U;

namespace SankeyColumnComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class PointComposition extends SankeyPoint {
        // add
    }

    export declare class ArrayComposition<T extends PointComposition = PointComposition> extends Array<T> {
        sankeyColumn: SankeyColumnAdditions;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Extends axis with stacking support.
     * @private
     * @function Highcharts.SankeyColumn#compose
     *
     * @param {Array<SankeyPoint>} array
     * The array of arrays of nodes
     * @param {SankeySeries} series
     * Series connected to column
     * @return {ArrayComposition} SankeyColumnArray
     */
    export function compose(
        array: Array<PointComposition>,
        series: SankeySeries
    ): ArrayComposition {
        const sankeyColumnArray = array as ArrayComposition;
        sankeyColumnArray.sankeyColumn =
            new SankeyColumnAdditions(sankeyColumnArray, series);
        return sankeyColumnArray;
    }

    /* *
     *
     *  Classes
     *
     * */
    class SankeyColumnAdditions {

        constructor(array: ArrayComposition, series: SankeySeries) {
            this.array = array;
            this.series = series;
        }

        public array: ArrayComposition;

        public series: SankeySeries;

        /**
         * Calculate translation factor used in column and nodes distribution
         * @private
         * @function Highcharts.SankeyColumn#getTranslationFactor
         *
         * @param {SankeySeries} series
         * The Series
         * @return {number} TranslationFactor
         * Translation Factor
         */
        public getTranslationFactor(series: SankeySeries): number {
            const column = this.array,
                nodes = column.slice(),
                chart = series.chart,
                minLinkWidth = series.options.minLinkWidth || 0;

            let skipPoint: boolean,
                factor = 0,
                i: number,
                radius,
                maxRadius: number = 0,
                scale = 1,
                additionalSpace = 0,
                remainingWidth =
                    (chart.plotSizeX as any) -
                    (series.options.borderWidth as any) -
                    (column.length - 1) *
                    series.nodePadding;

            // Because the minLinkWidth option doesn't obey the direct
            // translation, we need to run translation iteratively, check
            // node heights, remove those nodes affected by minLinkWidth,
            // check again, etc.
            while (column.length) {
                factor = remainingWidth / column.sankeyColumn.sum();
                skipPoint = false;
                i = column.length;
                while (i--) {
                    radius = (column[i].getSum()) * factor * scale;

                    let plotArea = Math.min(chart.plotHeight, chart.plotWidth);

                    if (radius > plotArea) {
                        scale = Math.min(plotArea / radius, scale);
                    } else if (radius < minLinkWidth) {
                        column.splice(i, 1);
                        remainingWidth -= minLinkWidth;
                        radius = minLinkWidth;
                        skipPoint = true;
                    }
                    additionalSpace += radius * (1 - scale) / 2;
                    maxRadius = Math.max(maxRadius, radius);
                }
                if (!skipPoint) {
                    break;
                }
            }

            // Re-insert original nodes
            column.length = 0;
            nodes.forEach((node): void => {
                (node as any).scale = scale;
                column.push(node);
            });
            (column as any).maxRadius = maxRadius;
            (column as any).scale = scale;
            (column as any).additionalSpace = additionalSpace;
            return factor;
        }


        /**
         * Calculate translation factor used in column and nodes distribution
         * @private
         * @function Highcharts.SankeyColumn#top
         *
         * @param {number} factor
         * The Translation Factor
         * @return {number} TranslationFactor
         * Translation Factor
         */
        public top(factor: number): number {
            const series = this.series;
            const nodePadding = series.nodePadding;
            const height = this.array.reduce(function (
                height: number,
                node: PointComposition
            ): number {
                if (height > 0) {
                    height += nodePadding;
                }
                const nodeHeight = Math.max(
                    node.getSum() * factor,
                    series.options.minLinkWidth as any
                );
                height += nodeHeight;
                return height;
            }, 0);
            return ((series.chart.plotSizeY || 0) - height) / 2;
        }


        /**
         * Calculate sum of all nodes inside specific column
         * @private
         * @function Highcharts.SankeyColumn#sum
         *
         * @param {ArrayComposition} this
         * Sankey Column Array
         *
         * @return {number} sum
         * Sum of all nodes inside column
         */
        public sum(this: SankeyColumnAdditions): number {
            return this.array.reduce(function (
                sum: number,
                node: PointComposition
            ): number {
                return sum + node.getSum();
            }, 0);
        }

        /**
         * Get the offset in pixels of a node inside the column
         * @private
         * @function Highcharts.SankeyColumn#offset
         *
         * @param {SankeyPoint} node
         * Sankey node
         * @param {number} factor
         * Translation Factor
         * @return {number} offset
         * Offset of a node inside column
         */
        public offset(
            node: PointComposition,
            factor: number
        ): (Record<string, number>|undefined) {
            const column = this.array,
                series = this.series,
                nodePadding = series.nodePadding;

            let offset = 0,
                totalNodeOffset;

            for (let i = 0; i < column.length; i++) {
                const sum = column[i].getSum();
                const height = Math.max(
                    sum * factor,
                    series.options.minLinkWidth || 0
                );

                if (sum) {
                    totalNodeOffset = height + nodePadding;
                } else {
                    // If node sum equals 0 nodePadding is missed #12453
                    totalNodeOffset = 0;
                }
                if (column[i] === node) {
                    return {
                        relativeTop: offset + relativeLength(
                            node.options.offset || 0,
                            totalNodeOffset
                        )
                    };
                }
                offset += totalNodeOffset;
            }
        }
    }
}

export default SankeyColumnComposition;
