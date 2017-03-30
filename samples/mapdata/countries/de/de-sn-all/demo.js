// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-sn-14522000', 0],
    ['de-sn-14511000', 1],
    ['de-sn-14626000', 2],
    ['de-sn-14521000', 3],
    ['de-sn-14523000', 4],
    ['de-sn-14524000', 5],
    ['de-sn-14729000', 6],
    ['de-sn-14612000', 7],
    ['de-sn-14627000', 8],
    ['de-sn-14628000', 9],
    ['de-sn-14625000', 10],
    ['de-sn-14713000', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-sn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-sn-all.js">Sachsen</a>'
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
