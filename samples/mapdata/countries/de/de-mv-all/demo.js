// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-mv-13075000', 0],
    ['de-mv-13004000', 1],
    ['de-mv-13073000', 2],
    ['de-mv-13076000', 3],
    ['de-mv-13072000', 4],
    ['de-mv-13074000', 5],
    ['de-mv-13071000', 6],
    ['de-mv-13003000', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-mv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-mv-all.js">Mecklenburg-Vorpommern</a>'
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
