function hero() {
    Highcharts.chart('container', {

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zooming: {
                type: 'xy'
            }
        },

        legend: {
            enabled: false
        },

        title: {
            text: 'Sugar and fat intake per country'
        },

        subtitle: {
            text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
        },

        accessibility: {
            point: {
                // eslint-disable-next-line max-len
                valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, ' +
                'sugar: {point.y}g, obesity: {point.z}%.'
            }
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: 'Daily fat intake'
            },
            labels: {
                format: '{value} gr'
            },
            plotLines: [{
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe fat intake 65g/day'
                },
                zIndex: 3
            }],
            accessibility: {
                rangeDescription: 'Range: 60 to 100 grams.'
            }
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'Daily sugar intake'
            },
            labels: {
                format: '{value} gr'
            },
            maxPadding: 0.2,
            plotLines: [{
                dashStyle: 'dot',
                width: 2,
                value: 50,
                label: {
                    align: 'right',
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe sugar intake 50g/day',
                    x: -10
                },
                zIndex: 3
            }],
            accessibility: {
                rangeDescription: 'Range: 0 to 160 grams.'
            }
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            // eslint-disable-next-line max-len
            pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
            '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
            '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
            '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: [{
            data: [
                { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                // eslint-disable-next-line max-len
                { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                // eslint-disable-next-line max-len
                { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                {
                    x: 65.5,
                    y: 126.4,
                    z: 35.3,
                    name:
                    'US',
                    country: 'United States'
                },
                { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
            ],
            colorByPoint: true
        }]

    });
}

function accessibility() {
    // Define custom series type for displaying
    // low/med/high values using boxplot
// as a base
    Highcharts.seriesType('lowmedhigh', 'boxplot', {
        keys: ['low', 'median', 'high'],
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '{series.name}: ' +
            'Low <b>{point.low}</b> - Median <b>{point.median}</b> - High <b>' +
            '{point.high}</b><br/>'
        }
    }, {
    // Change point shape to a line with three crossing lines for
    // low/median/high. Stroke width is hardcoded to 1 for simplicity
        drawPoints: function () {
            const series = this;
            this.points.forEach(function (point) {

                let graphic = point.graphic;

                const verb = graphic ? 'animate' : 'attr',
                    shapeArgs = point.shapeArgs,
                    width = shapeArgs.width,
                    left = Math.floor(shapeArgs.x) + 0.5,
                    right = left + width,
                    crispX = left + Math.round(width / 2) + 0.5,
                    highPlot = Math.floor(point.highPlot) + 0.5,
                    medianPlot = Math.floor(point.medianPlot) + 0.5,
                    // Sneakily draw low marker even if 0
                    lowPlot = Math.floor(point.lowPlot) +
                    0.5 - (point.low === 0 ? 1 : 0);

                if (point.isNull) {
                    return;
                }

                if (!graphic) {
                    point.graphic = graphic = series.chart.renderer.path(
                        'point'
                    ).add(series.group);
                }

                graphic.attr({
                    stroke: point.color || series.color,
                    'stroke-width': 1
                });

                graphic[verb]({
                    d: [
                        'M', left, highPlot,
                        'H', right,
                        'M', left, medianPlot,
                        'H', right,
                        'M', left, lowPlot,
                        'H', right,
                        'M', crispX, highPlot,
                        'V', lowPlot
                    ]
                });
            });
        }
    });

    // Create chart
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'lowmedhigh'
        },

        title: {
            text: 'Daily company fruit consumption 2019'
        },

        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                // Use default formatter for null points
                    if (point.isNull) {
                        return false;
                    }

                    return point.category + ', low ' + point.low + ', median ' +
                    point.median + ', high ' + point.high;
                }
            },

            series: {
                descriptionFormat: '{seriesDescription}'
            },

            typeDescription: 'Low, median, high. Each data point has a low, ' +
            'median and high value, depicted vertically as small ticks.' //
            // Describe the chart type to screen reader users, since this is
            // not a traditional boxplot chart
        },

        xAxis: [{
            accessibility: {
                description: 'Months of the year'
            },
            categories: [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ]
        }],

        yAxis: {
            title: {
                text: 'Fruits consumed'
            },
            min: 0
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 550
                },
                chartOptions: {
                    xAxis: {
                        categories: [
                            'Jan', 'Feb', 'Mar', 'Apr',
                            'May', 'Jun', 'Jul', 'Aug',
                            'Sep', 'Oct', 'Nov', 'Dec'
                        ]
                    }
                }
            }]
        },

        tooltip: {
            shared: true,
            stickOnContact: true
        },

        plotOptions: {
            series: {
                stickyTracking: true,
                whiskerWidth: 5
            }
        },

        series: [{
            name: 'Plums',
            data: [
                [0, 8, 19],
                [1, 11, 23],
                [3, 16, 28],
                [2, 15, 28],
                [1, 15, 27],
                [0, 9, 21],
                null,
                null,
                [1, 6, 19],
                [2, 8, 21],
                [2, 9, 22],
                [1, 11, 19]
            ]
        }, {
            name: 'Bananas',
            data: [
                [0, 3, 6],
                [1, 2, 4],
                [0, 2, 5],
                [2, 2, 5],
                [1, 3, 6],
                [0, 1, 3],
                [1, 1, 2],
                [0, 1, 3],
                [1, 1, 3],
                [0, 2, 4],
                [1, 2, 5],
                [1, 3, 5]
            ]
        }, {
            name: 'Apples',
            data: [
                [1, 4, 6],
                [2, 4, 5],
                [1, 3, 6],
                [2, 3, 6],
                [1, 3, 4],
                [0, 2, 4],
                [0, 1, 2],
                [0, 1, 2],
                [0, 1, 2],
                [0, 2, 4],
                [1, 2, 4],
                [1, 3, 4]
            ]
        }]
    });

    // Remove click events on container to avoid
    // having "clickable" announced by AT
    // These events are needed for custom
    // click events, drag to zoom, and navigator
    // support.
    chart.container.onmousedown = null;
    chart.container.onclick = null;

}

function csv() {
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

        plotOptions: {
            series: {
                colorByPoint: true,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}',
                    inside: true
                }
            }
        },

        yAxis: {
            max: 10,
            allowDecimals: false
        },

        title: {
            text: 'Live Data (CSV)'
        },

        subtitle: {
            text: 'Data input from a remote, changing, CSV file'
        },

        data: {
            csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv',
            enablePolling: true
        }
    });

}

function polygon() {
    Highcharts.chart('container', {
        title: {
            text: 'Average height and weight for men by country'
        },
        subtitle: {
            text: 'Source: ' +
            '<a href="https://www.worlddata.info/average-bodyheight.php"' +
            'target="_blank">WorldData</a>'
        },
        xAxis: {
            gridLineWidth: 1,
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [{
            name: 'Target',
            type: 'polygon',
            data: [
                [163, 42], [162, 46], [162, 55],
                [163, 64], [164, 70], [170, 90],
                [181, 100], [182, 90], [173, 52], [166, 45]
            ],
            color: Highcharts.color(
                Highcharts.getOptions()
                    .colors[0]
            ).setOpacity(0.5).get(),
            enableMouseTracking: false,
            accessibility: {
                exposeAsGroupOnly: true,
                // eslint-disable-next-line max-len
                description: 'Target ranges in an upwards trending diagonal from ' +
                '161 to 182 on the x axis, and 42 to 100 on the y axis.'
            }
        }, {
            name: 'Observations',
            type: 'scatter',
            color: Highcharts.getOptions().colors[1],
            data: [
                { x: 184, y: 87.9, name: 'Netherlands' },
                { x: 183, y: 90.4, name: 'Montenegro' },
                { x: 182, y: 89.9, name: 'Estonia' },
                { x: 182, y: 86.8, name: 'Denmark' },
                { x: 181, y: 89.2, name: 'Iceland' },
                { x: 181, y: 89.9, name: 'Czechia' },
                { x: 180, y: 89.9, name: 'Serbia' },
                { x: 180, y: 89.9, name: 'Sweden' },
                { x: 180, y: 89.1, name: 'Norway' },
                { x: 180, y: 80.7, name: 'Dominica' },
                { x: 180, y: 86.3, name: 'Finland' },
                { x: 179, y: 88.4, name: 'Bermuda' },
                { x: 179, y: 90.7, name: 'Puerto Rico' },
                { x: 178, y: 84.1, name: 'Belarus' },
                { x: 178, y: 103.7, name: 'Cook Islands' },
                { x: 177, y: 98.8, name: 'Niue' },
                { x: 177, y: 103.2, name: 'American Samoa' },
                { x: 176, y: 80.3, name: 'Russia' },
                { x: 176, y: 91.1, name: 'Saint Lucia' },
                { x: 175, y: 67.0, name: 'Senegal' },
                { x: 175, y: 93.7, name: 'Tonga' },
                { x: 174, y: 74.6, name: 'Algeria' },
                { x: 174, y: 84.7, name: 'Argentina' },
                { x: 174, y: 79.5, name: 'Portugal' },
                { x: 173, y: 73.6, name: 'Mauritius' },
                { x: 173, y: 91.8, name: 'Samoa' },
                { x: 172, y: 69.5, name: 'Japan' },
                { x: 172, y: 74.0, name: 'Bahrain' },
                { x: 171, y: 64.1, name: 'Chad' },
                { x: 171, y: 88.0, name: 'Tuvalu' },
                { x: 171, y: 67.8, name: 'Sudan' },
                { x: 170, y: 58.8, name: 'Eritrea' },
                { x: 170, y: 63.9, name: 'Kenya' },
                { x: 170, y: 74.7, name: 'Mongolia' },
                { x: 170, y: 65.1, name: 'Nigeria' },
                { x: 169, y: 93.0, name: 'Nauru' },
                { x: 169, y: 81.1, name: 'Micronesia' },
                { x: 169, y: 64.9, name: 'Ghana' },
                { x: 169, y: 71.9, name: 'South Africa' },
                { x: 168, y: 61.2, name: 'Vietnam' },
                { x: 168, y: 65.9, name: 'Ivory Coast' },
                { x: 168, y: 69.2, name: 'Maldives' },
                { x: 168, y: 56.5, name: 'Ethiopia' },
                { x: 167, y: 74.2, name: 'Ecuador' },
                { x: 167, y: 60.5, name: 'Burundi' },
                { x: 166, y: 69.6, name: 'India' },
                { x: 166, y: 74.7, name: 'Brunei' },
                { x: 165, y: 57.7, name: 'Bangladesh' },
                { x: 165, y: 58.4, name: 'Madagascar' },
                { x: 165, y: 61.8, name: 'Philippines' },
                { x: 164, y: 60.5, name: 'Nepal' },
                { x: 164, y: 69.1, name: 'Guatemala' },
                { x: 163, y: 62.5, name: 'Yemen' },
                { x: 162, y: 59.5, name: 'Laos' },
                { x: 159, y: 53.9, name: 'Timor-Leste' }
            ]

        }],
        tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: '{point.x} cm, {point.y} kg'
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        layout: 'horizontal',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });

}

function scatter() {
    function getLinearRegression(xData, yData) {
        let sumX = 0,
            sumY = 0,
            sumXY = 0,
            sumX2 = 0,
            x,
            y;

        const linearData = [],
            linearXData = [],
            linearYData = [],
            n = xData.length;

        // Get sums:
        for (let i = 0; i < n; i++) {
            x = xData[i];
            y = yData[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }

        // Get slope and offset:
        let alpha = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        if (isNaN(alpha)) {
            alpha = 0;
        }

        const beta = (sumY - alpha * sumX) / n;

        // Calculate linear regression:
        for (let i = 0; i < n; i++) {
            x = xData[i];
            y = alpha * x + beta;

            // Prepare arrays required for getValues() method
            linearData[i] = [x, y];
            linearXData[i] = x;
            linearYData[i] = y;
        }

        return {
            xData: linearXData,
            yData: linearYData,
            values: linearData
        };
    }

    Highcharts.seriesType(
        'linearregression',
        'sma', {
            name: 'Linear Regression',
            enableMouseTracking: false,
            marker: {
                enabled: false
            },
            params: {} // linear regression doesn’t need params
        }, {
            getValues: function (series) {
                return this.getLinearRegression(series.xData, series.yData);
            },
            getLinearRegression: getLinearRegression
        }
    );

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
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
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Female',
            id: 'female',
            color: 'rgba(223, 83, 83, .5)',
            data: [
                [147.2, 49.8],
                [149.5, 44.8],
                [149.9, 46.8],
                [151.1, 48.7],
                [151.1, 73.2],
                [152, 45.8],
                [152, 59.3],
                [152.4, 47.3],
                [152.4, 46.5],
                [152.4, 60.4],
                [152.4, 67.3],
                [153.4, 42],
                [154.4, 46.2],
                [154.5, 49],
                [154.9, 58.2],
                [154.9, 54.1],
                [155, 45.9],
                [155, 49.2],
                [155.8, 53.6],
                [156, 52.7],
                [156, 54.6],
                [156, 64.4],
                [156.2, 58.6],
                [156.2, 60],
                [156.5, 67.2],
                [157, 63],
                [157, 47.8],
                [157.5, 76.8],
                [157.5, 56],
                [157.5, 54.3],
                [157.5, 63.6],
                [157.5, 58.8],
                [157.5, 48.6],
                [157.5, 54.5],
                [157.5, 59.8],
                [158, 55.5],
                [158.2, 46.4],
                [158.8, 55.5],
                [158.8, 49.1],
                [159, 55.6],
                [159, 48.6],
                [159.1, 47.6],
                [159.2, 51.8],
                [159.4, 45.7],
                [159.4, 53.2],
                [159.5, 47.6],
                [159.5, 49.2],
                [159.5, 50.6],
                [159.8, 50],
                [159.8, 53.2],
                [160, 50],
                [160, 53.4],
                [160, 45],
                [160, 60],
                [160, 80.5],
                [160, 50.2],
                [160, 59],
                [160, 55.4],
                [160, 74.3],
                [160, 55.9],
                [160, 43.2],
                [160, 50.2],
                [160, 48.8],
                [160, 59.5],
                [160, 64.1],
                [160, 75.5],
                [160, 47],
                [160, 54.4],
                [160, 55.9],
                [160, 54.8],
                [160.2, 52.1],
                [160.2, 75.2],
                [160.7, 69.1],
                [160.7, 48.6],
                [160.7, 55.9],
                [160.9, 54.4],
                [161, 80],
                [161, 53.6],
                [161.2, 51.6],
                [161.2, 54.8],
                [161.2, 55.2],
                [161.3, 63.6],
                [161.3, 70.5],
                [161.3, 57.3],
                [161.3, 60.3],
                [161.3, 60.9],
                [161.3, 67.9],
                [161.3, 60.2],
                [161.4, 63.4],
                [162, 55],
                [162, 54.7],
                [162.1, 53.6],
                [162.1, 59.2],
                [162.2, 50.2],
                [162.5, 52.2],
                [162.5, 58.2],
                [162.6, 81.8],
                [162.6, 63.2],
                [162.6, 66.4],
                [162.6, 50],
                [162.6, 63.6],
                [162.6, 84.5],
                [162.6, 61.4],
                [162.6, 61.4],
                [162.6, 58.6],
                [162.6, 54.5],
                [162.6, 61.4],
                [162.6, 53.9],
                [162.6, 54.5],
                [162.6, 70.5],
                [162.8, 57.8],
                [162.8, 58],
                [162.9, 59.4],
                [163, 62],
                [163, 72],
                [163.2, 55.9],
                [163.2, 54],
                [163.2, 59.8],
                [163.2, 56.4],
                [163.5, 51.8],
                [163.5, 50],
                [163.8, 67.3],
                [163.8, 58.6],
                [163.8, 58.5],
                [164, 55.7],
                [164, 53.8],
                [164.1, 71.6],
                [164.3, 59.8],
                [164.4, 55.5],
                [164.5, 60.3],
                [164.5, 52.3],
                [164.5, 63.2],
                [165, 62],
                [165.1, 80.9],
                [165.1, 65.5],
                [165.1, 59.1],
                [165.1, 60.9],
                [165.1, 56.2],
                [165.1, 56.8],
                [165.1, 86.3],
                [165.1, 104.1],
                [165.1, 62.7],
                [165.1, 53.6],
                [165.1, 55.2],
                [165.1, 64.1],
                [165.1, 72.3],
                [165.1, 58.2],
                [165.5, 60],
                [165.7, 73.1],
                [166, 53.2],
                [166, 69.8],
                [166.2, 58.6],
                [166.4, 56.6],
                [166.4, 70.7],
                [166.4, 55],
                [166.8, 57.2],
                [166.8, 56.6],
                [167, 59.8],
                [167.1, 62.2],
                [167.5, 59],
                [167.6, 62.7],
                [167.6, 68.8],
                [167.6, 76.4],
                [167.6, 54.5],
                [167.6, 65.9],
                [167.6, 54.5],
                [167.6, 63.6],
                [167.6, 64.5],
                [167.6, 61],
                [167.6, 57.8],
                [167.6, 63],
                [167.6, 52.7],
                [167.6, 58.3],
                [167.6, 55.7],
                [167.6, 61.4],
                [167.6, 55],
                [167.6, 72.3],
                [167.8, 59],
                [168.2, 53.4],
                [168.2, 49.2],
                [168.3, 54.8],
                [168.5, 65.2],
                [168.9, 62],
                [168.9, 56.8],
                [168.9, 60.5],
                [168.9, 56.6],
                [168.9, 55],
                [168.9, 62.3],
                [168.9, 69],
                [168.9, 63],
                [169, 62.5],
                [169, 58.2],
                [169.4, 63.4],
                [169.5, 52.8],
                [169.5, 67.3],
                [169.5, 57.3],
                [170, 72.9],
                [170, 59],
                [170, 69.4],
                [170, 55.9],
                [170, 70.6],
                [170, 73.2],
                [170.2, 72.8],
                [170.2, 55.9],
                [170.2, 69.1],
                [170.2, 77.3],
                [170.2, 55],
                [170.2, 67.7],
                [170.2, 73.6],
                [170.2, 59.1],
                [170.2, 54.5],
                [170.2, 63.6],
                [170.3, 64.8],
                [170.5, 64.5],
                [170.5, 67.8],
                [170.9, 54.2],
                [171.4, 53.4],
                [171.8, 56.2],
                [172.1, 56.6],
                [172.5, 55.2],
                [172.7, 69.5],
                [172.7, 68.2],
                [172.7, 70.5],
                [172.7, 61.1],
                [172.7, 62],
                [172.7, 105.2],
                [172.7, 75.9],
                [172.9, 62.5],
                [173, 59.8],
                [173.2, 69.2],
                [173.2, 58.4],
                [173.4, 52.7],
                [174, 75.7],
                [174, 54.5],
                [174, 55.5],
                [174, 55.5],
                [174, 66.4],
                [174, 73.6],
                [175, 82.5],
                [175, 73.2],
                [175.2, 66.8],
                [175.2, 62.3],
                [175.2, 57.7],
                [175.3, 63.6],
                [175.3, 63.6],
                [175.3, 63.6],
                [175.3, 72.7],
                [175.3, 65.5],
                [176.2, 67.2],
                [176.2, 66.8],
                [176.5, 87.8],
                [176.5, 73.6],
                [176.5, 83],
                [176.5, 71.8],
                [177.8, 60],
                [178, 70.6],
                [179.8, 66.8],
                [179.9, 67.3],
                [180.3, 60.7],
                [182.9, 81.8]
            ]
        }, {
            name: 'Male',
            id: 'male',
            color: 'rgba(119, 152, 191, .5)',
            data: [
                [157.2, 58.4],
                [160, 72.3],
                [163, 57],
                [163.8, 72.2],
                [164.1, 55.2],
                [164.5, 70],
                [164.5, 63.2],
                [165.1, 65],
                [165.1, 70.5],
                [165.1, 65],
                [165.1, 66.4],
                [166.4, 85.9],
                [166.4, 75],
                [167, 64.6],
                [167, 68.2],
                [167, 59.1],
                [167.4, 67.7],
                [167.4, 53.9],
                [167.6, 72.3],
                [167.6, 82.7],
                [167.6, 64.5],
                [167.6, 84.5],
                [167.6, 68.6],
                [167.6, 75.5],
                [167.6, 76.3],
                [167.6, 69.1],
                [167.6, 66.8],
                [167.6, 74.1],
                [168.9, 69.1],
                [168.9, 75],
                [168.9, 55.5],
                [169.4, 65.9],
                [169.5, 75.6],
                [170, 59.5],
                [170, 61.3],
                [170.2, 77.3],
                [170.2, 72.7],
                [170.2, 65.9],
                [170.2, 85.5],
                [170.2, 69.1],
                [170.2, 62.3],
                [170.5, 67.7],
                [170.5, 56.8],
                [170.8, 93.2],
                [171.2, 79.1],
                [171.4, 84.7],
                [171.4, 70],
                [171.4, 72.7],
                [171.4, 91.4],
                [171.5, 61.4],
                [171.5, 70],
                [171.8, 66.1],
                [172.1, 74.9],
                [172.7, 72.3],
                [172.7, 73.4],
                [172.7, 66.2],
                [172.7, 75.3],
                [172.7, 90.9],
                [172.7, 84.1],
                [172.7, 95.9],
                [172.7, 76.8],
                [172.8, 69.1],
                [173, 60.9],
                [173, 72.4],
                [173.5, 81.8],
                [174, 86.8],
                [174, 72.2],
                [174, 70.9],
                [174, 82.5],
                [174, 65.6],
                [174, 71],
                [174, 88.6],
                [174, 80],
                [174, 73.9],
                [174, 86.2],
                [174, 73.4],
                [174.5, 63.9],
                [175, 70.2],
                [175, 62],
                [175.3, 84.1],
                [175.3, 90.9],
                [175.3, 87.7],
                [175.3, 70.9],
                [175.3, 69.1],
                [175.3, 73.6],
                [175.3, 67.7],
                [175.3, 72.1],
                [175.3, 91.1],
                [175.3, 71.8],
                [175.3, 67.3],
                [175.3, 81.8],
                [175.3, 64.5],
                [175.3, 71.8],
                [175.3, 86.4],
                [175.5, 80.9],
                [175.5, 63.2],
                [175.5, 70.9],
                [175.5, 70],
                [175.9, 77.7],
                [176, 78.8],
                [176, 74.6],
                [176, 85.9],
                [176, 86.4],
                [176.5, 80.2],
                [176.5, 73],
                [176.5, 82.3],
                [176.5, 73.6],
                [176.5, 85],
                [176.5, 87.9],
                [176.5, 68.4],
                [177, 72.5],
                [177, 68.2],
                [177, 71.6],
                [177, 68.9],
                [177.1, 83.4],
                [177.2, 94.1],
                [177.3, 73.2],
                [177.5, 72],
                [177.8, 74.8],
                [177.8, 58],
                [177.8, 79.5],
                [177.8, 78.6],
                [177.8, 71.8],
                [177.8, 116.4],
                [177.8, 83.6],
                [177.8, 84.1],
                [177.8, 80.9],
                [177.8, 80.5],
                [177.8, 102.5],
                [177.8, 63.6],
                [177.8, 64.1],
                [177.8, 77.7],
                [177.8, 93.6],
                [177.8, 81.8],
                [177.8, 68.6],
                [177.8, 96.8],
                [177.8, 81.8],
                [177.8, 61.4],
                [177.8, 76.6],
                [177.8, 75.5],
                [177.8, 72],
                [177.8, 86.4],
                [177.8, 82.7],
                [177.8, 87.7],
                [178, 89.6],
                [178.1, 72],
                [179.1, 89.1],
                [179.1, 92.7],
                [179.1, 75.5],
                [179.1, 87.3],
                [179.1, 79.1],
                [179.1, 71.8],
                [179.7, 86.4],
                [179.8, 84.5],
                [180, 76.6],
                [180.1, 93],
                [180.3, 83.2],
                [180.3, 73.6],
                [180.3, 77.7],
                [180.3, 83.2],
                [180.3, 85.5],
                [180.3, 88.6],
                [180.3, 82.6],
                [180.3, 82.7],
                [180.3, 71.4],
                [180.3, 82.8],
                [180.3, 93.2],
                [180.3, 75.5],
                [180.3, 83.2],
                [180.3, 73.2],
                [180.3, 76.4],
                [180.5, 77.8],
                [180.6, 72.5],
                [180.6, 72.7],
                [181.1, 66],
                [181.5, 74.8],
                [181.6, 75.5],
                [181.6, 70.5],
                [181.6, 84.5],
                [181.6, 78.9],
                [182, 67.2],
                [182, 72],
                [182.1, 75.7],
                [182.2, 87.1],
                [182.4, 74.5],
                [182.9, 85],
                [182.9, 75],
                [182.9, 80.9],
                [182.9, 87.3],
                [182.9, 89.1],
                [182.9, 88.7],
                [182.9, 79.5],
                [183, 65.9],
                [183, 90.9],
                [183.5, 74.8],
                [184, 79.6],
                [184, 81.6],
                [184, 86.4],
                [184.2, 77.3],
                [184.2, 94.5],
                [184.2, 80.1],
                [184.2, 76.8],
                [184.4, 68],
                [184.5, 78.4],
                [184.9, 86.4],
                [185.4, 66.8],
                [185.4, 102.3],
                [185.4, 94.1],
                [185.4, 83.6],
                [185.4, 76.4],
                [185.4, 81.8],
                [185.4, 84.1],
                [186, 84.8],
                [186.5, 72.6],
                [186.7, 101.4],
                [186.7, 91.8],
                [186.7, 87.8],
                [186.7, 86.4],
                [187.2, 78.8],
                [188, 87.3],
                [188, 85.9],
                [188, 84.1],
                [188, 91.4],
                [188, 90.5],
                [188, 84.1],
                [188, 94.3],
                [188, 83.6],
                [188, 85.9],
                [188, 80.5],
                [188, 72.4],
                [188, 93.2],
                [188, 82.7],
                [189.2, 84.1],
                [190.5, 84.1],
                [190.5, 108.6],
                [190.5, 80.9],
                [190.5, 98.2],
                [190.5, 89.1],
                [190.5, 73.6],
                [192, 102.3],
                [192, 101.6],
                [192, 90],
                [192.7, 93.8],
                [193, 95.9],
                [193.5, 80.7],
                [197.1, 90.9],
                [198.1, 85.5]
            ]
        }, {
            type: 'linearregression',
            linkedTo: 'female',
            name: 'Female - linear regression',
            color: 'rgba(223, 83, 83, .75)',
            showInLegend: true
        }, {
            type: 'linearregression',
            name: 'Male - linear regression',
            color: 'rgba(119, 152, 191, .75)',
            linkedTo: 'male',
            showInLegend: true
        }]
    });
}

function heatmap() {
    (async () => {
        const csv = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@35bdee4/samples/data/large-heatmap.csv'
        ).then(res => res.text());

        Highcharts.chart('container', {

            data: {
                csv: csv
            },

            chart: {
                type: 'heatmap'
            },

            boost: {
                useGPUTranslations: true
            },

            title: {
                text: 'Large heatmap',
                align: 'left',
                x: 40
            },

            subtitle: {
                text: 'Temperature variation by day and hour through 2023',
                align: 'left',
                x: 40
            },

            xAxis: {
                type: 'datetime',
                min: '2023-01-01',
                max: '2023-12-31 23:59:59',
                labels: {
                    align: 'left',
                    x: 5,
                    y: 14,
                    format: '{value:%B}' // long month
                },
                showLastLabel: false,
                tickLength: 16
            },

            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    format: '{value}:00'
                },
                minPadding: 0,
                maxPadding: 0,
                startOnTick: false,
                endOnTick: false,
                tickPositions: [0, 6, 12, 18, 24],
                tickWidth: 1,
                min: 0,
                max: 23,
                reversed: true
            },

            colorAxis: {
                stops: [
                    [0, '#3060cf'],
                    [0.5, '#fffbbc'],
                    [0.9, '#c4463a'],
                    [1, '#c4463a']
                ],
                min: -15,
                max: 25,
                startOnTick: false,
                endOnTick: false,
                labels: {
                    format: '{value}℃'
                }
            },

            series: [{
                boostThreshold: 100,
                borderWidth: 0,
                nullColor: '#EFEFEF',
                colsize: 24 * 36e5, // one day
                tooltip: {
                    headerFormat: 'Temperature<br/>',
                    // eslint-disable-next-line max-len
                    pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ' +
                '℃</b>'
                }
            }]

        });

    })();
}

function pictorial() {
    Highcharts.chart('container', {
        chart: {
            type: 'pictorial'
        },

        title: {
            text: 'Composition of the human body'
        },

        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<{headingTagName}>' +
                '{chartTitle}</{headingTagName}><p>{typeDescription}</p><p>' +
                '{chartLongdesc}</p>'
            },
            point: {
                valueDescriptionFormat: '{value}.'
            },
            series: {
                descriptionFormat: ''
            },
            landmarkVerbosity: 'one'
        },

        xAxis: {
            categories: ['Woman', 'Man'],
            lineWidth: 0,
            opposite: true
        },

        yAxis: {
            visible: false,
            stackShadow: {
                enabled: true
            },
            max: 100
        },

        legend: {
            itemMarginTop: 15,
            itemMarginBottom: 15,
            layout: 'vertical',
            padding: 0,
            verticalAlign: 'middle',
            align: 'center',
            margin: 0
        },

        tooltip: {
            headerFormat: ''
        },

        plotOptions: {
            series: {
                pointPadding: 0,
                groupPadding: 0,
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    format: '{y} %'
                },
                stacking: 'normal',
                paths: [{
                    definition: 'm 656.59433,740.097 c -0.634,-1.435 -13.566,' +
                    '-15.425 -33.487,-23.292 -4.568,-1.94 -4.545,2.705 ' +
                    '-16.944,-34.925 -26.957,-72.647 -5.661,-112.736 -51.135,' +
                    '-200.791 -6.888,-14.322 -9.901,-24.921 -16.16,-50.12 ' +
                    '-25.397,-104.478 -6.032,-90.98 -15.87,-135.251 -17.961,' +
                    '-63.049 -50.754,-59.498 -71.782,-59.155 -16.944,0.378 ' +
                    '-45.224,-11.699 -52.936,-19.746 -10.555,-11.486 -17.912,' +
                    '-20.548 -11.679,-58.855 0,0 7.037,-12.141 9.078,-34.125 ' +
                    '9.284,11.287 24.572,-33.84 16.065,-42.691 -1.745,-1.867 ' +
                    '-5.169,-1.236 -6.289,1.015 -1.292,1.484 -1.315,3.695 ' +
                    '-2.888,4.964 -2,-9.359 3.289,-28.498 -7.935,-56.968 ' +
                    '-5.541,-12.289 -11.235,-15.496 -21.547,-22.44 -8.401,' +
                    '-6.048 -28.842,-7.595 -29.842,-7.717 h -9.461 c -1,' +
                    '0.122 -21.441,1.669 -29.842,7.717 -10.312,6.944 -16.006,' +
                    '10.151 -21.547,22.44 -11.224,28.47 -5.935,47.609 -7.935,' +
                    '56.968 -1.573,-1.269 -1.596,-3.48 -2.888,-4.964 -1.12,' +
                    '-2.251 -4.544,-2.882 -6.289,-1.015 -8.507,8.851 6.781,' +
                    '53.978 16.065,42.691 2.041,21.984 9.078,34.125 9.078,' +
                    '34.125 6.233,38.307 -1.124,47.369 -11.679,58.855 -7.712,' +
                    '8.047 -35.992,20.124 -52.935,19.746 -21.029,-0.343 ' +
                    '-53.822,-3.894 -71.782,59.155 -9.838,44.271 9.527,' +
                    '30.773 -15.87,135.251 -6.259,25.199 -9.272,35.798 ' +
                    '-16.16,50.12 -45.474004,88.055 -24.178004,128.144 ' +
                    '-51.135004,200.791 -12.399,37.63 -12.376,32.985 -16.944,' +
                    '34.925 -19.921,7.867 -32.853,21.857 -33.487,23.292 ' +
                    '-8.923,20.454 -23.3280004,27.412 -19.92100038,33.844 ' +
                    '0.89599998,1.702 3.31799998,2.588 4.94399998,1.381 ' +
                    '5.1890004,0.91 12.7380004,-4.808 16.1270004,-8.599 ' +
                    '4.102,-4.706 3.375,-7.457 11.332,-13.86 1.824,2.047 ' +
                    '-2.155,20.335 -3.12,23.398 -4.877,14.729 -26.5670004,' +
                    '49.619 -17.595,54.417 0.945,0.4 2.227,0.955 3.073,0.089 ' +
                    '1.553,-1.53 3.53,-2.604 4.841,-4.372 8.025,-10.218 ' +
                    '17.566,-34.36 24.059,-39.238 3.279,0.224 1.596,2.346 ' +
                    '-4.475,22.532 -3.673,13.084 -5.142,19.941 -5.142,19.941 ' +
                    '-10.126,30.466 6.229,25.716 11.501,6.808 0.448,-1.537 ' +
                    '9.722,-26.912 10.129,-28.16 1.241,-3.291 4.602,-17.806 ' +
                    '8.801,-14.872 0.646,2.469 -0.335,3.044 -3.536,31.521 ' +
                    '-2.6,21.813 -3.236,8.789 -2.713,26.425 0.079,2.164 ' +
                    '4.439,3.257 6.282,2.115 10.539,-9.723 12.692,-57.611 ' +
                    '18.074,-61.022 3.669,4.293 4.272,33.754 5.982,39.221 ' +
                    '2.652,9.705 7.446,4.802 7.981,3.239 3.825004,-9.324 ' +
                    '-0.19,-30.536 0.628,-45.388 0,0 4.369004,-14.53 ' +
                    '7.198004,-38.676 4.176,-45.514 -17.861004,13.267 48.59,' +
                    '-167.185 0,0 5.299,-10.218 13.794,-30.791 9.81,-21.31 ' +
                    '5.988,-35.652 19.766,-73.451 0.361,-1 16.239,-47.758 ' +
                    '24.363,-68.15 45.673,232.645 -9.743,77.068 -28.904,' +
                    '331.531 -5.708,105.042 1.862,76.707 18.19,223.544 ' +
                    '31.719,289.304 -15.087,130.161 35.652,384.312 10.99,' +
                    '51.495 9.837,44.86 11.854,56.284 2.28,21.363 -1.788,' +
                    '21.528 -1.679,31.313 -0.699,24.031 5.964,8.574 -1.712,' +
                    '52.53 -4.993,24.181 -4.913,9.214 -7.677,37.417 -3.463,' +
                    '13.977 -13.912,52.732 0.856,52.45 1.286,7.64 5.541,' +
                    '9.156 9.756,6.712 -0.684,2.455 1.381,4.293 2.766,6.011 ' +
                    '4.813,1.322 4.76,1.029 6.828,-0.555 1.495,5.791 5.173,' +
                    '5.742 6.748,6.16 4.768,1.476 5.904,-11.237 6.781,-16.16 ' +
                    '0.856,-0.046 1.705,-0.096 2.551,-0.129 -1.072,3.151 ' +
                    '-7.161,15.833 2.634,16.835 7.651,1.238 8.542,0.168 ' +
                    '12.727,-3.791 6.992,-7.01 5.41,-8.94 6.623,-20.685 ' +
                    '0.191,-2.384 5.685,-6.58 0.872,-37.642 -1.855,-15.952 ' +
                    '-0.832,2.69 0.304,-35.715 0.371,-16.594 5.685,-19.576 ' +
                    '6.408,-31.349 -6.493,-27.396 -1.465,-14.55 -4.045,' +
                    '-30.51 -6.145,-34.313 -7.105,-27.255 0.575,-107.316 ' +
                    '6.987,-65.839 14.147,-68.677 7.72,-136.864 -14.296,' +
                    '-110.15 -0.224,-68.945 1.451,-126.216 1.503,-67.36 ' +
                    '-4.198,-108.808 3.103,-168.203 4.314,-34.735 12.351,' +
                    '-68.835 12.215,-90.227 2.948,-3.639 4.984,-7.885 7.168,' +
                    '-11.993 3.172,-6.203 2.655,-0.513 2.627,-35.675 1.424,' +
                    '-0.218 2.885,-0.281 4.27,-0.677 0.162,-0.334 0.307,' +
                    '-0.661 0.436,-0.985 0.007,0.007 0.014,0.015 0.022,0.023 ' +
                    '0.008,-0.008 0.015,-0.016 0.022,-0.023 0.129,0.324 ' +
                    '0.274,0.651 0.436,0.985 1.385,0.396 2.846,0.459 4.27,' +
                    '0.677 -0.028,35.162 -0.545,29.472 2.627,35.675 2.184,' +
                    '4.108 4.22,8.354 7.168,11.993 -0.136,21.392 7.901,' +
                    '55.493 12.215,90.227 7.301,59.394 1.6,100.842 3.103,' +
                    '168.203 1.675,57.27 15.747,16.066 1.451,126.216 -6.427,' +
                    '68.186 0.733,71.025 7.72,136.864 7.68,80.061 6.72,' +
                    '73.003 0.575,107.316 -2.58,15.96 2.448,3.114 -4.045,' +
                    '30.51 0.723,11.773 6.037,14.755 6.408,31.349 1.136,' +
                    '38.405 2.159,19.763 0.304,35.715 -4.813,31.062 0.681,' +
                    '35.258 0.872,37.642 1.213,11.745 -0.369,13.675 6.623,' +
                    '20.685 4.185,3.959 5.076,5.029 12.727,3.791 9.795,' +
                    '-1.002 3.706,-13.684 2.634,-16.835 0.846,0.033 1.695,' +
                    '0.083 2.551,0.129 0.877,4.923 2.013,17.636 6.781,16.16 ' +
                    '1.575,-0.418 5.253,-0.369 6.748,-6.16 2.068,1.584 2.015,' +
                    '1.877 6.828,0.555 1.385,-1.718 3.45,-3.556 2.766,-6.011 ' +
                    '4.215,2.444 8.47,0.928 9.756,-6.712 14.768,0.282 4.319,' +
                    '-38.473 0.856,-52.45 -2.764,-28.203 -2.684,-13.236 ' +
                    '-7.677,-37.417 -7.676,-43.956 -1.013,-28.499 -1.712,' +
                    '-52.53 0.109,-9.785 -3.959,-9.95 -1.679,-31.313 2.017,' +
                    '-11.424 0.864,-4.789 11.854,-56.284 50.739,-254.151 ' +
                    '3.933,-95.007 35.652,-384.312 16.328,-146.837 23.898,' +
                    '-118.502 18.19,-223.544 -19.161,-254.463 -74.576,' +
                    '-98.886 -28.904,-331.531 8.124,20.392 24.002,67.15 ' +
                    '24.363,68.15 13.778,37.8 9.956,52.142 19.766,73.451 ' +
                    '8.495,20.573 13.794,30.791 13.794,30.791 66.451,180.451 ' +
                    '44.414,121.671 48.59,167.185 2.829,24.146 7.198,38.676 ' +
                    '7.198,38.676 0.818,14.852 -3.197,36.064 0.628,45.388 ' +
                    '0.535,1.563 5.329,6.466 7.981,-3.239 1.71,-5.467 2.313,' +
                    '-34.928 5.982,-39.221 5.382,3.411 7.535,51.3 18.074,' +
                    '61.022 1.843,1.142 6.203,0.049 6.282,-2.115 0.523,' +
                    '-17.636 -0.113,-4.612 -2.713,-26.425 -3.201,-28.477 ' +
                    '-4.182,-29.052 -3.536,-31.521 4.199,-2.934 7.56,11.581 ' +
                    '8.801,14.872 0.407,1.248 9.681,26.623 10.129,28.16 ' +
                    '5.272,18.908 21.627,23.658 11.501,-6.808 0,0 -1.469,' +
                    '-6.857 -5.142,-19.941 -6.071,-20.186 -7.754,-22.308 ' +
                    '-4.475,-22.532 6.493,4.878 16.034,29.02 24.059,39.238 ' +
                    '1.311,1.768 3.288,2.842 4.841,4.372 0.846,0.866 2.128,' +
                    '0.311 3.073,-0.089 8.972,-4.798 -12.718,-39.688 -17.595,' +
                    '-54.417 -0.965,-3.063 -4.944,-21.351 -3.12,-23.398 ' +
                    '7.957,6.403 7.23,9.154 11.332,13.86 3.389,3.791 10.938,' +
                    '9.509 16.127,8.599 1.626,1.207 4.048,0.321 4.944,-1.381 ' +
                    '3.403,-6.432 -11.002,-13.39 -19.925,-33.844 z'
                }, {
                    // eslint-disable-next-line max-len
                    definition: 'm 288.24306,919.66652 c -2.887,-37.612 3.116,' +
                    '-111.464 -6.141,-106.729 0,0 -1.513,6.585 -1.773,8.642 ' +
                    '-1.752,13.994 -0.121,74.406 -2.134,96.522 0,0 -7.163,' +
                    '57.876 -11.151,74.107 -3.988,16.22798 -11.166,115.22698 ' +
                    '-19.144,139.57398 -7.976,24.345 -16.75,56.8 -8.774,' +
                    '81.958 7.976,25.157 16.752,67.352 8.774,105.492 -7.976,' +
                    '38.14 -16.75,91.288 -11.964,118.069 3.521,19.706 4.786,' +
                    '38.546 7.978,42.603 3.188,4.057 0,12.169 0,22.721 0,' +
                    '10.547 1.594,33.271 -1.995,41.793 0,6.082 5.183,22.719 ' +
                    '2.394,30.427 -2.793,7.711 0,12.174 -3.591,15.417 -3.589,' +
                    '3.247 -9.572,11.77 -22.733,8.525 -7.978,-2.438 -8.375,' +
                    '-8.525 -7.178,-9.742 1.195,-1.216 -4.389,-0.402 -4.389,' +
                    '-0.402 -2.78,5.181 -12.76,6.868 -17.548,-0.406 -0.796,' +
                    '-1.218 -3.587,4.461 -9.969,3.243 -6.382,-1.218 -3.589,' +
                    '-4.055 -3.589,-4.055 0,0 -8.377,0.404 -10.37,-4.463 ' +
                    '-0.399,1.216 -4.387,2.839 -7.579,-0.406 -3.19,-3.245 ' +
                    '-2.791,-13.793 -1.594,-19.07 1.195,-5.277 6.796,-14.401 ' +
                    '8.774,-17.854 2.791,-4.867 13.161,-23.533 12.762,' +
                    '-28.806 -0.248,-3.263 0.796,-27.998 3.19,-34.081 2.394,' +
                    '-6.089 2.793,-13.391 2.793,-21.505 0,-8.116 1.995,' +
                    '-53.965 -13.959,-110.363 -15.954,-56.396 -23.531,' +
                    '-83.984 -23.928,-122.938 -0.399,-38.952 17.147,-62.483 ' +
                    '6.777,-121.312 -10.368,-58.836 -14.755,-97.785 -15.952,' +
                    '-101.439 -1.197,-3.647 -7.675,-87.08798 -7.675,' +
                    '-87.08798 -0.914,-90.865 2.12,-75.593 3.35,-108.574 ' +
                    '2.353,-63.252 1.051,-52.022 10.05,-88.612 1.577,-12.158 ' +
                    '2.454,-23.04 4.031,-35.203 0.657,-5.071 2.01,-11.418 ' +
                    '2.669,-16.489 9.196,-31.653 9.142,-25.304 5.191,-54.251 ' +
                    '-2.61,-19.17 0.658,-16.691 2.614,-36.464 0.344,-3.505 ' +
                    '3.794,-65.532 -2.78,-99.005 -4.466,-13.066 -8.932,' +
                    '-26.134 -13.4,-39.197 h -0.557 c 0.201,32.151 -11.049,' +
                    '55.538 -16.752,82.933 -1.867,13.001 -2.392,23.885 ' +
                    '-4.297,36.877 -0.585,4.014 -1.713,6.857 -2.315,10.995 ' +
                    '-2.596,17.861 2.82,24.968 -3.437,57.216 -7.242,37.317 ' +
                    '-22.927002,69.907 -30.150002,107.358 -1.197,6.198 ' +
                    '-0.553,12.864 -0.316,18.911 0.585,4.031 1.615,6.33 ' +
                    '2.475,10.552 1.195,5.861 1.78,13.168 2.863,18.818 1.334,' +
                    '6.942 1.438,15.31 1.664,23.435 0.207,7.346 1.037,12.54 ' +
                    '0.288,21.87 -0.218,2.72 -0.033,36.328 -3.134,48.688 ' +
                    '-1.434,5.7 -4.692,5.273 -6.077,4.279 -5.716,-7.654 ' +
                    '-0.615,-25.119 -6.28,-43.599 -0.559,0.38 -0.559,0.046 ' +
                    '-1.118,0.425 0.084,4.047 -0.667,9.273 -0.179,15.482 ' +
                    '0.779,9.977 0.378,14.142 0.07,18.034 -0.832,10.572 ' +
                    '-1.344,19.719 -3.924,25.218 -1.395,2.974 -5.2,5.59 ' +
                    '-8.669,1.478 -1.937,-3.302 -2.208,-8.173 -2.411,-15.058 ' +
                    '-0.878,-30.054 -0.969,-20.294 -1.334,-26.969 -0.388,' +
                    '-7.183 -0.61,-12.768 -0.61,-12.768 -0.89,-0.236 -1.494,' +
                    '-0.354 -2.345,-0.022 -2.167,19.698 -0.178,15.719 -2.96,' +
                    '39.445 -0.491,4.187 -0.139,12.028 -1.225,17.079 -2.229,' +
                    '10.363 -11.671,9.05 -12.444,1.027 -0.265,-2.74 -0.886,' +
                    '-5.687 -1.238,-8.086 -0.38,-2.592 -0.164,-6.26 -0.254,' +
                    '-8.989 -0.139,-4.209 -0.565,-7.888 -0.888,-12.069 ' +
                    '-0.373,-4.839 2.084,-17.895 0.023,-27.551 -0.026,0 ' +
                    '-1.142,0 -1.116,0 -0.734,4.359 -2.245,10.954 -3.969,' +
                    '19.445 -0.265,1.309 -0.399,3.632 -0.681,4.975 -1.549,' +
                    '7.394 -1.393,11.575 -2.166,16.148 -1.214,7.224 0.053,' +
                    '8.318 -2.505,13.124 -2.791,5.249 -7.135,2.857 -8.296,' +
                    '0.08 -1.801,-4.311 -2.814,-11.342 -2.795,-19.975 0.037,' +
                    '-15.995 2.716,-19.356 2.825,-40.619 0.023,-4.404 0.267,' +
                    '-8.277 -0.282,-12.349 v 2.129 c -2.435,4.109 -3.373,' +
                    '8.129 -7.8160001,10.222 -2.213,0.79 -4.001,1.246 -5.663,' +
                    '0.365 -1.62399996,-0.853 -2.71799996,-0.523 -2.11899996,' +
                    '-3.736 0.461,-2.47 1.58999996,-5.861 2.01399996,-8.907 ' +
                    '0.638,-4.582 0.555,-8.698 1.641,-13.506 0.632,-2.789 ' +
                    '2.368,-6.204 3.203,-8.885 1.366,-4.384 1.958,-10.449 ' +
                    '3.1560001,-12.473 0.903,-1.533 3.004,-3.975 4.31,-5.698 ' +
                    '0.346,-0.457 8.944,-13.182 12.286,-17.574 3.356,-4.409 ' +
                    '5.699,-8.14 5.699,-8.14 0.051,-11.746 3.059,-18.778 ' +
                    '2.08,-30.076 -1.692,-19.557 -0.495,1.76 -2.339,-121.232 ' +
                    '4.78,-68.261 11.045,-49.621 17.136,-111.518 4.058,' +
                    '-41.052 4.798,-56.274 7.364,-64.797 2.452,-8.147 6.34,' +
                    '-29.092 5.657,-43.675 -0.459,-9.801 -0.45,-14.221 ' +
                    '-1.543,-20.477 -2.05,-11.754 -1.431,-42.739 11.725,' +
                    '-69.299 11.477,-23.175 27.318,-34.048 49.629002,-43.289 ' +
                    '15.531,-6.434 14.433,-2.79 42.978,-18.213 17.074,-9.227 ' +
                    '57.814,-33.258 65.621,-50.863 0.124,-16.319 -0.366,' +
                    '-14.443 0.009,-29.778 0,0 -3.213,-13.298 -4.53,-22.591 ' +
                    '-6.854,-0.074 -10.769,-6.449 -13.127,-14.318 -2.094,' +
                    '-6.98 -1.877,-19.262 -1.918,-20.897999 -0.163,-6.367 ' +
                    '-0.441,-12.45 4.995,-14.77 1.445,-0.341 1.701,-0.376 ' +
                    '2.351,-0.208 0.836,0.213 1.278,1.131 2.115,1.344 -1.056,' +
                    '-33.236 4.238,-59.246 25.686,-73.844 38.147,-25.962 ' +
                    '84.194,-4.385 96.595,31.244 4.15,11.926 4.212,28.343 ' +
                    '2.791,42.601 h 0.557 c 1.212,-1.02 1.445,-1.628 3.877,' +
                    '-1.237 4.303,1.889 5.591,6.919 5.712,15.963999 0.177,' +
                    '13.445 -0.6,22.432 -9.367,31.903 -2.189,2.366 -4.282,' +
                    '2.09 -7.477,3.358 -0.207,4.645 -2.703,18.616 -2.703,' +
                    '18.616 0,0 -1.703,28.168 -0.651,31.938 4.364,15.563 ' +
                    '55.746,47.859 85.792,61.08 17.748,7.814 48.444,11.768 ' +
                    '69.031,44.574 13.863,22.079 19.151,53.497 15.704,74.476 ' +
                    '-1.369,8.304 -2.896,28.95 -0.455,42.944 10.918,54.033 ' +
                    '5.22,16.283 12.421,88.953 3.703,37.295 4.626,32.485 ' +
                    '12.068,67.063 0.877,4.079 0.794,6.836 1.346,12.065 ' +
                    '1.663,15.866 5.62,30.424 2.492,104.929 -2.799,66.377 ' +
                    '-3.96,53.491 -0.943,68.354 1.208,5.992 -3.063,8.431 ' +
                    '14.057,30.796 1.5,1.958 3.088,4.873 4.581,6.495 1.694,' +
                    '1.845 3.269,2.407 4.457,4.93 1.314,2.802 0.723,5.179 ' +
                    '1.38,8.273 0.807,3.74 1.647,6.727 4.105,12.349 1.013,' +
                    '2.327 -0.075,8.781 0.653,13.461 0.41,2.637 1.961,5.16 ' +
                    '2.388,7.739 0.002,0.022 0.939,1.3 0.762,2.483 -0.256,' +
                    '1.687 -2.004,3.38 -5.381,2.653 -6.446,-1.04 -7.101,' +
                    '-6.232 -10.611,-10.035 0.08,5.339 -0.595,7.281 1.099,' +
                    '29.728 0.427,5.661 3.893,30.336 -1.199,40.461 -1.756,' +
                    '3.495 -5.721,2.996 -7.803,0.51 -5.565,-6.642 -0.373,' +
                    '-10.685 -8.925,-51.36 -1.116,-5.271 -2.349,-0.61 -2.349,' +
                    '-0.61 -0.16,25.464 1.666,13.068 -0.25,31.836 -0.942,' +
                    '9.126 -0.375,27.282 -5.445,28.639 -4.658,1.253 -7.366,' +
                    '-2.318 -8.181,-5.416 -2.122,-8.108 -1.956,-18.062 ' +
                    '-2.014,-19.063 -0.154,-2.729 -1.026,-9.119 -1.135,' +
                    '-11.913 -0.365,-9.214 0.497,-12.819 -1.302,-26.917 ' +
                    '-0.143,-1.174 -1.462,-1.35 -1.462,-1.35 -1.961,1.819 ' +
                    '-0.851,8.454 -1.186,11.551 -3.15,28.922 0.442,32.063 ' +
                    '-4.351,43.031 -1.628,3.721 -6.48,3.881 -8.433,0.491 ' +
                    '-1.442,-2.512 -1.526,-5.726 -1.705,-6.352 -1.756,-6.089 ' +
                    '-1.334,-12.805 -1.863,-18.569 -0.354,-3.81 -0.926,' +
                    '-4.884 -0.856,-7.958 0.233,-10.437 2.309,-16.964 0.412,' +
                    '-27.651 -0.373,-0.187 -0.747,-0.378 -1.118,-0.564 ' +
                    '-0.745,1.157 -0.459,2.19 -0.832,3.716 -1.212,4.928 ' +
                    '-1.404,12.154 -2.204,17.859 -1.259,9.017 0.911,20.359 ' +
                    '-4.784,22.732 -2.791,-0.191 -2.603,-0.38 -4.274,-2.084 ' +
                    '-5.376,-13.557 -1.805,-31.088 -3.117,-47.522 -1.586,' +
                    '-19.77 -0.064,-18.681 0.35,-25.185 1.917,-31.072 0.966,' +
                    '-16.394 3.205,-32.181 2.262,-15.944 3.054,-13.863 4.133,' +
                    '-21.228 2.059,-14.053 -0.666,-20.851 -4.999,-37.704 ' +
                    '-0.491,-1.921 -1.163,-3.497 -1.622,-5.483 -2.089,-8.967 ' +
                    '-5.855,-19.003 -8.234,-27.605 -19.318,-69.827 -14.488,' +
                    '-54.078 -17.153,-72.648 -1.286,-8.943 -1.133,-5.494 ' +
                    '-0.113,-35.667 -0.809,-5.598 -2.364,-10.439 -3.177,' +
                    '-16.035 -1.797,-12.391 -2.844,-25.539 -4.639,-37.927 ' +
                    '-5.657,-26.218 -15.956,-48.792 -16.193,-80.094 -0.369,' +
                    '0.189 -0.743,0.378 -1.116,0.569 -2.808,11.112 -8.142,' +
                    '23.815 -12.783,35.175 -2.405,5.894 -0.418,6.326 -2.522,' +
                    '15.378 -2.886,12.424 -4.145,63.823 -0.885,88.047 0.927,' +
                    '6.952 1.197,1.809 2.793,20.448 0.284,3.354 -0.164,5.8 ' +
                    '-0.448,9.638 -0.233,3.137 -0.224,7.706 -0.638,10.272 ' +
                    '-1.468,9.087 -3.239,15.532 -1.15,24.966 2.02,9.109 ' +
                    '2.677,4.255 8.751,34.942 0.994,5.012 0.751,7.619 1.466,' +
                    '13.365 0.565,4.546 2.078,12.258 2.836,16.265 0.745,' +
                    '3.916 1.063,8.954 1.788,12.814 1.568,8.348 8.083,29.891 ' +
                    '8.46,62.064 0.704,59.53 4.476,55.504 4.024,102.244 ' +
                    '-0.614,56.92 -8.584,147.53898 -14.226,174.12198 -7.577,' +
                    '35.704 -12.762,81.961 -9.967,90.885 2.787,8.926 12.363,' +
                    '79.119 6.775,111.58 -5.582,32.455 -34.296,139.976 ' +
                    '-33.897,161.887 0.397,21.911 -5.919,41.448 0.397,55.584 ' +
                    '3.99,8.926 1.199,27.188 2.793,32.459 1.596,5.275 3.589,' +
                    '20.288 9.173,24.751 5.584,4.465 15.154,27.184 13.161,' +
                    '34.489 -1.995,7.302 -5.185,12.983 -10.37,10.956 -4.385,' +
                    '4.869 -9.971,3.651 -11.166,3.245 -1.197,-0.406 -4.387,' +
                    '8.926 -13.959,1.624 -2.392,3.649 -5.582,6.488 -12.365,' +
                    '3.649 -6.779,-2.839 -4.784,-3.649 -4.784,-3.649 l ' +
                    '-5.185,0.81 c 0,0 0.796,10.55 -8.776,10.55 -9.57,0 ' +
                    '-23.529,-6.493 -22.731,-17.04 0.796,-10.552 -0.798,' +
                    '-24.753 3.988,-39.358 -4.786,-10.144 -5.185,-26.372 ' +
                    '-2.791,-34.085 2.392,-7.704 0,-17.85 -0.401,-23.123 ' +
                    '-0.399,-5.277 7.579,-37.33 7.579,-46.254 0,-8.93 0.798,' +
                    '-90.483 -4.786,-102.654 -5.584,-12.169 -12.762,-60.049 ' +
                    '-4.387,-93.316 0,0 10.11,-48.282 10.37,-60.455 0.397,' +
                    '-18.666 -20.341,-75.874 -20.341,-98.593 0,-22.723 ' +
                    '-13.56,-109.14698 -15.154,-115.63998 -1.594,-6.492 ' +
                    '-9.109,-49.82 -9.109,-49.82'
                }]
            }
        },

        series: [{
            name: 'Other',
            data: [25, 25]
        }, {
            name: 'Essential Fat',
            data: [12, 3]
        },
        {
            name: 'Non-Essential Fat',
            data: [15, 12]
        }, {
            name: 'Muscle Tissue',
            data: [36, 45]
        },
        {
            name: 'Bone',
            data: [12, 15]
        }
        ],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        padding: 8,
                        margin: 12,
                        itemMarginTop: 0,
                        itemMarginBottom: 0,
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    }
                }
            }]
        }
    });
}

const params = new URLSearchParams(window.location.search);
const chartToShow = params.get('chart') ?? 'hero';

const demoCard = document.getElementById('demoCard');
const demoName = document.getElementById('demoName');
const demoDescription = document.getElementById('demoDescription');
const productButtons = document.getElementById('productButtons');
const chartDescription = document.getElementById('chartDescription');

const productInfo = {
    core: {
        name: 'Core',
        icon: 'https://www.highcharts.com/demo/icons/products/core.svg',
        url: 'https://www.highcharts.com/products/highcharts/'
    },
    stock: {
        name: 'Stock',
        icon: 'https://www.highcharts.com/demo/icons/products/stock.svg',
        url: 'https://www.highcharts.com/products/stock/'
    },
    maps: {
        name: 'Maps',
        icon: 'https://www.highcharts.com/demo/icons/products/maps.svg',
        url: 'https://www.highcharts.com/products/maps/'
    },
    gantt: {
        name: 'Gantt',
        icon: 'https://www.highcharts.com/demo/icons/products/gantt.svg',
        url: 'https://www.highcharts.com/products/gantt/'
    },
    dashboards: {
        name: 'Dashboards',
        icon: 'https://www.highcharts.com/demo/icons/products/dashboards.svg',
        url: 'https://www.highcharts.com/products/dashboards/'
    },
    grid: {
        name: 'Grid',
        icon: 'https://www.highcharts.com/demo/icons/products/grid.svg',
        url: 'https://www.highcharts.com/products/grid/'
    },
    morningstar: {
        name: 'Morningstar',
        icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1483_3937)">
                <path d="M13.7999 13.6C14.6799 12.4333 15.1998 10.9926 15.1998 
                9.43158C15.1998 5.54856 11.9762 2.40002 8.0003 2.40002C4.02442 
                2.40002 0.799805 5.54856 0.799805 9.43158C0.799805 
                10.9915 1.31932 
                12.4341 2.19844 13.6H3.696C2.6088 12.5293 1.9372 11.0588 1.9372 
                9.43158C1.9372 6.16186 4.65152 3.5106 8.0003 
                3.5106C11.3491 3.5106 
                14.063 6.16186 14.063 9.43158C14.063 11.0566 13.3925 12.5293 
                12.3076 13.6H13.7999Z" fill="#E93D42"/>
                </g>
                <defs>
                <clipPath id="clip0_1483_3937">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                </defs>
                </svg>`,
        url: 'https://www.highcharts.com/products/data-connector-for-morningstar/'
    }
};

const charts = {
    hero: {
        run: hero,
        demoCardLabel: 'Highcharts Bubble Chart',
        demoName: 'Highcharts Bubble Chart',
        // eslint-disable-next-line max-len
        demoDescription: 'Bubble charts are great for comparing three dimensions of data without relying on color or 3D. ',
        // eslint-disable-next-line max-len
        chartDescription: 'A purely decorative bubble chart with a custom tooltip formatter',
        madeWith: ['core']
    },
    accessibility: {
        run: accessibility,
        demoCardLabel: 'Highcharts advanced accessibility demo',
        demoName: 'Advanced accessible chart',
        // eslint-disable-next-line max-len
        demoDescription: 'Chart demonstrating more advanced accessibility configuration.',
        chartDescription: `A purely decorative chart demonstrating 
       more advanced accessibility configuration, using 
       a custom series type based on the boxplot series.`,
        madeWith: ['core']
    },
    csv: {
        run: csv,
        demoCardLabel: 'Highcharts Live CSV data demo',
        demoName: 'Live data (CSV) ',
        // eslint-disable-next-line max-len
        demoDescription: 'Data input from a remote, changing, CSV file.',
        chartDescription: `A purely decorative chart demonstrating 
       the use of the data module to load data from 
       a remote CSV file, with polling enabled.`,
        madeWith: ['core']
    },
    polygon: {
        run: polygon,
        demoCardLabel: 'Highcharts Polygon Demo',
        demoName: 'Polygon Series',
        // eslint-disable-next-line max-len
        demoDescription: 'Height and weight data plotted using a set of coordinates.',
        chartDescription: `A purely decorative chart demonstrating 
       the use of the polygon series type.`,
        madeWith: ['core']
    },
    scatter: {
        run: scatter,
        demoCardLabel: 'Highcharts Scatter chart with linear regression demo',
        demoName: 'Scatter plot with linear regression',
        // eslint-disable-next-line max-len
        demoDescription: 'Scatter charts are often used to visualize the relationships between data in two dimensions.',
        chartDescription: `A purely decorative chart demonstrating 
       the use of the scatter series type with linear regression.`,
        madeWith: ['core']
    },
    heatmap: {
        run: heatmap,
        demoCardLabel: 'Highcharts Heatmap demo',
        demoName: 'Large Heatmap',
        // eslint-disable-next-line max-len
        demoDescription: 'The demo uses 8,000 points to visualize the temperature over a year.',
        chartDescription: `A purely decorative chart demonstrating 
       the use of the heatmap series type.`,
        madeWith: ['core']
    },
    pictorial: {
        run: pictorial,
        demoCardLabel: 'Highcharts Pictorial series demo',
        demoName: 'Pictorial Series',
        // eslint-disable-next-line max-len
        demoDescription: 'Chart showing the composition of the human body.',
        chartDescription: `A purely decorative chart demonstrating 
       the use of the pictorial series type.`,
        madeWith: ['core']
    }
};

Highcharts.setOptions({
    chart: {
        height: 400
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    }
});


function buildDemo() {
    const chart = charts[chartToShow];

    // aria label for demo card
    demoCard.setAttribute('aria-label', chart.demoCardLabel);

    // demo title and subtitle
    demoName.innerHTML = chart.demoName;

    // demo description and a11y description
    demoDescription.innerHTML = chart.demoDescription;
    chartDescription.innerHTML = chart.chartDescription;

    // made with buttons
    let buttonString = '';
    for (let ii = 0; ii < chart.madeWith.length; ++ii) {
        const product = productInfo[chart.madeWith[ii]];
        buttonString +=  `<a href="${product.url}" 
        target="_blank" class="hc-button hc-button--white hc-button--size-100">
        ${product.name}`;
        let isHighchartsIcon = false;
        try {
            const iconUrl = new URL(
                product.icon,
                // eslint-disable-next-line max-len
                (typeof window !== 'undefined' && window.location && window.location.origin) ?
                    window.location.origin :
                    'https://highcharts.com'
            );
            const allowedHosts = [
                'highcharts.com',
                'www.highcharts.com',
                'code.highcharts.com'
            ];
            if (allowedHosts.indexOf(iconUrl.hostname) !== -1) {
                isHighchartsIcon = true;
            }
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            isHighchartsIcon = false;
        }
        if (isHighchartsIcon) {
            // eslint-disable-next-line max-len
            buttonString += `<img src="${product.icon}" height="12" width="12"></a>`;
        } else {
            buttonString += product.icon;
        }
    }

    productButtons.innerHTML = buttonString;

    // show chart
    chart.run();
}


buildDemo();