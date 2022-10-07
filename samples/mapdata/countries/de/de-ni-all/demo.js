(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-ni-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-ni-03452000', 10], ['de-ni-03461000', 11], ['de-ni-03353000', 12],
        ['de-ni-04011000', 13], ['de-ni-03459000', 14], ['de-ni-03455000', 15],
        ['de-ni-03352000', 16], ['de-ni-03356000', 17], ['de-ni-03361000', 18],
        ['de-ni-03404000', 19], ['de-ni-03403000', 20], ['de-ni-03155000', 21],
        ['de-ni-03457000', 22], ['de-ni-03462000', 23], ['de-ni-03360000', 24],
        ['de-ni-03152000', 25], ['de-ni-03153000', 26], ['de-ni-03158000', 27],
        ['de-ni-03401000', 28], ['de-ni-03451000', 29], ['de-ni-03458000', 30],
        ['de-ni-03358000', 31], ['de-ni-03355000', 32], ['de-ni-03402000', 33],
        ['de-ni-03254000', 34], ['de-ni-03102000', 35], ['de-ni-03241000', 36],
        ['de-ni-03151000', 37], ['de-ni-03154000', 38], ['de-ni-03101000', 39],
        ['de-ni-03251000', 40], ['de-ni-03156000', 41], ['de-ni-03359000', 42],
        ['de-ni-03256000', 43], ['de-ni-03454000', 44], ['de-ni-03354000', 45],
        ['de-ni-03257000', 46], ['de-ni-03405000', 47], ['de-ni-03456000', 48],
        ['de-ni-03252000', 49], ['de-ni-03255000', 50], ['de-ni-03357000', 51],
        ['de-ni-03103000', 52], ['de-ni-03453000', 53], ['de-ni-03460000', 54],
        ['de-ni-03351000', 55], ['de-ni-03157000', 56]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-ni-all.topo.json">Niedersachsen</a>'
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
