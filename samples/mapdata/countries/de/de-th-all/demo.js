// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-th-16062000', 0],
    ['de-th-16055000', 1],
    ['de-th-16064000', 2],
    ['de-th-16054000', 3],
    ['de-th-16070000', 4],
    ['de-th-16051000', 5],
    ['de-th-16071000', 6],
    ['de-th-16074000', 7],
    ['de-th-16052000', 8],
    ['de-th-16056000', 9],
    ['de-th-16075000', 10],
    ['de-th-16069000', 11],
    ['de-th-16068000', 12],
    ['de-th-16067000', 13],
    ['de-th-16053000', 14],
    ['de-th-16076000', 15],
    ['de-th-16065000', 16],
    ['de-th-16073000', 17],
    ['de-th-16061000', 18],
    ['de-th-16077000', 19],
    ['de-th-16063000', 20],
    ['de-th-16072000', 21],
    ['de-th-16066000', 22]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-th-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-th-all.js">Thüringen</a>'
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
