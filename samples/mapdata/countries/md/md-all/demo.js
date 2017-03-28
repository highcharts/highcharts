// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['md-rz', 0],
    ['md-2266', 1],
    ['md-te', 2],
    ['md-2267', 3],
    ['md-cu', 4],
    ['md-bd', 5],
    ['md-sv', 6],
    ['md-sd', 7],
    ['md-so', 8],
    ['md-do', 9],
    ['md-ed', 10],
    ['md-br', 11],
    ['md-oc', 12],
    ['md-rs', 13],
    ['md-bt', 14],
    ['md-dr', 15],
    ['md-fa', 16],
    ['md-gl', 17],
    ['md-si', 18],
    ['md-ug', 19],
    ['md-ch', 20],
    ['md-ta', 21],
    ['md-ga', 22],
    ['md-st', 23],
    ['md-cv', 24],
    ['md-an', 25],
    ['md-ba', 26],
    ['md-cn', 27],
    ['md-ca', 28],
    ['md-cs', 29],
    ['md-cr', 30],
    ['md-1605', 31],
    ['md-fl', 32],
    ['md-du', 33],
    ['md-db', 34],
    ['md-hi', 35],
    ['md-ia', 36],
    ['md-le', 37],
    ['md-ni', 38],
    ['md-oh', 39]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/md/md-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/md/md-all.js">Moldova</a>'
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
