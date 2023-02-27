(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bi/bi-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bubanza', 10], ['bujumbura mairie', 11], ['bujumbura rural', 12],
        ['bururi', 13], ['cankuzo', 14], ['cibitoke', 15], ['gitega', 16],
        ['karuzi', 17], ['kayanza', 18], ['kirundo', 19], ['makamba', 20],
        ['muramvya', 21], ['muyinga', 22], ['mwaro', 23], ['ngozi', 24],
        ['rumonge', 25], ['rutana', 26], ['ruyigi', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bi/bi-all.topo.json">Burundi</a>'
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
