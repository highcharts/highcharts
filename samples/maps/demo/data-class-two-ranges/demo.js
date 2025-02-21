(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Load the data from a Google Spreadsheet
    Highcharts.data({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1uj1Gzv3fpH-b0w2tYpuKNp3TrGr43I9XAAqmgVE_jMs',

        // Custom handler for columns
        parsed: function (columns) {

            /**
             * Event handler for clicking points.
             */
            function pointClick() {
                const row = this.options.row,
                    chart = this.series.chart;

                // Remove existing annotation if present
                chart.removeAnnotation('election-popup');

                // Add new annotation with a pie chart
                chart.addAnnotation({
                    id: 'election-popup',
                    labelOptions: {
                        useHTML: true,
                        backgroundColor: '#fff'
                    },
                    labels: [{
                        point: {
                            x: chart.plotWidth / 2,
                            y: chart.plotHeight / 10
                        },
                        text: `
                            <div id="annotation-header">
                                <span>${this.name}</span>
                                <button id="annotation-close-btn">
                                X
                                </button>
                            </div>
                            <div id="popup-pie"></div>
                        `,
                        shape: 'rect'
                    }],
                    zIndex: 10
                });

                // Create the pie chart inside the annotation
                const pieChart = Highcharts.chart('popup-pie', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        enabled: true,
                        reversed: true
                    },
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    },
                    series: [{
                        name: 'Votes',
                        data: [{
                            name: 'Trump',
                            color: '#C40401',
                            y: parseInt(columns[3][row], 10)
                        }, {
                            name: 'Clinton',
                            color: '#0200D0',
                            y: parseInt(columns[2][row], 10)
                        }],
                        dataLabels: {
                            format: '{point.percentage:.1f}%'
                        },
                        showInLegend: true
                    }]
                });

                document.getElementById('annotation-close-btn')
                    .addEventListener('click', function () {
                        pieChart?.destroy();
                        setTimeout(function () {
                            chart.removeAnnotation('election-popup');
                        }, 0);
                    });

            }

            // Make the columns easier to read
            let keys = columns[0];
            const names = columns[1],
                percent = columns[7],
                // Build the chart options
                options = {
                    chart: {
                        type: 'map',
                        map: mapData,
                        renderTo: 'container',
                        borderWidth: 1,
                        spacingBottom: 1
                    },

                    title: {
                        text: 'US presidential election 2016 results',
                        align: 'left'
                    },
                    subtitle: {
                        text: 'Source: <a href="https://transition.fec.gov/pubrec/fe2016/2016presgeresults.pdf">Federal Election Commission</a>',
                        align: 'left'
                    },

                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        x: -100,
                        y: 70,
                        floating: true,
                        layout: 'vertical',
                        valueDecimals: 0,
                        backgroundColor: ( // theme
                            Highcharts.defaultOptions &&
                            Highcharts.defaultOptions.legend &&
                            Highcharts.defaultOptions.legend.backgroundColor
                        ) || 'rgba(255, 255, 255, 0.85)'
                    },

                    mapNavigation: {
                        enabled: true,
                        enableButtons: false
                    },

                    colorAxis: {
                        dataClasses: [{
                            from: -100,
                            to: 0,
                            color: '#0200D0',
                            name: 'Clinton'
                        }, {
                            from: 0,
                            to: 100,
                            color: '#C40401',
                            name: 'Trump'
                        }]
                    },

                    series: [{
                        data: [],
                        joinBy: 'postal-code',
                        dataLabels: {
                            enabled: true,
                            color: '#FFFFFF',
                            format: '{point.postal-code}',
                            style: {
                                textTransform: 'uppercase'
                            }
                        },
                        name: 'Republicans margin',
                        point: {
                            events: {
                                click: pointClick
                            }
                        },
                        tooltip: {
                            ySuffix: ' %'
                        },
                        cursor: 'pointer'
                    }, {
                        name: 'Separators',
                        type: 'mapline',
                        nullColor: 'silver',
                        showInLegend: false,
                        enableMouseTracking: false,
                        accessibility: {
                            enabled: false
                        }
                    }]
                };
            keys = keys.map(function (key) {
                return key.toUpperCase();
            });
            mapData.objects.default.geometries.forEach(function (geometry) {
                if (geometry.properties['postal-code']) {
                    const postalCode = geometry.properties['postal-code'],
                        i = keys.indexOf(postalCode);
                    options.series[0].data.push(Highcharts.extend({
                        value: parseFloat(percent[i]),
                        name: names[i],
                        'postal-code': postalCode,
                        row: i
                    }, geometry));
                }
            });

            // Initialize the chart
            Highcharts.mapChart('container', options);
        },

        error: function () {
            document.getElementById('container').innerHTML = `
                <div class="loading">
                    <p>Error loading data from Google Spreadsheets</p>
                </div>
            `;
        }
    });

})();
