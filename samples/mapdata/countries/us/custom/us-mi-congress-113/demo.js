$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-mi-01",
            "value": 0
        },
        {
            "hc-key": "us-mi-12",
            "value": 1
        },
        {
            "hc-key": "us-mi-14",
            "value": 2
        },
        {
            "hc-key": "us-mi-13",
            "value": 3
        },
        {
            "hc-key": "us-mi-10",
            "value": 4
        },
        {
            "hc-key": "us-mi-05",
            "value": 5
        },
        {
            "hc-key": "us-mi-11",
            "value": 6
        },
        {
            "hc-key": "us-mi-09",
            "value": 7
        },
        {
            "hc-key": "us-mi-07",
            "value": 8
        },
        {
            "hc-key": "us-mi-08",
            "value": 9
        },
        {
            "hc-key": "us-mi-02",
            "value": 10
        },
        {
            "hc-key": "us-mi-03",
            "value": 11
        },
        {
            "hc-key": "us-mi-06",
            "value": 12
        },
        {
            "hc-key": "us-mi-04",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-mi-congress-113.js">Michigan congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-mi-congress-113'],
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
