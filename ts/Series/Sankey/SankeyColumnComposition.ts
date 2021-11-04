    /* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.ColumnComposition
 *
 * @augments Highcharts.ColumnComposition
 */
class ColumnComposition {
    /**
     * Create a node column.
    */
    public createNodeColumn(series: SankeySeries): ColumnComposition.ColumnArray {
        const chart = series.chart,
            column: ColumnComposition.ColumnArray = [] as any;

        column.sum = function (this: ColumnComposition.ColumnArray): number {
            return this.reduce(function (
                sum: number,
                node: SankeyPoint
            ): number {
                return sum + node.getSum();
            }, 0);
        };
        // Get the offset in pixels of a node inside the column.
        column.offset = function (
            this: SankeySeries.ColumnArray,
            node: SankeyPoint,
            factor: number
        ): (Record<string, number>|undefined) {

            let offset = 0,
                totalNodeOffset,
                nodePadding = series.nodePadding;

            for (let i = 0; i < column.length; i++) {
                const sum = column[i].getSum();
                const height = Math.max(
                    sum * factor,
                    series.options.minLinkWidth as any
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
        };

        // Get the top position of the column in pixels.
        column.top = function (
            this: SankeySeries.ColumnArray,
            factor: number
        ): number {

            const nodePadding = series.nodePadding;
            const height = this.reduce(function (
                height: number,
                node: SankeyPoint
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
            return ((chart.plotSizeY as any) - height) / 2;
        };

        return column;
        }
    }  
     
   

    // /**
    //  * Create node columns by analyzing the nodes and the relations between
    //  * incoming and outgoing links.
    //  * @private
    //  */
    // public createNodeColumns(): Array<SankeySeries.ColumnArray> {
    //     const columns: Array<SankeySeries.ColumnArray> = [];

    //     this.nodes.forEach(function (node: SankeyPoint): void {
    //         let fromColumn = -1,
    //             fromNode,
    //             i,
    //             point;

    //         if (!defined(node.options.column)) {
    //             // No links to this node, place it left
    //             if (node.linksTo.length === 0) {
    //                 node.column = 0;

    //             // There are incoming links, place it to the right of the
    //             // highest order column that links to this one.
    //             } else {
    //                 for (i = 0; i < node.linksTo.length; i++) {
    //                     point = node.linksTo[0];
    //                     if ((point.fromNode.column as any) > fromColumn) {
    //                         fromNode = point.fromNode;
    //                         fromColumn = (fromNode.column as any);
    //                     }
    //                 }
    //                 node.column = fromColumn + 1;

    //                 // Hanging layout for organization chart
    //                 if (
    //                     fromNode &&
    //                     (fromNode.options as any).layout === 'hanging'
    //                 ) {
    //                     node.hangsFrom = fromNode;
    //                     i = -1; // Reuse existing variable i
    //                     find(
    //                         fromNode.linksFrom,
    //                         function (
    //                             link: SankeyPoint,
    //                             index: number
    //                         ): boolean {
    //                             const found = link.toNode === node;
    //                             if (found) {
    //                                 i = index;
    //                             }
    //                             return found;
    //                         }
    //                     );
    //                     node.column += i;
    //                 }
    //             }
    //         }

    //         if (!columns[node.column as any]) {
    //             columns[node.column as any] = this.createNodeColumn();
    //         }

    //         columns[node.column as any].push(node);

    //     }, this);

    //     // Fill in empty columns (#8865)
    //     for (let i = 0; i < columns.length; i++) {
    //         if (typeof columns[i] === 'undefined') {
    //             columns[i] = this.createNodeColumn();
    //         }
    //     }

    //     return columns;
    // }