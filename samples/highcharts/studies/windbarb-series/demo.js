

/*
 Wind barb study
 @todo
 - Hover effects (line width, hover color etc from pointAttribs)
 - Option whether to position on Y value
 - Y offset option
 - Size option
 - Tooltip
 */

(function (H) {
    var each = H.each;
    H.seriesType('windbarb', 'line', {

    }, {
        pointArrayMap: ['y', 'z'],
        parallelArrays: ['x', 'y', 'z'],
        beaufortName: ['Calm', 'Light air', 'Light breeze',
            'Gentle breeze', 'Moderate breeze', 'Fresh breeze',
            'Strong breeze', 'Near gale', 'Gale', 'Strong gale', 'Storm',
            'Violent storm', 'Hurricane'],
        beaufortFloor: [0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8,
            24.5, 28.5, 32.7],

        /**
         * Get presentational attributes for marker-based series (line, spline, scatter, bubble, mappoint...)
         */
        pointAttribs: function (point) {
            return {
                'stroke': this.color,
                'stroke-width': this.options.lineWidth || 2
            };
        },
        markerAttribs: function () {
            return undefined;
        },
        /**
         * Create a single wind arrow. It is later rotated around the zero
         * centerpoint.
         */
        windArrow: function (y) {
            var level,
                path,
                beaufortFloor = this.beaufortFloor;

            // The stem and the arrow head
            path = [
                'M', 0, 7, // base of arrow
                'L', -1.5, 7,
                0, 10,
                1.5, 7,
                0, 7,
                0, -10 // top
            ];

            // Find the beaufort level (zero based)
            for (level = 0; level < beaufortFloor.length; level++) {
                if (beaufortFloor[level] > y) {
                    break;
                }
            }

            if (level === 0) {
                path = [];
            }

            if (level === 2) {
                path.push('M', 0, -8, 'L', 4, -8); // short line
            } else if (level >= 3) {
                path.push(0, -10, 7, -10); // long line
            }

            if (level === 4) {
                path.push('M', 0, -7, 'L', 4, -7);
            } else if (level >= 5) {
                path.push('M', 0, -7, 'L', 7, -7);
            }

            if (level === 5) {
                path.push('M', 0, -4, 'L', 4, -4);
            } else if (level >= 6) {
                path.push('M', 0, -4, 'L', 7, -4);
            }

            if (level === 7) {
                path.push('M', 0, -1, 'L', 4, -1);
            } else if (level >= 8) {
                path.push('M', 0, -1, 'L', 7, -1);
            }

            return path;
        },

        drawPoints: function () {
            each(this.points, function (point) {
                if (!point.graphic) {
                    point.graphic = this.chart.renderer
                        .path()
                        .add(this.group);
                }
                point.graphic
                    .attr({
                        d: this.windArrow(point.y),
                        translateX: point.plotX,
                        translateY: point.plotY - 20,
                        rotation: point.z
                    })
                    .attr(this.pointAttribs(point));
            }, this);
        }
    });
}(Highcharts));


// Construct the chart
Highcharts.chart('container', {

    title: {
        text: 'Highcharts Wind Barbs Study'
    },

    xAxis: {
        type: 'datetime'
    },

    series: [{
        type: 'windbarb',
        data: [
            [Date.UTC(2017, 0, 29, 0), 9.8, 177.9],
            [Date.UTC(2017, 0, 29, 1), 10.1, 177.2],
            [Date.UTC(2017, 0, 29, 2), 11.3, 179.7],
            [Date.UTC(2017, 0, 29, 3), 10.9, 175.5],
            [Date.UTC(2017, 0, 29, 4), 9.3, 159.9],
            [Date.UTC(2017, 0, 29, 5), 8.8, 159.6],
            [Date.UTC(2017, 0, 29, 6), 7.8, 162.6],
            [Date.UTC(2017, 0, 29, 7), 5.6, 186.2],
            [Date.UTC(2017, 0, 29, 8), 6.8, 146.0],
            [Date.UTC(2017, 0, 29, 9), 6.4, 139.9],
            [Date.UTC(2017, 0, 29, 10), 3.1, 180.2],
            [Date.UTC(2017, 0, 29, 11), 4.3, 177.6],
            [Date.UTC(2017, 0, 29, 12), 5.3, 191.8],
            [Date.UTC(2017, 0, 29, 13), 6.3, 173.1],
            [Date.UTC(2017, 0, 29, 14), 7.7, 140.2],
            [Date.UTC(2017, 0, 29, 15), 8.5, 136.1],
            [Date.UTC(2017, 0, 29, 16), 9.4, 142.9],
            [Date.UTC(2017, 0, 29, 17), 10.0, 140.4],
            [Date.UTC(2017, 0, 29, 18), 5.3, 142.1],
            [Date.UTC(2017, 0, 29, 19), 3.8, 141.0],
            [Date.UTC(2017, 0, 29, 20), 3.3, 116.5],
            [Date.UTC(2017, 0, 29, 21), 1.5, 327.5],
            [Date.UTC(2017, 0, 29, 22), 0.1, 1.1],
            [Date.UTC(2017, 0, 29, 23), 1.2, 11.1]
        ]
    }]

});