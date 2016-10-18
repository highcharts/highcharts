$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-wa-07",
            "value": 0
        },
        {
            "hc-key": "us-wa-02",
            "value": 1
        },
        {
            "hc-key": "us-wa-01",
            "value": 2
        },
        {
            "hc-key": "us-wa-03",
            "value": 3
        },
        {
            "hc-key": "us-wa-06",
            "value": 4
        },
        {
            "hc-key": "us-wa-10",
            "value": 5
        },
        {
            "hc-key": "us-wa-05",
            "value": 6
        },
        {
            "hc-key": "us-wa-09",
            "value": 7
        },
        {
            "hc-key": "us-wa-08",
            "value": 8
        },
        {
            "hc-key": "us-wa-04",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-wa-congress-113.js">Washington congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-wa-congress-113'],
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
