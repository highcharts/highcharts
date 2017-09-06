/**
 * Highcharts variwide study
 *
 * To do:
 * - X ax is categories should be placed under columns. Move translation
 *   computations up to processData, then use these to move axis labels as well as columns.
 * - Tooltip positions
 * - Inherited Z value for stacks? Otherwise it must be set for each series.
 */

(function (H) {
    var seriesTypes = H.seriesTypes,
        each = H.each,
        pick = H.pick;

    H.seriesType('variwide', 'column', {
        pointPadding: 0,
        groupPadding: 0
    }, {
        pointArrayMap: ['y', 'z'],
        parallelArrays: ['x', 'y', 'z'],
        processData: function () {
            var series = this;
            this.totalZ = 0;
            this.relZ = [];
            seriesTypes.column.prototype.processData.call(this);

            each(this.zData, function (z, i) {
                series.relZ[i] = series.totalZ;
                series.totalZ += z;
            });

            if (this.xAxis.categories) {
                this.xAxis.variwide = true;
            }
        },

        /**
         * Translate an x value inside a given category index into the distorted
         * axis translation.
         * @param  {Number} i The category index
         * @param  {Number} x The X pixel position in undistorted axis pixels
         * @return {Number}   Distorted X position
         */
        postTranslate: function (i, x, debug) {

            var len = this.xAxis.len,
                totalZ = this.totalZ,
                relZ = this.relZ,
                linearSlotLeft = i / relZ.length * len,
                linearSlotRight = (i + 1) / relZ.length * len,
                slotLeft = (pick(relZ[i], totalZ) / totalZ) * len,
                slotRight = (pick(relZ[i + 1], totalZ) / totalZ) * len,
                xInsideLinearSlot = x - linearSlotLeft,
                ret;

            ret = slotLeft +
                xInsideLinearSlot * (slotRight - slotLeft) /
                (linearSlotRight - linearSlotLeft);

            return ret;
        },

        /**
         * Extend translation by distoring X position based on Z.
         */
        translate: function () {
            seriesTypes.column.prototype.translate.call(this);

            // Distort the points to reflect z dimension
            each(this.points, function (point, i) {
                var left = this.postTranslate(i, point.shapeArgs.x),
                    right = this.postTranslate(
                        i,
                        point.shapeArgs.x + point.shapeArgs.width
                    );

                point.shapeArgs.x = left;
                point.shapeArgs.width = right - left;
            }, this);
        }
    });

    H.wrap(H.Tick.prototype, 'getPosition', function (proceed, horiz, pos) {
        var xy = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        if (horiz && this.axis.variwide) {
            this.xOrig = xy.x;
            xy.x =
                this.axis.pos +
                this.axis.series[0].postTranslate(pos, xy.x - this.axis.pos);
        }
        return xy;
    });

    H.wrap(H.Tick.prototype, 'getLabelPosition', function (
        proceed,
        x,
        y,
        label,
        horiz,
        labelOptions,
        tickmarkOffset,
        index
    ) {
        var args = Array.prototype.slice.call(arguments, 1),
            xy;

        // Replace the x with the original x
        if (this.axis.variwide && typeof this.xOrig === 'number') {
            args[0] = this.xOrig;
        }

        xy = proceed.apply(this, args);

        // Post-translate
        if (horiz && this.axis.variwide) {
            xy.x = this.axis.pos +
                this.axis.series[0].postTranslate(index, xy.x - this.axis.pos);
        }
        return xy;
    });

}(Highcharts));


Highcharts.chart('container', {

    chart: {
        type: 'variwide'
    },

    title: {
        text: 'Highcharts variwide study'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    series: [{
        data: [{
            x: 1,
            y: 1,
            z: 10
        }, {
            x: 2,
            y: 2,
            z: 20
        }, {
            x: 3,
            y: 3,
            z: 30
        }],
        dataLabels: {
            enabled: true,
            format: '{point.y} ({point.z})',
            inside: true
        }
    }, {
        data: [{
            x: 1,
            y: 1,
            z: 10
        }, {
            x: 2,
            y: 2,
            z: 20
        }, {
            x: 3,
            y: 3,
            z: 30
        }],
        dataLabels: {
            enabled: true,
            format: '{point.y} ({point.z})',
            inside: true
        }
    }]

});
