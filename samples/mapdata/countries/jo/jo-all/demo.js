// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['jo-ma', 0],
    ['jo-ir', 1],
    ['jo-aj', 2],
    ['jo-ja', 3],
    ['jo-ba', 4],
    ['jo-md', 5],
    ['jo-ka', 6],
    ['jo-az', 7],
    ['jo-aq', 8],
    ['jo-mn', 9],
    ['jo-am', 10],
    ['jo-at', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/jo/jo-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/jo/jo-all.js">Jordan</a>'
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
