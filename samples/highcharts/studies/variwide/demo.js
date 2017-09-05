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
        each = H.each;

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
        },
        translate: function () {
            var series = this,
                totalZ = series.totalZ,
                xAxis = series.xAxis;

            seriesTypes.column.prototype.translate.call(this);

            // Distort the points to reflect z dimension
            each(this.points, function (point, i) {
                var shapeArgs = point.shapeArgs,
                    relZ = series.relZ[i];

                shapeArgs.x *= (relZ / totalZ) / (shapeArgs.x / xAxis.len);
                shapeArgs.width *= (point.z / totalZ) /
                    (shapeArgs.width / xAxis.len);
            });
            this.xAxis.variwide = true;
        }
    });

    /*
    H.wrap(H.Tick.prototype, 'getPosition', function (proceed) {
        var pos = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        return pos;
    });
    */

}(Highcharts));


Highcharts.chart('container', {

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
        type: 'variwide',
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
        type: 'variwide',
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
