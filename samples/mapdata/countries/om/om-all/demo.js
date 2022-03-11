(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/om/om-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['om-ss', 10], ['om-ja', 11], ['om-mu', 12], ['om-wu', 13],
        ['om-da', 14], ['om-za', 15], ['om-bn', 16], ['om-ma', 17],
        ['om-bu', 18], ['om-sh', 19], ['om-bs', 20]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/om/om-all.topo.json">Oman</a>'
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
