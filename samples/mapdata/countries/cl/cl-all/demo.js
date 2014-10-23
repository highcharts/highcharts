$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cl-2730",
            "value": 0
        },
        {
            "hc-key": "cl-ll",
            "value": 1
        },
        {
            "hc-key": "cl-li",
            "value": 2
        },
        {
            "hc-key": "cl-ai",
            "value": 3
        },
        {
            "hc-key": "cl-ma",
            "value": 4
        },
        {
            "hc-key": "cl-vs",
            "value": 5
        },
        {
            "hc-key": "cl-at",
            "value": 6
        },
        {
            "hc-key": "cl-co",
            "value": 7
        },
        {
            "hc-key": "cl-bi",
            "value": 8
        },
        {
            "hc-key": "cl-rm",
            "value": 9
        },
        {
            "hc-key": "cl-ar",
            "value": 10
        },
        {
            "hc-key": "cl-ml",
            "value": 11
        },
        {
            "hc-key": "cl-ta",
            "value": 12
        },
        {
            "hc-key": "cl-2740",
            "value": 13
        },
        {
            "hc-key": "cl-an",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cl/cl-all.js">Chile</a>'
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
            mapData: Highcharts.maps['countries/cl/cl-all'],
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
