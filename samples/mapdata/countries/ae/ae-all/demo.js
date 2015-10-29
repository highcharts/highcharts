$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ae-az",
            "value": 0
        },
        {
            "hc-key": "ae-du",
            "value": 1
        },
        {
            "hc-key": "ae-sh",
            "value": 2
        },
        {
            "hc-key": "ae-rk",
            "value": 3
        },
        {
            "hc-key": "ae-uq",
            "value": 4
        },
        {
            "hc-key": "ae-fu",
            "value": 5
        },
        {
            "hc-key": "ae-740",
            "value": 6
        },
        {
            "hc-key": "ae-aj",
            "value": 7
        },
        {
            "hc-key": "ae-742",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ae/ae-all.js">United Arab Emirates</a>'
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
            mapData: Highcharts.maps['countries/ae/ae-all'],
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
