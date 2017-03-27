// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-sl-10041000-10041516', 0],
    ['de-sl-10041000-10041518', 1],
    ['de-sl-10043000-10043115', 2],
    ['de-sl-10045000-10045111', 3],
    ['de-sl-10041000-10041511', 4],
    ['de-sl-10042000-10042111', 5],
    ['de-sl-10042000-10042113', 6],
    ['de-sl-10044000-10044122', 7],
    ['de-sl-10044000-10044123', 8],
    ['de-sl-10041000-10041513', 9],
    ['de-sl-10041000-10041100', 10],
    ['de-sl-10041000-10041512', 11],
    ['de-sl-10046000-10046113', 12],
    ['de-sl-10046000-10046114', 13],
    ['de-sl-10044000-10044120', 14],
    ['de-sl-10046000-10046118', 15],
    ['de-sl-10041000-10041515', 16],
    ['de-sl-10044000-10044116', 17],
    ['de-sl-10043000-10043117', 18],
    ['de-sl-10045000-10045117', 19],
    ['de-sl-10043000-10043114', 20],
    ['de-sl-10044000-10044115', 21],
    ['de-sl-10043000-10043111', 22],
    ['de-sl-10043000-10043112', 23],
    ['de-sl-10044000-10044112', 24],
    ['de-sl-10044000-10044113', 25],
    ['de-sl-10045000-10045112', 26],
    ['de-sl-10044000-10044114', 27],
    ['de-sl-10042000-10042112', 28],
    ['de-sl-10044000-10044117', 29],
    ['de-sl-10044000-10044111', 30],
    ['de-sl-10044000-10044118', 31],
    ['de-sl-10042000-10042115', 32],
    ['de-sl-10046000-10046117', 33],
    ['de-sl-10045000-10045114', 34],
    ['de-sl-10045000-10045115', 35],
    ['de-sl-10042000-10042114', 36],
    ['de-sl-10045000-10045116', 37],
    ['de-sl-10041000-10041519', 38],
    ['de-sl-10046000-10046112', 39],
    ['de-sl-10044000-10044121', 40],
    ['de-sl-10042000-10042117', 41],
    ['de-sl-10041000-10041514', 42],
    ['de-sl-10046000-10046111', 43],
    ['de-sl-10045000-10045113', 44],
    ['de-sl-10046000-10046115', 45],
    ['de-sl-10044000-10044119', 46],
    ['de-sl-10043000-10043113', 47],
    ['de-sl-10042000-10042116', 48],
    ['de-sl-10046000-10046116', 49],
    ['de-sl-10043000-10043116', 50],
    ['de-sl-10041000-10041517', 51],
    ['undefined', 52]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-sl-all-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-sl-all-all.js">Saarland</a>'
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
