$(function () {


    $('#container').highcharts({

        chart: {
            width: 800
        },

        title: {
            text: 'Tooltip header formatting'
        },

        plotOptions: {
            series: {
                animation: false,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        this.point.key = this.point.x;
                        return this.series.chart.tooltip
                            .headerFooterFormatter(this.point);
                    }
                }
            }
        },

        xAxis: [{
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            },
            tickLength: 0
        }],

        yAxis: [{
            height: '10%',
            title: null,
            labels: {
                enabled: false
            }
        }, {
            height: '10%',
            top: '10%',
            title: null,
            labels: {
                enabled: false
            }
        }, {
            height: '10%',
            top: '20%',
            title: null,
            labels: {
                enabled: false
            }
        }, {
            height: '10%',
            top: '30%',
            title: null,
            labels: {
                enabled: false
            }
        }, {
            height: '10%',
            top: '40%',
            title: null,
            labels: {
                enabled: false
            }
        }, {
            height: '10%',
            top: '50%',
            title: null,
            labels: {
                enabled: false
            }
        }, {
            height: '10%',
            top: '60%',
            title: null,
            labels: {
                enabled: false
            }
        }],


        series: [{
            data: [
                ['2014-01-01', 1],
                ['2015-01-01', 1],
                ['2016-01-01', 1],
                ['2017-01-01', 1]
            ],
            name: 'UTC, years',
            xAxis: 0,
            yAxis: 0
        }, {
            data: [
                ['2014-01-01', 1],
                ['2014-02-01', 1],
                ['2014-03-01', 1],
                ['2014-04-01', 1]
            ],
            name: 'UTC, months',
            xAxis: 1,
            yAxis: 1
        }, {
            data: [1, 1, 1, 1],
            pointStart: '2014-01-06',
            pointInterval: 7 * 24 * 36e5,
            name: 'UTC, weeks',
            xAxis: 2,
            yAxis: 2
        }, {
            data: [1, 1, 1, 1],
            pointStart: '2014-01-01',
            pointInterval: 24 * 36e5,
            name: 'UTC, days',
            xAxis: 3,
            yAxis: 3
        }, {
            data: [1, 1, 1, 1],
            pointStart: '2014-01-01',
            pointInterval: 36e5,
            name: 'UTC, hours',
            xAxis: 4,
            yAxis: 4
        }, {
            data: [1, 1, 1, 1],
            pointStart: '2014-01-01',
            pointInterval: 7 * 24 * 36e5,
            name: 'UTC, weeks but wrong day',
            xAxis: 5,
            yAxis: 5
        }, {
            data: [
                ['2014-01-01 01:00', 1],
                ['2014-01-02 01:00', 1],
                ['2014-01-03 01:00', 1],
                ['2014-01-04 01:00', 1]
            ],
            name: 'Days, but off by one hour',
            xAxis: 6,
            yAxis: 6
        }]
    });

});