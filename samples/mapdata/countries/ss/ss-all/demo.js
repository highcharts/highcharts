// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ss-we', 0],
    ['ss-619', 1],
    ['ss-un', 2],
    ['ss-jg', 3],
    ['ss-wh', 4],
    ['ss-wr', 5],
    ['ss-wb', 6],
    ['ss-ee', 7],
    ['ss-nb', 8],
    ['ss-eb', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ss/ss-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ss/ss-all.js">South Sudan</a>'
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
