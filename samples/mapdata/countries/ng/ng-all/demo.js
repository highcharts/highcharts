(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ng/ng-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ng-ri', 10], ['ng-kt', 11], ['ng-so', 12], ['ng-za', 13],
        ['ng-yo', 14], ['ng-ke', 15], ['ng-ad', 16], ['ng-bo', 17],
        ['ng-ak', 18], ['ng-ab', 19], ['ng-im', 20], ['ng-by', 21],
        ['ng-be', 22], ['ng-cr', 23], ['ng-ta', 24], ['ng-kw', 25],
        ['ng-la', 26], ['ng-ni', 27], ['ng-fc', 28], ['ng-og', 29],
        ['ng-on', 30], ['ng-ek', 31], ['ng-os', 32], ['ng-oy', 33],
        ['ng-an', 34], ['ng-ba', 35], ['ng-go', 36], ['ng-de', 37],
        ['ng-ed', 38], ['ng-en', 39], ['ng-eb', 40], ['ng-kd', 41],
        ['ng-ko', 42], ['ng-pl', 43], ['ng-na', 44], ['ng-ji', 45],
        ['ng-kn', 46]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ng/ng-all.topo.json">Nigeria</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
