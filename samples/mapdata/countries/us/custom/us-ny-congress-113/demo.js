$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ny-11",
            "value": 0
        },
        {
            "hc-key": "us-ny-21",
            "value": 1
        },
        {
            "hc-key": "us-ny-01",
            "value": 2
        },
        {
            "hc-key": "us-ny-07",
            "value": 3
        },
        {
            "hc-key": "us-ny-05",
            "value": 4
        },
        {
            "hc-key": "us-ny-24",
            "value": 5
        },
        {
            "hc-key": "us-ny-16",
            "value": 6
        },
        {
            "hc-key": "us-ny-17",
            "value": 7
        },
        {
            "hc-key": "us-ny-15",
            "value": 8
        },
        {
            "hc-key": "us-ny-23",
            "value": 9
        },
        {
            "hc-key": "us-ny-08",
            "value": 10
        },
        {
            "hc-key": "us-ny-12",
            "value": 11
        },
        {
            "hc-key": "us-ny-18",
            "value": 12
        },
        {
            "hc-key": "us-ny-02",
            "value": 13
        },
        {
            "hc-key": "us-ny-10",
            "value": 14
        },
        {
            "hc-key": "us-ny-25",
            "value": 15
        },
        {
            "hc-key": "us-ny-04",
            "value": 16
        },
        {
            "hc-key": "us-ny-13",
            "value": 17
        },
        {
            "hc-key": "us-ny-09",
            "value": 18
        },
        {
            "hc-key": "us-ny-19",
            "value": 19
        },
        {
            "hc-key": "us-ny-20",
            "value": 20
        },
        {
            "hc-key": "us-ny-22",
            "value": 21
        },
        {
            "hc-key": "us-ny-03",
            "value": 22
        },
        {
            "hc-key": "us-ny-26",
            "value": 23
        },
        {
            "hc-key": "us-ny-27",
            "value": 24
        },
        {
            "hc-key": "us-ny-14",
            "value": 25
        },
        {
            "hc-key": "us-ny-06",
            "value": 26
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-ny-congress-113.js">New York congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-ny-congress-113'],
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
