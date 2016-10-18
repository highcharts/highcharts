$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-tx-34",
            "value": 0
        },
        {
            "hc-key": "us-tx-14",
            "value": 1
        },
        {
            "hc-key": "us-tx-27",
            "value": 2
        },
        {
            "hc-key": "us-tx-20",
            "value": 3
        },
        {
            "hc-key": "us-tx-21",
            "value": 4
        },
        {
            "hc-key": "us-tx-32",
            "value": 5
        },
        {
            "hc-key": "us-tx-03",
            "value": 6
        },
        {
            "hc-key": "us-tx-31",
            "value": 7
        },
        {
            "hc-key": "us-tx-10",
            "value": 8
        },
        {
            "hc-key": "us-tx-04",
            "value": 9
        },
        {
            "hc-key": "us-tx-36",
            "value": 10
        },
        {
            "hc-key": "us-tx-25",
            "value": 11
        },
        {
            "hc-key": "us-tx-35",
            "value": 12
        },
        {
            "hc-key": "us-tx-28",
            "value": 13
        },
        {
            "hc-key": "us-tx-23",
            "value": 14
        },
        {
            "hc-key": "us-tx-11",
            "value": 15
        },
        {
            "hc-key": "us-tx-13",
            "value": 16
        },
        {
            "hc-key": "us-tx-26",
            "value": 17
        },
        {
            "hc-key": "us-tx-07",
            "value": 18
        },
        {
            "hc-key": "us-tx-05",
            "value": 19
        },
        {
            "hc-key": "us-tx-22",
            "value": 20
        },
        {
            "hc-key": "us-tx-09",
            "value": 21
        },
        {
            "hc-key": "us-tx-18",
            "value": 22
        },
        {
            "hc-key": "us-tx-19",
            "value": 23
        },
        {
            "hc-key": "us-tx-06",
            "value": 24
        },
        {
            "hc-key": "us-tx-17",
            "value": 25
        },
        {
            "hc-key": "us-tx-16",
            "value": 26
        },
        {
            "hc-key": "us-tx-01",
            "value": 27
        },
        {
            "hc-key": "us-tx-33",
            "value": 28
        },
        {
            "hc-key": "us-tx-15",
            "value": 29
        },
        {
            "hc-key": "us-tx-12",
            "value": 30
        },
        {
            "hc-key": "us-tx-24",
            "value": 31
        },
        {
            "hc-key": "us-tx-30",
            "value": 32
        },
        {
            "hc-key": "us-tx-08",
            "value": 33
        },
        {
            "hc-key": "us-tx-02",
            "value": 34
        },
        {
            "hc-key": "us-tx-29",
            "value": 35
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-tx-congress-113.js">Texas congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-tx-congress-113'],
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
