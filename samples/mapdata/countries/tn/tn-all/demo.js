// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tn-4431', 0],
    ['tn-sf', 1],
    ['tn-me', 2],
    ['tn-to', 3],
    ['tn-mn', 4],
    ['tn-bj', 5],
    ['tn-ba', 6],
    ['tn-bz', 7],
    ['tn-je', 8],
    ['tn-nb', 9],
    ['tn-tu', 10],
    ['tn-kf', 11],
    ['tn-ks', 12],
    ['tn-gb', 13],
    ['tn-gf', 14],
    ['tn-sz', 15],
    ['tn-sl', 16],
    ['tn-mh', 17],
    ['tn-ms', 18],
    ['tn-kr', 19],
    ['tn-ss', 20],
    ['tn-za', 21],
    ['tn-kb', 22],
    ['tn-ta', 23]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tn/tn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tn/tn-all.js">Tunisia</a>'
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
