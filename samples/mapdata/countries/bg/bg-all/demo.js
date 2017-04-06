// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bg-vt', 0],
    ['bg-mt', 1],
    ['bg-vr', 2],
    ['bg-ky', 3],
    ['bg-vd', 4],
    ['bg-br', 5],
    ['bg-ya', 6],
    ['bg-tu', 7],
    ['bg-rg', 8],
    ['bg-sh', 9],
    ['bg-do', 10],
    ['bg-vn', 11],
    ['bg-si', 12],
    ['bg-rs', 13],
    ['bg-bl', 14],
    ['bg-sl', 15],
    ['bg-sz', 16],
    ['bg-kk', 17],
    ['bg-pd', 18],
    ['bg-pz', 19],
    ['bg-sm', 20],
    ['bg-kz', 21],
    ['bg-sf', 22],
    ['bg-sg', 23],
    ['bg-pn', 24],
    ['bg-gb', 25],
    ['bg-lv', 26],
    ['bg-pv', 27]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bg/bg-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bg/bg-all.js">Bulgaria</a>'
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
