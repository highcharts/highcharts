// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-st-15002000', 0],
    ['de-st-15001000', 1],
    ['de-st-15082000', 2],
    ['de-st-15090000', 3],
    ['de-st-15081000', 4],
    ['de-st-14730000', 5],
    ['de-st-15085000', 6],
    ['de-st-15086000', 7],
    ['de-st-15088000', 8],
    ['de-st-15089000', 9],
    ['de-st-15087000', 10],
    ['de-st-15083000', 11],
    ['de-st-15003000', 12],
    ['de-st-15084000', 13],
    ['de-st-15091000', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-st-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-st-all.js">Sachsen-Anhalt</a>'
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
