// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bubanza', 0],
    ['bujumbura mairie', 1],
    ['bujumbura rural', 2],
    ['bururi', 3],
    ['cankuzo', 4],
    ['cibitoke', 5],
    ['gitega', 6],
    ['karuzi', 7],
    ['kayanza', 8],
    ['kirundo', 9],
    ['makamba', 10],
    ['muramvya', 11],
    ['muyinga', 12],
    ['mwaro', 13],
    ['ngozi', 14],
    ['rumonge', 15],
    ['rutana', 16],
    ['ruyigi', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bi/bi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bi/bi-all.js">Burundi</a>'
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
