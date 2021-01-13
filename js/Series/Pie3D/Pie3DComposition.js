/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  3D pie series
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/* *
 *
 *  Imports
 *
 * */
import Pie3DPoint from './Pie3DPoint.js';
import Pie3DSeries from './Pie3DSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
/* *
 *
 *  Composition
 *
 * */
SeriesRegistry.seriesTypes.pie.prototype.pointClass.prototype.haloPath = Pie3DPoint.prototype.haloPath;
SeriesRegistry.seriesTypes.pie = Pie3DSeries;
