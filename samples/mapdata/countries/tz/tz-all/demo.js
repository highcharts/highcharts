(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tz/tz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tz-mw', 10], ['tz-kr', 11], ['tz-pw', 12], ['tz-mo', 13],
        ['tz-nj', 14], ['tz-zs', 15], ['tz-zw', 16], ['tz-km', 17],
        ['tz-mt', 18], ['tz-rv', 19], ['tz-pn', 20], ['tz-ps', 21],
        ['tz-zn', 22], ['tz-sd', 23], ['tz-sh', 24], ['tz-as', 25],
        ['tz-my', 26], ['tz-ma', 27], ['tz-si', 28], ['tz-mb', 29],
        ['tz-rk', 30], ['tz-ds', 31], ['tz-do', 32], ['tz-tb', 33],
        ['tz-li', 34], ['tz-ge', 35], ['tz-kl', 36], ['tz-tn', 37],
        ['tz-ka', 38], ['tz-ir', 39]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tz/tz-all.topo.json">United Republic of Tanzania</a>'
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
