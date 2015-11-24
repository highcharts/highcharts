$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-fl-16",
            "value": 0
        },
        {
            "hc-key": "us-fl-26",
            "value": 1
        },
        {
            "hc-key": "us-fl-02",
            "value": 2
        },
        {
            "hc-key": "us-fl-25",
            "value": 3
        },
        {
            "hc-key": "us-fl-19",
            "value": 4
        },
        {
            "hc-key": "us-fl-27",
            "value": 5
        },
        {
            "hc-key": "us-fl-14",
            "value": 6
        },
        {
            "hc-key": "us-fl-13",
            "value": 7
        },
        {
            "hc-key": "us-fl-24",
            "value": 8
        },
        {
            "hc-key": "us-fl-11",
            "value": 9
        },
        {
            "hc-key": "us-fl-15",
            "value": 10
        },
        {
            "hc-key": "us-fl-12",
            "value": 11
        },
        {
            "hc-key": "us-fl-20",
            "value": 12
        },
        {
            "hc-key": "us-fl-18",
            "value": 13
        },
        {
            "hc-key": "us-fl-22",
            "value": 14
        },
        {
            "hc-key": "us-fl-06",
            "value": 15
        },
        {
            "hc-key": "us-fl-08",
            "value": 16
        },
        {
            "hc-key": "us-fl-17",
            "value": 17
        },
        {
            "hc-key": "us-fl-09",
            "value": 18
        },
        {
            "hc-key": "us-fl-10",
            "value": 19
        },
        {
            "hc-key": "us-fl-07",
            "value": 20
        },
        {
            "hc-key": "us-fl-23",
            "value": 21
        },
        {
            "hc-key": "us-fl-03",
            "value": 22
        },
        {
            "hc-key": "us-fl-05",
            "value": 23
        },
        {
            "hc-key": "us-fl-04",
            "value": 24
        },
        {
            "hc-key": "us-fl-01",
            "value": 25
        },
        {
            "hc-key": "us-fl-21",
            "value": 26
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-fl-congress-113.js">Florida congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-fl-congress-113'],
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
