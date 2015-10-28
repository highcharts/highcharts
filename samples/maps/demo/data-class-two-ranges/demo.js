$(function () {

    // Load the data from a Google Spreadsheet
    // https://docs.google.com/a/highsoft.com/spreadsheet/pub?hl=en_GB&hl=en_GB&key=0AoIaUO7wH1HwdDFXSlpjN2J4aGg5MkVHWVhsYmtyVWc&output=html
    Highcharts.data({

        googleSpreadsheetKey: '0AoIaUO7wH1HwdDFXSlpjN2J4aGg5MkVHWVhsYmtyVWc',

        // custom handler for columns
        parsed: function (columns) {

            /**
             * Event handler for clicking points. Use jQuery UI to pop up
             * a pie chart showing the details for each state.
             */
            function pointClick() {
                var row = this.options.row,
                    $div = $('<div></div>')
                        .dialog({
                            title: this.name,
                            width: 400,
                            height: 300
                        });

                window.chart = new Highcharts.Chart({
                    chart: {
                        renderTo: $div[0],
                        type: 'pie',
                        width: 370,
                        height: 240
                    },
                    title: {
                        text: null
                    },
                    series: [{
                        name: 'Votes',
                        data: [{
                            name: 'Obama',
                            color: '#0200D0',
                            y: parseInt(columns[3][row], 10)
                        }, {
                            name: 'Romney',
                            color: '#C40401',
                            y: parseInt(columns[4][row], 10)
                        }],
                        dataLabels: {
                            format: '<b>{point.name}</b> {point.percentage:.1f}%'
                        }
                    }]
                });
            }

            // Make the columns easier to read

            var keys = columns[0],
                names = columns[1],
                percent = columns[7],
                // Build the chart options
                options = {
                    chart: {
                        renderTo: 'container',
                        type: 'map',
                        borderWidth: 1
                    },

                    title: {
                        text: 'US presidential election 2012 results'
                    },
                    subtitle: {
                        text: 'Source: <a href="http://en.wikipedia.org/wiki/United_States_presidential_election,' +
                            '_2012">Wikipedia</a>'
                    },

                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        x: -100,
                        y: 70,
                        floating: true,
                        layout: 'vertical',
                        valueDecimals: 0,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
                    },

                    mapNavigation: {
                        enabled: true,
                        enableButtons: false
                    },

                    colorAxis: {

                        dataClasses: [{
                            from: -100,
                            to: 0,
                            color: '#C40401',
                            name: 'Romney'
                        }, {
                            from: 0,
                            to: 100,
                            color: '#0200D0',
                            name: 'Obama'
                        }]
                    },

                    series: [{
                        data: [],
                        mapData: Highcharts.maps['countries/us/us-all'],
                        joinBy: 'postal-code',
                        dataLabels: {
                            enabled: true,
                            color: '#FFFFFF',
                            format: '{point.postal-code}',
                            style: {
                                textTransform: 'uppercase'
                            }
                        },
                        name: 'Democrats margin',
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
                        data: Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
                        color: 'silver',
                        showInLegend: false,
                        enableMouseTracking: false
                    }]
                };
            keys = keys.map(function (key) {
                return key.toUpperCase();
            });
            Highcharts.each(options.series[0].mapData.features, function (mapPoint) {
                if (mapPoint.properties['postal-code']) {
                    var postalCode = mapPoint.properties['postal-code'],
                        i = $.inArray(postalCode, keys);
                    options.series[0].data.push(Highcharts.extend({
                        value: parseFloat(percent[i]),
                        name: names[i],
                        'postal-code': postalCode,
                        row: i
                    }, mapPoint));
                }
            });

            // Initiate the chart

            window.chart = new Highcharts.Map(options);
        },

        error: function () {
            $('#container').html('<div class="loading">' +
                '<i class="icon-frown icon-large"></i> ' +
                '<p>Error loading data from Google Spreadsheets</p>' +
                '</div>');
        }
    });
});