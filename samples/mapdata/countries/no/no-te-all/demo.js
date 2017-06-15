// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-te-830', 0],
    ['no-te-827', 1],
    ['no-te-826', 2],
    ['no-te-814', 3],
    ['no-te-815', 4],
    ['no-te-817', 5],
    ['no-te-831', 6],
    ['no-te-807', 7],
    ['no-te-821', 8],
    ['no-te-805', 9],
    ['no-te-834', 10],
    ['no-te-811', 11],
    ['no-te-829', 12],
    ['no-te-828', 13],
    ['no-te-822', 14],
    ['no-te-819', 15],
    ['no-te-806', 16],
    ['no-te-833', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-te-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-te-all.js">Telemark</a>'
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
