var data = [1, 2, 4, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 26, 30, 35];

var opts = function (pan) {
    return {
        yAxis: {
            gridLineWidth: 0,
            visible: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                events: {
                    click: function () {
                        var chart = this.chart;
                        chart.isSonifying = !chart.isSonifying;
                        if (chart.isSonifying) {
                            if (chart.sonification.timeline) {
                                chart.resumeSonify();
                            } else {
                                chart.sonify({
                                    duration: 2000,
                                    order: 'sequential',
                                    pointPlayTime: 'x',
                                    onEnd: function () {
                                        chart.resetSonifyCursor();
                                        chart.isSonifying = false;
                                    },
                                    instruments: [{
                                        instrument: 'triangleMajor',
                                        instrumentMapping: {
                                            duration: 250,
                                            pan: pan,
                                            frequency: 'y'
                                        }
                                    }]
                                });
                            }
                        } else {
                            chart.pauseSonify();
                        }
                    }
                }
            }
        }
    };
};

Highcharts.chart('containerA', Highcharts.merge(opts(-1), {
    title: {
        text: 'A'
    },
    series: [{
        data: data
    }]
}));

Highcharts.chart('containerB', Highcharts.merge(opts(1), {
    title: {
        text: 'B'
    },
    series: [{
        data: data.reverse()
    }]
}));
