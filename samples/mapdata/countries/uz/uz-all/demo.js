// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['uz-fa', 0],
    ['uz-tk', 1],
    ['uz-an', 2],
    ['uz-ng', 3],
    ['uz-ji', 4],
    ['uz-si', 5],
    ['uz-ta', 6],
    ['uz-bu', 7],
    ['uz-kh', 8],
    ['uz-qr', 9],
    ['uz-nw', 10],
    ['uz-sa', 11],
    ['uz-qa', 12],
    ['uz-su', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/uz/uz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/uz/uz-all.js">Uzbekistan</a>'
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
