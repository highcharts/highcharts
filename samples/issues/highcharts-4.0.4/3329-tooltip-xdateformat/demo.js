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
                        return this.series.chart.tooltip.tooltipFooterHeaderFormatter(
                            this.point
                        );
                    }
                }
            }
        },

        xAxis: [{
            type: 'datetime',
            labels: {
                enabled: false
            }
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            }
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            }
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            }
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            }
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            }
        }, {
            type: 'datetime',
            labels: {
                enabled: false
            }
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
                [Date.UTC(2014, 0, 1), 1],
                [Date.UTC(2015, 0, 1), 1],
                [Date.UTC(2016, 0, 1), 1],
                [Date.UTC(2017, 0, 1), 1]
            ],
            name: 'UTC, years',
            xAxis: 0,
            yAxis: 0
        }, {
            data: [
                [Date.UTC(2014, 0, 1), 1],
                [Date.UTC(2014, 1, 1), 1],
                [Date.UTC(2014, 2, 1), 1],
                [Date.UTC(2014, 3, 1), 1]
            ],
            name: 'UTC, months',
            xAxis: 1,
            yAxis: 1
        }, {
            data: [1, 1, 1, 1],
            pointStart: Date.UTC(2014, 0, 6),
            pointInterval: 7 * 24 * 36e5,
            name: 'UTC, weeks',
            xAxis: 2,
            yAxis: 2
        }, {
            data: [1, 1, 1, 1],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 24 * 36e5,
            name: 'UTC, days',
            xAxis: 3,
            yAxis: 3
        }, {
            data: [1, 1, 1, 1],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 36e5,
            name: 'UTC, hours',
            xAxis: 4,
            yAxis: 4
        }, {
            data: [1, 1, 1, 1],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 7 * 24 * 36e5,
            name: 'UTC, weeks but wrong day',
            xAxis: 5,
            yAxis: 5
        }, {
            data: [
                [Date.UTC(2014, 0, 1, 1), 1],
                [Date.UTC(2014, 0, 2, 1), 1],
                [Date.UTC(2014, 0, 3, 1), 1],
                [Date.UTC(2014, 0, 4, 1), 1]
            ],
            name: 'Days, but off by one hour',
            xAxis: 6,
            yAxis: 6
        }]
    });

});