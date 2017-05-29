// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['hu-no', 0],
    ['hu-bz', 1],
    ['hu-he', 2],
    ['hu-jn', 3],
    ['hu-bu', 4],
    ['hu-ed', 5],
    ['hu-sd', 6],
    ['hu-hv', 7],
    ['hu-st', 8],
    ['hu-mi', 9],
    ['hu-nk', 10],
    ['hu-so', 11],
    ['hu-du', 12],
    ['hu-bk', 13],
    ['hu-tb', 14],
    ['hu-fe', 15],
    ['hu-ke', 16],
    ['hu-pe', 17],
    ['hu-sk', 18],
    ['hu-sz', 19],
    ['hu-cs', 20],
    ['hu-be', 21],
    ['hu-hb', 22],
    ['hu-sn', 23],
    ['hu-va', 24],
    ['hu-sh', 25],
    ['hu-ba', 26],
    ['hu-gs', 27],
    ['hu-to', 28],
    ['hu-za', 29],
    ['hu-ze', 30],
    ['hu-ss', 31],
    ['hu-mc', 32],
    ['hu-ny', 33],
    ['hu-de', 34],
    ['hu-eg', 35],
    ['hu-gy', 36],
    ['hu-ps', 37],
    ['hu-sf', 38],
    ['hu-vm', 39],
    ['hu-ve', 40],
    ['hu-kv', 41],
    ['hu-km', 42]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/hu/hu-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/hu/hu-all.js">Hungary</a>'
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
