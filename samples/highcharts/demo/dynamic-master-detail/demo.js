(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json'
    ).then(response => response.json());

    let detailChart;

    // create the detail chart
    function createDetail(masterChart) {
        // prepare the detail chart
        const detailData = [],
            detailStart = data[0][0];

        masterChart.series[0].data.forEach(point => {
            if (point.x >= detailStart) {
                detailData.push(point.y);
            }
        });

        // create a detail chart referenced by a global variable
        detailChart = Highcharts.chart('detail-container', {
            chart: {
                marginBottom: 120,
                reflow: false,
                marginLeft: 50,
                marginRight: 20,
                style: {
                    position: 'absolute'
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Historical USD to EUR Exchange Rate',
                align: 'left'
            },
            subtitle: {
                text: 'Select an area by dragging across the lower chart',
                align: 'left'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: null
                },
                maxZoom: 0.1
            },
            tooltip: {
                format: '<b>{series.name}</b><br/>{x:%A %B %e %Y}:<br/>' +
                        '1 USD = {y:.2f} EUR',
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 3
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'USD to EUR',
                pointStart: detailStart,
                pointInterval: 24 * 3600 * 1000,
                data: detailData
            }],

            exporting: {
                enabled: false
            }

        }); // return chart
    }

    // create the master chart
    function createMaster() {
        const maskFill = 'rgba(0,0,255,0.05)';
        Highcharts.chart('master-container', {
            chart: {
                reflow: false,
                borderWidth: 0,
                backgroundColor: null,
                marginLeft: 50,
                marginRight: 20,
                zoomType: 'x',
                events: {

                    // listen to the selection event on the master chart to
                    // update the extremes of the detail chart
                    selection: function (event) {
                        const extremesObject = event.xAxis[0],
                            min = extremesObject.min,
                            max = extremesObject.max,
                            detailData = [],
                            xAxis = this.xAxis[0];

                        // reverse engineer the last part of the data
                        this.series[0].data.forEach(point => {
                            if (point.x > min && point.x < max) {
                                detailData.push([point.x, point.y]);
                            }
                        });

                        // move the plot bands to reflect the new detail
                        // span
                        xAxis.removePlotBand('mask-before');
                        xAxis.addPlotBand({
                            id: 'mask-before',
                            from: data[0][0],
                            to: min,
                            color: maskFill
                        });

                        xAxis.removePlotBand('mask-after');
                        xAxis.addPlotBand({
                            id: 'mask-after',
                            from: max,
                            to: data[data.length - 1][0],
                            color: maskFill
                        });


                        detailChart.series[0].setData(detailData);

                        return false;
                    }
                }
            },
            title: {
                text: null
            },
            accessibility: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                showLastTickLabel: true,
                maxZoom: 14 * 24 * 3600000, // fourteen days
                plotBands: [{
                    id: 'mask-before',
                    from: data[0][0],
                    to: data[data.length - 1][0],
                    color: maskFill
                }],
                title: {
                    text: null
                }
            },
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                min: 0.6,
                showFirstLabel: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 70],
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, 'rgba(255,255,255,0)']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    enableMouseTracking: false
                }
            },

            series: [{
                type: 'area',
                name: 'USD to EUR',
                pointInterval: 24 * 3600 * 1000,
                pointStart: data[0][0],
                data: data
            }],

            exporting: {
                enabled: false
            }

        }, masterChart => {
            createDetail(masterChart);
        }); // return chart instance
    }

    // make the container smaller and add a second container for the master chart
    const container = document.getElementById('container');
    container.style.position = 'relative';
    container.innerHTML += '<div id="detail-container"></div><div id="master-container"></div>';

    // create master and in its callback, create the detail chart
    createMaster();

})();