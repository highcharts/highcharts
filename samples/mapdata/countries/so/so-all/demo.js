(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/so/so-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['so-br', 10], ['so-by', 11], ['so-ge', 12], ['so-bk', 13],
        ['so-jd', 14], ['so-sh', 15], ['so-bn', 16], ['so-ga', 17],
        ['so-hi', 18], ['so-sd', 19], ['so-mu', 20], ['so-nu', 21],
        ['so-jh', 22]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/so/so-all.topo.json">Somalia</a>'
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
