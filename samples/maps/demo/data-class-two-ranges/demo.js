(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Load the data from a Google Spreadsheet
    // https://docs.google.com/spreadsheets/d/1uj1Gzv3fpH-b0w2tYpuKNp3TrGr43I9XAAqmgVE_jMs
    Highcharts.data({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1uj1Gzv3fpH-b0w2tYpuKNp3TrGr43I9XAAqmgVE_jMs',

        // Custom handler for columns
        parsed: function (columns) {

            /**
             * Event handler for clicking points. Use jQuery UI to pop up
             * a pie chart showing the details for each state.
             */
            function pointClick() {
                const row = this.options.row,
                    $div = $('<div></div>')
                        .dialog({
                            title: this.name,
                            width: 320,
                            height: 300
                        });

                window.chart = new Highcharts.Chart({
                    chart: {
                        renderTo: $div[0],
                        type: 'pie',
                        width: 290,
                        height: 240
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        enabled: true,
                        reversed: true
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
                        borderWidth: 1
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
                        i = $.inArray(postalCode, keys);
                    options.series[0].data.push(Highcharts.extend({
                        value: parseFloat(percent[i]),
                        name: names[i],
                        'postal-code': postalCode,
                        row: i
                    }, geometry));
                }
            });

            // Initialize the chart
            window.chart = new Highcharts.Map(options);
        },

        error: function () {
            $('#container').html('<div class="loading">' +
                '<i class="icon-frown icon-large"></i> ' +
                '<p>Error loading data from Google Spreadsheets</p>' +
                '</div>');
        }
    });

})();
