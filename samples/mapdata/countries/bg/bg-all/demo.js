(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bg/bg-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bg-vt', 10], ['bg-mt', 11], ['bg-vr', 12], ['bg-ky', 13],
        ['bg-vd', 14], ['bg-br', 15], ['bg-ya', 16], ['bg-tu', 17],
        ['bg-rg', 18], ['bg-sh', 19], ['bg-do', 20], ['bg-vn', 21],
        ['bg-si', 22], ['bg-rs', 23], ['bg-bl', 24], ['bg-sl', 25],
        ['bg-sz', 26], ['bg-kk', 27], ['bg-pd', 28], ['bg-pz', 29],
        ['bg-sm', 30], ['bg-kz', 31], ['bg-sf', 32], ['bg-sg', 33],
        ['bg-pn', 34], ['bg-gb', 35], ['bg-lv', 36], ['bg-pv', 37]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bg/bg-all.topo.json">Bulgaria</a>'
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
