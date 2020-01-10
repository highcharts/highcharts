// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-vl-4625', 0],
    ['no-vl-4633', 1],
    ['no-vl-4645', 2],
    ['no-vl-4611', 3],
    ['no-vl-4612', 4],
    ['no-vl-4650', 5],
    ['no-vl-4615', 6],
    ['no-vl-4613', 7],
    ['no-vl-4617', 8],
    ['no-vl-4616', 9],
    ['no-vl-4619', 10],
    ['no-vl-4620', 11],
    ['no-vl-4622', 12],
    ['no-vl-4624', 13],
    ['no-vl-4623', 14],
    ['no-vl-4634', 15],
    ['no-vl-4614', 16],
    ['no-vl-4639', 17],
    ['no-vl-4641', 18],
    ['no-vl-4630', 19],
    ['no-vl-4621', 20],
    ['no-vl-4631', 21],
    ['no-vl-4626', 22],
    ['no-vl-4636', 23],
    ['no-vl-4637', 24],
    ['no-vl-4618', 25],
    ['no-vl-4629', 26],
    ['no-vl-4627', 27],
    ['no-vl-4649', 28],
    ['no-vl-4602', 29],
    ['no-vl-4646', 30],
    ['no-vl-4647', 31],
    ['no-vl-4640', 32],
    ['no-vl-4642', 33],
    ['no-vl-4644', 34],
    ['no-vl-4643', 35],
    ['no-vl-4628', 36],
    ['no-vl-4601', 37],
    ['no-vl-4651', 38],
    ['no-vl-4648', 39],
    ['no-vl-4632', 40],
    ['no-vl-4638', 41],
    ['no-vl-4635', 42]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-vl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vl-all.js">Vestland</a>'
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
