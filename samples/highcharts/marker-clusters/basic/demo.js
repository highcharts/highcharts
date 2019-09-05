// Prepare the data
var data = [],
    n = 800,
    i;
for (i = 0; i < n; i += 1) {
    data.push([
        Math.pow(Math.random(), 2) * 90 + 5,
        Math.pow(Math.random(), 2) * 90 + 5
    ]);
}

Highcharts.chart('container', {
    chart: {
        zoomType: 'xy',
        height: '100%'
    },
    title: {
        text: 'Marker clusters demo'
    },
    xAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1
    },
    yAxis: {
        min: 0,
        max: 100,
        minPadding: 0,
        maxPadding: 0,
        title: {
            text: null
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                pointFormat: ''
            },
            marker: {
                cluster: {
                    enabled: true,
                    minimumClusterSize: 3,
                    layoutAlgorithm: {
                        type: 'kmeans',
                        distance: 50
                    },
                    dataLabels: {
                        style: {
                            fontSize: '8px'
                        },
                        y: -1
                    },
                    zones: [{
                        from: 0,
                        to: 5,
                        style: {
                            fillColor: '#ffcccc',
                            radius: 13
                        }
                    }, {
                        from: 6,
                        to: 15,
                        style: {
                            fillColor: '#ff9999',
                            radius: 15
                        }
                    }, {
                        from: 16,
                        to: 30,
                        style: {
                            fillColor: '#ff6666',
                            radius: 18
                        }
                    }, {
                        from: 31,
                        to: 40,
                        style: {
                            fillColor: '#ff3333',
                            radius: 20
                        }
                    }, {
                        from: 41,
                        to: 200,
                        style: {
                            fillColor: '#e60000',
                            radius: 23
                        }
                    }]
                }
            }
        }
    },
    series: [{
        type: 'scatter',
        color: 'red',
        data: data
    }]
});
