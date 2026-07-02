(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    function drawChart(data) {
        return Highcharts.mapChart('container', {
            chart: {
                map: topology
            },

            title: {
                text: 'Population density by country (/km²)',
                align: 'left'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    align: 'right'
                }
            },

            mapView: {
                fitToGeometry: {
                    type: 'MultiPoint',
                    coordinates: [
                        // Alaska west
                        [-164, 54],
                        // Greenland north
                        [-35, 84],
                        // New Zealand east
                        [179, -38],
                        // Chile south
                        [-68, -55]
                    ]
                }
            },

            legend: {
                title: {
                    text: 'Individuals per km²',
                    style: {
                        color: ( // theme
                            Highcharts.defaultOptions &&
                            Highcharts.defaultOptions.legend &&
                            Highcharts.defaultOptions.legend.title &&
                            Highcharts.defaultOptions.legend.title.style &&
                            Highcharts.defaultOptions.legend.title.style.color
                        ) || 'black'
                    }
                },
                align: 'left',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: `color-mix(
                    in srgb,
                    var(--highcharts-background-color, white),
                    transparent 15%
                )`,
                symbolRadius: 0,
                symbolHeight: 14
            },
            colorAxis: {
                dataClasses: [{
                    to: 3,
                    color: '#440154'
                }, {
                    from: 3,
                    to: 10,
                    color: '#443983'
                }, {
                    from: 10,
                    to: 30,
                    color: '#31688e'
                }, {
                    from: 30,
                    to: 100,
                    color: '#21918c'
                }, {
                    from: 100,
                    to: 300,
                    color: '#35b779'
                }, {
                    from: 300,
                    to: 1000,
                    color: '#90d743'
                }, {
                    from: 1000,
                    color: '#fde725'
                }]
            },

            series: [{
                data: data,
                joinBy: ['iso-a2', 'code'],
                animation: true,
                name: 'Population density',
                tooltip: {
                    valueSuffix: '/km²'
                },
                shadow: false
            }]
        });
    }

    // Load the data from a Google Spreadsheet
    // https://docs.google.com/spreadsheets/d/1WBx3mRqiomXk_ks1a5sEAtJGvYukguhAkcCuRDrY1L0
    Highcharts.data({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1eSoQeilFp0HI-qgqr9-oXdCh5G_trQR2HBaWt_U_n78',

        // Custom handler when the spreadsheet is parsed
        parsed: function (columns) {

            // Read the columns into the data array
            const data = columns[0].slice(1).map((code, i) => ({
                code: code.toUpperCase(),
                value: parseFloat(columns[2][i + 1]),
                name: columns[1][i + 1]
            }));

            drawChart(data);
        },
        error: function () {
            const chart = drawChart();
            chart.showLoading(
                '<i class="icon-frown icon-large"></i> ' +
                'Error loading data from Google Spreadsheets'
            );
        }
    });

})();
