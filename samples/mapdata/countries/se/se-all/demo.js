// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['se-4461', 0],
    ['se-ka', 1],
    ['se-og', 2],
    ['se-nb', 3],
    ['se-vn', 4],
    ['se-vb', 5],
    ['se-gt', 6],
    ['se-st', 7],
    ['se-up', 8],
    ['se-bl', 9],
    ['se-vg', 10],
    ['se-ko', 11],
    ['se-gv', 12],
    ['se-jo', 13],
    ['se-kr', 14],
    ['se-or', 15],
    ['se-vm', 16],
    ['se-ha', 17],
    ['se-sd', 18],
    ['se-vr', 19],
    ['se-ja', 20],
    ['se-sn', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/se/se-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/se/se-all.js">Sweden</a>'
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
