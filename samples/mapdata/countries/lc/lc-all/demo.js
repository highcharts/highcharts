$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "lc-6591",
            "value": 0
        },
        {
            "hc-key": "lc-6585",
            "value": 1
        },
        {
            "hc-key": "lc-6586",
            "value": 2
        },
        {
            "hc-key": "lc-3607",
            "value": 3
        },
        {
            "hc-key": "lc-6590",
            "value": 4
        },
        {
            "hc-key": "lc-6588",
            "value": 5
        },
        {
            "hc-key": "lc-6587",
            "value": 6
        },
        {
            "hc-key": "lc-6592",
            "value": 7
        },
        {
            "hc-key": "lc-6589",
            "value": 8
        },
        {
            "hc-key": "lc-6593",
            "value": 9
        },
        {
            "hc-key": "lc-6594",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/lc/lc-all.js">Saint Lucia</a>'
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

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/lc/lc-all'],
            joinBy: 'hc-key',
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
});
