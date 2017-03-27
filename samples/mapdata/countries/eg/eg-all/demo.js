// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['eg-5847', 0],
    ['eg-ba', 1],
    ['eg-js', 2],
    ['eg-uq', 3],
    ['eg-is', 4],
    ['eg-gh', 5],
    ['eg-mf', 6],
    ['eg-qh', 7],
    ['eg-ql', 8],
    ['eg-sq', 9],
    ['eg-ss', 10],
    ['eg-sw', 11],
    ['eg-dq', 12],
    ['eg-bs', 13],
    ['eg-dt', 14],
    ['eg-bh', 15],
    ['eg-mt', 16],
    ['eg-ik', 17],
    ['eg-jz', 18],
    ['eg-fy', 19],
    ['eg-wj', 20],
    ['eg-mn', 21],
    ['eg-bn', 22],
    ['eg-ks', 23],
    ['eg-at', 24],
    ['eg-an', 25],
    ['eg-qn', 26],
    ['eg-sj', 27]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/eg/eg-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/eg/eg-all.js">Egypt</a>'
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
