
(function () {

    /**
     * Experimental Highcharts plugin to implement chart.alignThreshold option. This primary axis
     * will be computed first, then all following axes will be aligned to the threshold.
     * Author: Torstein Hønsi
     * Last revision: 2016-11-02
     */
    var wrapAdjustTickAmount = function (H) {
        var Axis = H.Axis,
            inArray = H.inArray,
            wrap = H.wrap;

        wrap(Axis.prototype, 'adjustTickAmount', function (proceed) {
            var chart = this.chart,
                primaryAxis = chart[this.coll][0],
                primaryThreshold,
                primaryIndex,
                index,
                newTickPos,
                threshold;

            // Find the index and return boolean result
            function isAligned(axis) {
                index = inArray(threshold, axis.tickPositions); // used in while-loop
                return axis.tickPositions.length === axis.tickAmount && index === primaryIndex;
            }

            if (chart.options.chart.alignThresholds && this !== primaryAxis) {
                primaryThreshold = (primaryAxis.series[0] && primaryAxis.series[0].options.threshold) || 0;
                threshold = (this.series[0] && this.series[0].options.threshold) || 0;

                primaryIndex = primaryAxis.tickPositions && inArray(primaryThreshold, primaryAxis.tickPositions);

                if (this.tickPositions && this.tickPositions.length &&
                    primaryIndex > 0 &&
                    primaryIndex < primaryAxis.tickPositions.length - 1 &&
                    this.tickAmount) {

                    // Add tick positions to the top or bottom in order to align the threshold
                    // to the primary axis threshold
                    while (!isAligned(this)) {

                        if (index < primaryIndex) {
                            newTickPos = this.tickPositions[0] - this.tickInterval;
                            this.tickPositions.unshift(newTickPos);
                            this.min = newTickPos;
                        } else {
                            newTickPos = this.tickPositions[this.tickPositions.length - 1] + this.tickInterval;
                            this.tickPositions.push(newTickPos);
                            this.max = newTickPos;
                        }
                        proceed.call(this);
                    }
                }

            } else {
                proceed.call(this);
            }
        });
    };



    QUnit.test('alignThreshold, positive-negative', function (assert) {

        var originalAdjustTickAmount = Highcharts.Axis.prototype.adjustTickAmount;

        try {

            wrapAdjustTickAmount(Highcharts);

            var chart = Highcharts.chart('container', {
                chart: {
                    alignThresholds: true,
                    type: 'area'
                },
                yAxis: [{
                    title: {
                        text: 'Primary Axis'
                    },
                    gridLineWidth: 0
                }, {
                    title: {
                        text: 'Secondary Axis'
                    },
                    opposite: true
                }],
                series: [{
                    data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4],
                    yAxis: 0
                }, {
                    data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
                    yAxis: 1
                }]
            });

            assert.equal(
                chart.yAxis[0].tickPositions.indexOf(0),
                chart.yAxis[1].tickPositions.indexOf(0),
                'Same threshold position'
            );

            chart.series[1].hide();

        } finally {

            Highcharts.Axis.prototype.adjustTickAmount = originalAdjustTickAmount;

        }

    });

    // Fails since 4b0f2e30d
    QUnit.skip('alignThreshold, negative-positive', function (assert) {

        var originalAdjustTickAmount = Highcharts.Axis.prototype.adjustTickAmount;

        try {

            wrapAdjustTickAmount(Highcharts);

            var chart = Highcharts.chart('container', {
                chart: {
                    alignThresholds: true,
                    type: 'area'
                },
                yAxis: [{
                    title: {
                        text: 'Primary Axis'
                    },
                    gridLineWidth: 0
                }, {
                    title: {
                        text: 'Secondary Axis'
                    },
                    opposite: true
                }],
                series: [{
                    data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
                    yAxis: 0
                }, {
                    yAxis: 1,
                    data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4]

                }]
            });

            assert.equal(
                chart.yAxis[0].tickPositions.indexOf(0),
                chart.yAxis[1].tickPositions.indexOf(0),
                'Same threshold position'
            );

        } finally {

            Highcharts.Axis.prototype.adjustTickAmount = originalAdjustTickAmount;

        }

    });

    /* Failing test
    QUnit.test('alignThreshold, nowhere near the threshold', function (assert) {

        var originalAdjustTickAmount = Highcharts.Axis.prototype.adjustTickAmount;

        try {

            wrapAdjustTickAmount(Highcharts);

            var chart = Highcharts.chart('container', {
                chart: {
                    alignThresholds: true,
                    type: 'area'
                },
                yAxis: [{
                    title: {
                        text: 'Primary Axis'
                    },
                    gridLineWidth: 0
                }, {
                    title: {
                        text: 'Secondary Axis'
                    },
                    opposite: true
                }],
                series: [{
                    data: [1001, 1002, 1003],
                    yAxis: 0
                }, {
                    data: [-1001, -1002, -1003],
                    yAxis: 1
                }]
            });

            assert.equal(
                chart.yAxis[0].tickPositions.indexOf(0),
                chart.yAxis[1].tickPositions.indexOf(0),
                'Same threshold position'
            );

        } finally {

            Highcharts.Axis.prototype.adjustTickAmount = originalAdjustTickAmount;

        }

    });
    */

    // Fails since 4b0f2e30d
    QUnit.skip('alignThreshold, bar', function (assert) {

        var originalAdjustTickAmount = Highcharts.Axis.prototype.adjustTickAmount;

        try {

            wrapAdjustTickAmount(Highcharts);

            var chart = Highcharts.chart('container', {
                chart: {
                    alignThresholds: true,
                    type: 'bar'
                },
                yAxis: [{
                    title: {
                        text: 'Primary Axis'
                    },
                    gridLineWidth: 0
                }, {
                    title: {
                        text: 'Secondary Axis'
                    },
                    opposite: true
                }],
                series: [{
                    data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
                    yAxis: 0
                }, {
                    yAxis: 1,
                    data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4]

                }]
            });

            assert.equal(
                chart.yAxis[0].tickPositions.indexOf(0),
                chart.yAxis[1].tickPositions.indexOf(0),
                'Same threshold position'
            );

        } finally {

            Highcharts.Axis.prototype.adjustTickAmount = originalAdjustTickAmount;

        }

    });

}());