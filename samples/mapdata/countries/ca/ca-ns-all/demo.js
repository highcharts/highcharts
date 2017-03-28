// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-ns-1217', 0],
    ['ca-ns-1201', 1],
    ['ca-ns-1209', 2],
    ['ca-ns-1218', 3],
    ['ca-ns-1203', 4],
    ['ca-ns-1206', 5],
    ['ca-ns-1202', 6],
    ['ca-ns-1212', 7],
    ['ca-ns-1216', 8],
    ['ca-ns-1214', 9],
    ['ca-ns-1210', 10],
    ['ca-ns-1213', 11],
    ['ca-ns-1208', 12],
    ['ca-ns-1205', 13],
    ['ca-ns-1215', 14],
    ['ca-ns-1207', 15],
    ['ca-ns-1204', 16],
    ['ca-ns-1211', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-ns-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-ns-all.js">Nova Scotia</a>'
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
