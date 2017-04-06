// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-sl-10042000', 0],
    ['de-sl-10043000', 1],
    ['de-sl-10044000', 2],
    ['de-sl-10041000', 3],
    ['de-sl-10045000', 4],
    ['de-sl-10046000', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-sl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-sl-all.js">Saarland</a>'
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
