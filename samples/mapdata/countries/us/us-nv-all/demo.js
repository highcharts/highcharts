// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nv-005', 0],
    ['us-nv-013', 1],
    ['us-nv-021', 2],
    ['us-nv-023', 3],
    ['us-nv-011', 4],
    ['us-nv-017', 5],
    ['us-nv-003', 6],
    ['us-nv-015', 7],
    ['us-nv-027', 8],
    ['us-nv-007', 9],
    ['us-nv-510', 10],
    ['us-nv-019', 11],
    ['us-nv-029', 12],
    ['us-nv-033', 13],
    ['us-nv-009', 14],
    ['us-nv-031', 15],
    ['us-nv-001', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-nv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nv-all.js">Nevada</a>'
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
