Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: 'Vitamin D in preventing COVID-19 infection'
    },
    subtitle: {
        HTML: true,
        text: 'Source: <a href="https://www.sciencedirect.com/science/article/pii/S1876034120305311" target="_blank">Sciencedirect</a>'
    },

    xAxis: {
        title: {
            enabled: true,
            text: 'Mean vitamin D (nmol/L)'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Cases/1 M population'
        }
    },

    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: null,
                pointFormat: '{point.x} (nmol/L) <br/> {point.y} /1M'
            }
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: null,
        data: [[57, 4736],
            [65, 1123],
            [73.3, 834],
            [67.7, 449],
            [65, 933],
            [47.4, 895],
            [56.4, 1230],
            [59.5, 1199],
            [49.3, 2019],
            [50.1, 1309],
            [60, 1671],
            [46, 2686],
            [50, 2306],
            [42.5, 3137],
            [51, 893],
            [62.5, 488],
            [81.5, 125],
            [60.6, 93],
            [51.8, 453],
            [39, 1289]]
    }, {
        type: 'line',
        name: 'Regression Line',
        data: [[39, 2236.3], [81.5, 226.05]],
        marker: {
            enabled: false
        },
        states: {
            hover: {
                lineWidth: 0
            }
        },
        enableMouseTracking: false
    }]
});