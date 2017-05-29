// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ag-6313', 0],
    ['ag-6598', 1],
    ['ag-6599', 2],
    ['ag-6600', 3],
    ['ag-6601', 4],
    ['ag-6602', 5],
    ['ag-6603', 6],
    ['ag-6604', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ag/ag-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ag/ag-all.js">Antigua and Barbuda</a>'
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
