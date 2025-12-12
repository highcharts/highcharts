// Source: https://www.bls.gov/web/laus/laumstrk.htm

(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-small.topo.json'
    ).then(response => response.json());

    // Load the data from the HTML table and tag it with an upper case name used
    // for joining
    const data = [];

    Highcharts.data({
        table: document.getElementById('data'),
        startColumn: 1,
        firstRowAsNames: false,
        complete: function (options) {
            options.series[0].data.forEach(function (p) {
                data.push({
                    ucName: p[0],
                    value: p[1]
                });
            });
        }
    });

    // Prepare map data for joining
    topology.objects.default.geometries.forEach(function (g) {
        if (g.properties && g.properties.name) {
            g.properties.ucName = g.properties.name.toUpperCase();
        }
    });

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'US unemployment rate in May 2024',
            align: 'left'
        },

        subtitle: {
            text: 'Small US map with data labels',
            align: 'left'
        },

        mapNavigation: {
            enabled: true,
            enableButtons: false
        },

        xAxis: {
            labels: {
                enabled: false
            }
        },

        colorAxis: {
            labels: {
                format: '{value}%'
            },
            stops: [
                [0.00, '#440154'],
                [0.14, '#46327f'],
                [0.29, '#365c8d'],
                [0.43, '#277f8e'],
                [0.57, '#1fa187'],
                [0.71, '#4ac26e'],
                [0.86, '#9fda3a'],
                [1.00, '#fde725']
            ],
            min: 0,
            max: 6
        },

        series: [{
            mapData: topology,
            data,
            joinBy: 'ucName',
            name: 'Unemployment rate per 2024',
            dataLabels: {
                enabled: true,
                format: '{point.properties.hc-a2}',
                style: {
                    fontSize: '10px'
                }
            },
            tooltip: {
                valueSuffix: '%'
            }
        }, {
        // The connector lines
            type: 'mapline',
            data: Highcharts.geojson(topology, 'mapline'),
            color: 'silver',
            accessibility: {
                enabled: false
            }
        }]
    });

})();
