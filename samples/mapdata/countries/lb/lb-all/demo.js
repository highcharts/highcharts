$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "lb-bi",
            "value": 0
        },
        {
            "hc-key": "lb-as",
            "value": 1
        },
        {
            "hc-key": "lb-ba",
            "value": 2
        },
        {
            "hc-key": "lb-jl",
            "value": 3
        },
        {
            "hc-key": "lb-na",
            "value": 4
        },
        {
            "hc-key": "lb-ja",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lb/lb-all.js">Lebanon</a>'
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
            mapData: Highcharts.maps['countries/lb/lb-all'],
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
