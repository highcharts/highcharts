(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-sn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-sn-14522000', 10], ['de-sn-14511000', 11], ['de-sn-14626000', 12],
        ['de-sn-14521000', 13], ['de-sn-14523000', 14], ['de-sn-14524000', 15],
        ['de-sn-14729000', 16], ['de-sn-14612000', 17], ['de-sn-14627000', 18],
        ['de-sn-14628000', 19], ['de-sn-14625000', 20], ['de-sn-14713000', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-sn-all.topo.json">Sachsen</a>'
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
