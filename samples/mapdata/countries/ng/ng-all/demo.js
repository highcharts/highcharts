// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ng-ri', 0],
    ['ng-kt', 1],
    ['ng-so', 2],
    ['ng-za', 3],
    ['ng-yo', 4],
    ['ng-ke', 5],
    ['ng-ad', 6],
    ['ng-bo', 7],
    ['ng-ak', 8],
    ['ng-ab', 9],
    ['ng-im', 10],
    ['ng-by', 11],
    ['ng-be', 12],
    ['ng-cr', 13],
    ['ng-ta', 14],
    ['ng-kw', 15],
    ['ng-la', 16],
    ['ng-ni', 17],
    ['ng-fc', 18],
    ['ng-og', 19],
    ['ng-on', 20],
    ['ng-ek', 21],
    ['ng-os', 22],
    ['ng-oy', 23],
    ['ng-an', 24],
    ['ng-ba', 25],
    ['ng-go', 26],
    ['ng-de', 27],
    ['ng-ed', 28],
    ['ng-en', 29],
    ['ng-eb', 30],
    ['ng-kd', 31],
    ['ng-ko', 32],
    ['ng-pl', 33],
    ['ng-na', 34],
    ['ng-ji', 35],
    ['ng-kn', 36]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ng/ng-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ng/ng-all.js">Nigeria</a>'
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
