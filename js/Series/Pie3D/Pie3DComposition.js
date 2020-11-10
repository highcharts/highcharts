/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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
import BaseSeries from '../../Core/Series/Series.js';
import Pie3DPoint from './Pie3DPoint.js';
import Pie3DSeries from './Pie3DSeries.js';
/* *
 *
 *  Composition
 *
 * */
BaseSeries.seriesTypes.pie.prototype.pointClass.prototype.haloPath = Pie3DPoint.prototype.haloPath;
BaseSeries.seriesTypes.pie = Pie3DSeries;
