// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ao-na', 0],
    ['ao-cb', 1],
    ['ao-ln', 2],
    ['ao-ls', 3],
    ['ao-ml', 4],
    ['ao-bo', 5],
    ['ao-cn', 6],
    ['ao-cs', 7],
    ['ao-lu', 8],
    ['ao-ui', 9],
    ['ao-za', 10],
    ['ao-bi', 11],
    ['ao-bg', 12],
    ['ao-cc', 13],
    ['ao-cu', 14],
    ['ao-hm', 15],
    ['ao-hl', 16],
    ['ao-mx', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ao/ao-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ao/ao-all.js">Angola</a>'
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
