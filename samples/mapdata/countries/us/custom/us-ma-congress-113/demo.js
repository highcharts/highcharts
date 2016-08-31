$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ma-09",
            "value": 0
        },
        {
            "hc-key": "us-ma-03",
            "value": 1
        },
        {
            "hc-key": "us-ma-05",
            "value": 2
        },
        {
            "hc-key": "us-ma-02",
            "value": 3
        },
        {
            "hc-key": "us-ma-04",
            "value": 4
        },
        {
            "hc-key": "us-ma-07",
            "value": 5
        },
        {
            "hc-key": "us-ma-06",
            "value": 6
        },
        {
            "hc-key": "us-ma-08",
            "value": 7
        },
        {
            "hc-key": "us-ma-01",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-ma-congress-113.js">Massachusetts congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-ma-congress-113'],
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
