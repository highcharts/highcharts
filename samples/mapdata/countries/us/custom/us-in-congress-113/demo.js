$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-in-08",
            "value": 0
        },
        {
            "hc-key": "us-in-02",
            "value": 1
        },
        {
            "hc-key": "us-in-05",
            "value": 2
        },
        {
            "hc-key": "us-in-09",
            "value": 3
        },
        {
            "hc-key": "us-in-03",
            "value": 4
        },
        {
            "hc-key": "us-in-07",
            "value": 5
        },
        {
            "hc-key": "us-in-06",
            "value": 6
        },
        {
            "hc-key": "us-in-04",
            "value": 7
        },
        {
            "hc-key": "us-in-01",
            "value": 8
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-in-congress-113.js">Indiana congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-in-congress-113'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
