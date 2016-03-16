import H from './Globals.js';
import './Utilities.js';
import './Series.js';
(function () {
	var extendClass = H.extendClass,
		Series = H.Series,
		seriesTypes = H.seriesTypes;
/**
 * LineSeries object
 */
seriesTypes.line = extendClass(Series);
}());
