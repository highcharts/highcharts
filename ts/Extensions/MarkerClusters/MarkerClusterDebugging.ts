/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Author: Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

// /**
//  * Useful for debugging.
//  * @private
//  */
// function drawGridLines(
//     series: Highcharts.Series,
//     options: Highcharts.MarkerClusterLayoutAlgorithmOptions
// ): void {
//     let chart = series.chart,
//         xAxis = series.xAxis,
//         yAxis = series.yAxis,
//         xAxisLen = series.xAxis.len,
//         yAxisLen = series.yAxis.len,
//         i, j, elem, text,
//         currentX = 0,
//         currentY = 0,
//         scaledGridSize = 50,
//         gridX = 0,
//         gridY = 0,
//         gridOffset = series.getGridOffset(),
//         mapXSize, mapYSize;

//     if (series.debugGridLines && series.debugGridLines.length) {
//         series.debugGridLines.forEach(function (gridItem): void {
//             if (gridItem && gridItem.destroy) {
//                 gridItem.destroy();
//             }
//         });
//     }


//     series.debugGridLines = [];
//     scaledGridSize = series.getScaledGridSize(options);

//     mapXSize = Math.abs(
//         xAxis.toPixels(xAxis.dataMax || 0) -
//         xAxis.toPixels(xAxis.dataMin || 0)
//     );

//     mapYSize = Math.abs(
//         yAxis.toPixels(yAxis.dataMax || 0) -
//         yAxis.toPixels(yAxis.dataMin || 0)
//     );

//     gridX = Math.ceil(mapXSize / scaledGridSize);
//     gridY = Math.ceil(mapYSize / scaledGridSize);

//     for (i = 0; i < gridX; i++) {
//         currentX = i * scaledGridSize;

//         if (
//             gridOffset.plotLeft + currentX >= 0 &&
//             gridOffset.plotLeft + currentX < xAxisLen
//         ) {

//             for (j = 0; j < gridY; j++) {
//                 currentY = j * scaledGridSize;

//                 if (
//                     gridOffset.plotTop + currentY >= 0 &&
//                     gridOffset.plotTop + currentY < yAxisLen
//                 ) {
//                     if (j % 2 === 0 && i % 2 === 0) {
//                         let rect = chart.renderer
//                             .rect(
//                                 gridOffset.plotLeft + currentX,
//                                 gridOffset.plotTop + currentY,
//                                 scaledGridSize * 2,
//                                 scaledGridSize * 2
//                             )
//                             .attr({
//                                 stroke: series.color,
//                                 'stroke-width': '2px'
//                             })
//                             .add()
//                             .toFront();

//                         series.debugGridLines.push(rect);
//                     }

//                     elem = chart.renderer
//                         .rect(
//                             gridOffset.plotLeft + currentX,
//                             gridOffset.plotTop + currentY,
//                             scaledGridSize,
//                             scaledGridSize
//                         )
//                         .attr({
//                             stroke: series.color,
//                             opacity: 0.3,
//                             'stroke-width': '1px'
//                         })
//                         .add()
//                         .toFront();

//                     text = chart.renderer
//                         .text(
//                             j + '-' + i,
//                             gridOffset.plotLeft + currentX + 2,
//                             gridOffset.plotTop + currentY + 7
//                         )
//                         .css({
//                             fill: 'rgba(0, 0, 0, 0.7)',
//                             fontSize: '7px'
//                         })
//                         .add()
//                         .toFront();

//                     series.debugGridLines.push(elem);
//                     series.debugGridLines.push(text);
//                 }
//             }
//         }
//     }
// }
