// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sa-4293', 0],
    ['sa-tb', 1],
    ['sa-jz', 2],
    ['sa-nj', 3],
    ['sa-ri', 4],
    ['sa-md', 5],
    ['sa-ha', 6],
    ['sa-qs', 7],
    ['sa-hs', 8],
    ['sa-jf', 9],
    ['sa-sh', 10],
    ['sa-ba', 11],
    ['sa-as', 12],
    ['sa-mk', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sa/sa-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sa/sa-all.js">Saudi Arabia</a>'
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
