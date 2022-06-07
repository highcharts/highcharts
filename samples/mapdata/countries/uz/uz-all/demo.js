(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/uz/uz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['uz-fa', 10], ['uz-tk', 11], ['uz-an', 12], ['uz-ng', 13],
        ['uz-ji', 14], ['uz-si', 15], ['uz-ta', 16], ['uz-bu', 17],
        ['uz-kh', 18], ['uz-qr', 19], ['uz-nw', 20], ['uz-sa', 21],
        ['uz-qa', 22], ['uz-su', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/uz/uz-all.topo.json">Uzbekistan</a>'
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
