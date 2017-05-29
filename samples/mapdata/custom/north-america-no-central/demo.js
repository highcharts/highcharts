// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gl', 0],
    ['lc', 1],
    ['um', 2],
    ['us', 3],
    ['vi', 4],
    ['ca', 5],
    ['cu', 6],
    ['kn', 7],
    ['gd', 8],
    ['dm', 9],
    ['ag', 10],
    ['tt', 11],
    ['sw', 12],
    ['bb', 13],
    ['jm', 14],
    ['bu', 15],
    ['bs', 16],
    ['vc', 17],
    ['ht', 18],
    ['do', 19],
    ['mx', 20],
    ['pr', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/north-america-no-central'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/north-america-no-central.js">North America without central</a>'
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
