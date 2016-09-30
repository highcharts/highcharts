/***********************************
 * Highcharts PartFillPoint module *
 ***********************************/
'use strict';
import H from '../parts/Globals.js';

/**
 * Returns an array of PartFillPoint-supported series types.
 * Instead of making a local variable, this is added as a function on
 * the Series prototype so it can easily be overridden at a later time.
 *
 * @return {array} array of PartFillPoint-supported series types
 */
H.Series.prototype.getPartFillSupportedSeries = function () {
    return ['bar', 'column', 'columnrange', 'pie', 'gauge', 'solidgauge'];
};

/**
 * Checks if a series type is supported, by using the
 * Series.getPartFillSupportedSeries() function.
 *
 * @param  {string} type - the series type to check
 * @return {boolean} true if the series type is supported, and
 *                   false if not
 */
H.Series.prototype.isPartFillSupported = function () {
    return H.inArray(this.type, this.getPartFillSupportedSeries()) >= 0;
};

H.wrap(H.Series.prototype, 'translate', function (proceed) {
    var series = this,
        i,
        points,
        point;
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    if (series.isPartFillSupported()) {
        points = series.points;
        // console.log('series', series);
        // console.log('points[0]', points[0]);
        // console.log('series.type', series.type);
        for (i = 0; i < points.length; i++) {
            point = points[i];
            // console.log(point);
            if (point.partialFill) {
                var string = '';
                console.log(point);
                for (var attr in point) {
                    string += attr + ', ';
                }
                console.log(string);
            }
        }
    }
});

H.wrap(H.Series.prototype, 'drawPoints', function (proceed) {
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});
