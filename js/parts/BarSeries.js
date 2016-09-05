'use strict';
import H from './Globals.js';
import './Utilities.js';
import './ColumnSeries.js';
	var seriesType = H.seriesType;
/**
 * The Bar series class
 */
seriesType('bar', 'column', null, {
	inverted: true
});
