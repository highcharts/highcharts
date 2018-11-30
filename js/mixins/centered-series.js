/* *
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * @private
 * @typedef Highcharts.RadianAngles
 *
 * @property {number} start
 *
 * @property {number} end
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var deg2rad = H.deg2rad,
    isNumber = H.isNumber,
    pick = H.pick,
    relativeLength = H.relativeLength;

/**
 * @private
 * @mixin Highcharts.CenteredSeriesMixin
 */
H.CenteredSeriesMixin = {

    /**
     * Get the center of the pie based on the size and center options relative
     * to the plot area. Borrowed by the polar and gauge series types.
     *
     * @private
     * @function Highcharts.CenteredSeriesMixin.getCenter
     *
     * @return {Array<number>}
     */
    getCenter: function () {

        var options = this.options,
            chart = this.chart,
            slicingRoom = 2 * (options.slicedOffset || 0),
            handleSlicingRoom,
            plotWidth = chart.plotWidth - 2 * slicingRoom,
            plotHeight = chart.plotHeight - 2 * slicingRoom,
            centerOption = options.center,
            positions = [
                pick(centerOption[0], '50%'),
                pick(centerOption[1], '50%'),
                options.size || '100%',
                options.innerSize || 0
            ],
            smallestSize = Math.min(plotWidth, plotHeight),
            i,
            value;

        for (i = 0; i < 4; ++i) {
            value = positions[i];
            handleSlicingRoom = i < 2 || (i === 2 && /%$/.test(value));

            // i == 0: centerX, relative to width
            // i == 1: centerY, relative to height
            // i == 2: size, relative to smallestSize
            // i == 3: innerSize, relative to size
            positions[i] = relativeLength(
                value,
                [plotWidth, plotHeight, smallestSize, positions[2]][i]
            ) + (handleSlicingRoom ? slicingRoom : 0);

        }
        // innerSize cannot be larger than size (#3632)
        if (positions[3] > positions[2]) {
            positions[3] = positions[2];
        }
        return positions;
    },

    /**
     * getStartAndEndRadians - Calculates start and end angles in radians.
     * Used in series types such as pie and sunburst.
     *
     * @private
     * @function Highcharts.CenteredSeriesMixin.getStartAndEndRadians
     *
     * @param {number} start
     *        Start angle in degrees.
     *
     * @param {number} end
     *        Start angle in degrees.
     *
     * @return {Highcharts.RadianAngles}
     *         Returns an object containing start and end angles as radians.
     */
    getStartAndEndRadians: function getStartAndEndRadians(start, end) {
        var startAngle = isNumber(start) ? start : 0, // must be a number
            endAngle = (
                (
                    isNumber(end) && // must be a number
                    end > startAngle && // must be larger than the start angle
                    // difference must be less than 360 degrees
                    (end - startAngle) < 360
                ) ?
                end :
                startAngle + 360
            ),
            correction = -90;
        return {
            start: deg2rad * (startAngle + correction),
            end: deg2rad * (endAngle + correction)
        };
    }
};
