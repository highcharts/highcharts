/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/navigator
 * @requires highcharts
 *
 * Standalone navigator module
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Navigator from '../../Stock/Navigator/Navigator.js';
import Highcharts from '../../Core/Globals.js';

const G: AnyRecord = Highcharts;

Navigator.compose(G.Axis, G.Chart, G.Series);

G.Navigator = Navigator;

G.navigator = Navigator.navigator;
// G.navigator = function (id: string, options: any) {
//     const WIDTH = 400;
// const container = Highcharts.doc.getElementById(id);

// if (!container) {
//     return;
// }

// const renderer = new SVGRenderer(
//   container,
//   WIDTH,
//   300
// );

// const config = {

//   time: Highcharts.time,
//   userOptions: {

//   },
//   options: G.merge(
//     G.getOptions(), {
//       colors: ['red', 'green'],
//       navigator: {
//         series: {
//           data: [1, 2, 3, 12, 1, 2, 1, 2, 3, 1],
//           type: 'line'
//         },
//         xAxis: {
//           crosshair: false,
//           width: WIDTH - 20
//         },
//         enabled: true
//       },
//       scrollbar: {
//         enabled: true
//       }
//     }
//   ),
//   renderer: renderer,
//   xAxis: [{
//     len: WIDTH - 20,
//     options: {
//       // maxRange: 10000,
//       width: WIDTH - 20
//     },
//     // minRange: 0.1,
//     setExtremes: function(min: number, max: number) {
//       console.log(min, max)
//     }
//   }],
//   yAxis: [{
//     options: {

//     }
//   }],
//   series: [],
//   axes: [],
//   orderItems: function() {},
//   initSeries: G.Chart.prototype.initSeries,
//   renderTo: renderer.box,
//   container: renderer.box,
//   pointer: {
//     normalize: (e: any) => {
//       e.chartX = e.pageX;
//       e.chartY = e.pageY;
//       return e;
//     }
//   },
//   plotLeft: 10,
//   plotTop: 0,
//   plotWidth: WIDTH - 20,
//   plotHeight: renderer.height,
//   sharedClips: [],
//   spacing: [0, 0, 0, 0],
//   margin: [0, 0, 0, 0],
//   numberFormatter: G.numberFormat
// }



//   Navigator.navigator(id, config);

// }
