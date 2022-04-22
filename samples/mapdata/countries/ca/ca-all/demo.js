(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-5682', 10], ['ca-bc', 11], ['ca-nu', 12], ['ca-nt', 13],
        ['ca-ab', 14], ['ca-nl', 15], ['ca-sk', 16], ['ca-mb', 17],
        ['ca-qc', 18], ['ca-on', 19], ['ca-nb', 20], ['ca-ns', 21],
        ['ca-pe', 22], ['ca-yt', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-all.topo.json">Canada</a>'
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
