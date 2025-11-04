(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-wls-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gb-cmn', 10], ['gb-pem', 11], ['gb-cgn', 12], ['gb-swa', 13],
        ['gb-ntl', 14], ['gb-bge', 15], ['gb-vgl', 16], ['gb-pow', 17],
        ['gb-wrx', 18], ['gb-den', 19], ['gb-fln', 20], ['gb-gwn', 21],
        ['gb-cwy', 22], ['gb-agy', 23], ['gb-nwp', 24], ['gb-mon', 25],
        ['gb-crf', 26], ['gb-tof', 27], ['gb-bgw', 28], ['gb-cay', 29],
        ['gb-mty', 30], ['gb-rct', 31]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gb/gb-wls-all.topo.json">Wales</a>'
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
