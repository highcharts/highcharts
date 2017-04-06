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
    ['ni', 8],
    ['gd', 9],
    ['dm', 10],
    ['ag', 11],
    ['tt', 12],
    ['sw', 13],
    ['bb', 14],
    ['jm', 15],
    ['bu', 16],
    ['bs', 17],
    ['vc', 18],
    ['ht', 19],
    ['sv', 20],
    ['hn', 21],
    ['do', 22],
    ['mx', 23],
    ['bz', 24],
    ['gt', 25],
    ['cr', 26],
    ['pr', 27],
    ['pa', 28]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/north-america'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/north-america.js">North America</a>'
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
