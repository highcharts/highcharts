// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kg-gb', 0],
    ['kg-ba', 1],
    ['kg-834', 2],
    ['kg-yk', 3],
    ['kg-na', 4],
    ['kg-tl', 5],
    ['kg-os', 6],
    ['kg-da', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kg/kg-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kg/kg-all.js">Kyrgyzstan</a>'
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
