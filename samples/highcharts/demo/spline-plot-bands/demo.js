// Data retrieved from http://vikjavev.no/ver/index.php?spenn=2d&sluttid=16.06.2015.
$(function () {
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Wind speed during two days'
        },
        subtitle: {
            text: 'June 16th and 17th 2015 at two locations in Vik i Sogn, Norway'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'Wind speed (m/s)'
            },
            min: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [{ // Light air
                from: 0.3,
                to: 1.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Light air',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 1.5,
                to: 3.3,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Light breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 3.3,
                to: 5.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Gentle breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Moderate breeze
                from: 5.5,
                to: 8,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Moderate breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Fresh breeze
                from: 8,
                to: 11,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Fresh breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Strong breeze
                from: 11,
                to: 14,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Strong breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // High wind
                from: 14,
                to: 15,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'High wind',
                    style: {
                        color: '#606060'
                    }
                }
            }]
        },
        tooltip: {
            valueSuffix: ' m/s'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 3600000, // one hour
                pointStart: Date.UTC(2015, 5, 16, 0, 0, 0)
            }
        },
        series: [{
            name: 'Hestavollane',
            data: [2.0, 1.1, 1.2, 0.9, 0.8, 1.2, 0.8, 0.1, 0.0, 2.3, 2.9, 2.4,
            3.1, 3.1, 3.7, 3.6, 3.4, 4.4, 4.3, 3.8, 3.4, 1.3, 1.2, 1.4, 0.8, 
            0.5, 0.7, 0.1, 1.2, 1.4, 1.1, 0.6, 0.5, 0.3, 0.2, 1.8, 2.4, 2.9, 
            2.5, 2.1, 3.3, 3.0, 3.6, 3.9, 4.4, 3.7, 4.2, 4.0, 4.1]

        }, {
            name: 'Vik',
            data: [1.3, 2.2, 2.1, 1.6, 2.2, 0.9, 0.4, 0.0, 0.0, 0.0, 0.2, 0.1, 
            1.8, 1.4, 1.3, 1.3, 2.5, 2.3, 2.2, 2.8, 1.7, 1.0, 1.1, 1.0, 1.6, 
            0.0, 0.6, 0.0, 0.0, 0.1, 0.1, 0.3, 0.7, 0.2, 0.4, 0.2, 1.0, 0.9, 
            0.2, 0.3, 0.8, 1.1, 0.6, 1.0, 0.3, 0.0, 0.1, 0.1, 0.2]
        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });
});