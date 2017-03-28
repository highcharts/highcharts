// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['om-ss', 0],
    ['om-ja', 1],
    ['om-mu', 2],
    ['om-wu', 3],
    ['om-da', 4],
    ['om-za', 5],
    ['om-bn', 6],
    ['om-ma', 7],
    ['om-bu', 8],
    ['om-sh', 9],
    ['om-bs', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/om/om-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/om/om-all.js">Oman</a>'
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
