// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['vu-tr', 0],
    ['vu-sn', 1],
    ['vu-tf', 2],
    ['vu-ml', 3],
    ['vu-pm', 4],
    ['vu-se', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/vu/vu-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/vu/vu-all.js">Vanuatu</a>'
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
