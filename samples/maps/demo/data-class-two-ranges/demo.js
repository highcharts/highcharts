
// Load the data from a Google Spreadsheet
// https://docs.google.com/spreadsheets/d/14632VxDAT-TAL06ICnoLsV_JyvjEBXdVY-J34br5iXY/pubhtml
Highcharts.data({
    googleSpreadsheetKey: '14632VxDAT-TAL06ICnoLsV_JyvjEBXdVY-J34br5iXY',

    // Custom handler for columns
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
                        name: 'Trump',
                        color: '#0200D0',
                        y: parseInt(columns[4][row], 10)
                    }, {
                        name: 'Clinton',
                        color: '#C40401',
                        y: parseInt(columns[3][row], 10)
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
            mapData = Highcharts.maps['countries/us/us-all'],
            // Build the chart options
            options = {
                chart: {
                    type: 'map',
                    map: mapData,
                    renderTo: 'container',
                    borderWidth: 1
                },

                title: {
                    text: 'US presidential election 2016 results'
                },
                subtitle: {
                    text: 'Source: <a href="https://transition.fec.gov/pubrec/fe2016/2016presgeresults.pdf">Federal Election Commission</a>'
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
                        name: 'Clinton'
                    }, {
                        from: 0,
                        to: 100,
                        color: '#0200D0',
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
                    enableMouseTracking: false
                }]
            };
        keys = keys.map(function (key) {
            return key.toUpperCase();
        });
        Highcharts.each(mapData.features, function (mapPoint) {
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
