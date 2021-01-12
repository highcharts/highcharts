/* *
 *
 *  Highcharts variwide module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Tick from '../../Core/Axis/Tick.js';
import Axis from '../../Core/Axis/Axis.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, wrap = U.wrap;
/* *
 *
 * Composition
 *
 * */
Tick.prototype.postTranslate = function (xy, xOrY, index) {
    var axis = this.axis, pos = xy[xOrY] - axis.pos;
    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    pos = axis.series[0].postTranslate(index, pos);
    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    xy[xOrY] = axis.pos + pos;
};
/* eslint-disable no-invalid-this */
// Same width as the category (#8083)
addEvent(Axis, 'afterDrawCrosshair', function (e) {
    if (this.variwide && this.cross) {
        this.cross.attr('stroke-width', (e.point && e.point.crosshairWidth));
    }
});
// On a vertical axis, apply anti-collision logic to the labels.
addEvent(Axis, 'afterRender', function () {
    var axis = this;
    if (!this.horiz && this.variwide) {
        this.chart.labelCollectors.push(function () {
            return axis.tickPositions
                .filter(function (pos) {
                return axis.ticks[pos].label;
            })
                .map(function (pos, i) {
                var label = axis.ticks[pos].label;
                label.labelrank = axis.zData[i];
                return label;
            });
        });
    }
});
addEvent(Tick, 'afterGetPosition', function (e) {
    var axis = this.axis, xOrY = axis.horiz ? 'x' : 'y';
    if (axis.variwide) {
        this[xOrY + 'Orig'] = e.pos[xOrY];
        this.postTranslate(e.pos, xOrY, this.pos);
    }
});
wrap(Tick.prototype, 'getLabelPosition', function (proceed, x, y, label, horiz, labelOptions, tickmarkOffset, index) {
    var args = Array.prototype.slice.call(arguments, 1), xy, xOrY = horiz ? 'x' : 'y';
    // Replace the x with the original x
    if (this.axis.variwide &&
        typeof this[xOrY + 'Orig'] === 'number') {
        args[horiz ? 0 : 1] = this[xOrY + 'Orig'];
    }
    xy = proceed.apply(this, args);
    // Post-translate
    if (this.axis.variwide && this.axis.categories) {
        this.postTranslate(xy, xOrY, this.pos);
    }
    return xy;
});
