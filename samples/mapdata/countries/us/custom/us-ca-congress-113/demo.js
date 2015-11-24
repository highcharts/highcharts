$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ca-26",
            "value": 0
        },
        {
            "hc-key": "us-ca-24",
            "value": 1
        },
        {
            "hc-key": "us-ca-47",
            "value": 2
        },
        {
            "hc-key": "us-ca-14",
            "value": 3
        },
        {
            "hc-key": "us-ca-51",
            "value": 4
        },
        {
            "hc-key": "us-ca-28",
            "value": 5
        },
        {
            "hc-key": "us-ca-33",
            "value": 6
        },
        {
            "hc-key": "us-ca-36",
            "value": 7
        },
        {
            "hc-key": "us-ca-31",
            "value": 8
        },
        {
            "hc-key": "us-ca-45",
            "value": 9
        },
        {
            "hc-key": "us-ca-48",
            "value": 10
        },
        {
            "hc-key": "us-ca-46",
            "value": 11
        },
        {
            "hc-key": "us-ca-34",
            "value": 12
        },
        {
            "hc-key": "us-ca-40",
            "value": 13
        },
        {
            "hc-key": "us-ca-30",
            "value": 14
        },
        {
            "hc-key": "us-ca-12",
            "value": 15
        },
        {
            "hc-key": "us-ca-18",
            "value": 16
        },
        {
            "hc-key": "us-ca-13",
            "value": 17
        },
        {
            "hc-key": "us-ca-20",
            "value": 18
        },
        {
            "hc-key": "us-ca-16",
            "value": 19
        },
        {
            "hc-key": "us-ca-37",
            "value": 20
        },
        {
            "hc-key": "us-ca-43",
            "value": 21
        },
        {
            "hc-key": "us-ca-32",
            "value": 22
        },
        {
            "hc-key": "us-ca-35",
            "value": 23
        },
        {
            "hc-key": "us-ca-42",
            "value": 24
        },
        {
            "hc-key": "us-ca-44",
            "value": 25
        },
        {
            "hc-key": "us-ca-09",
            "value": 26
        },
        {
            "hc-key": "us-ca-15",
            "value": 27
        },
        {
            "hc-key": "us-ca-10",
            "value": 28
        },
        {
            "hc-key": "us-ca-41",
            "value": 29
        },
        {
            "hc-key": "us-ca-08",
            "value": 30
        },
        {
            "hc-key": "us-ca-27",
            "value": 31
        },
        {
            "hc-key": "us-ca-17",
            "value": 32
        },
        {
            "hc-key": "us-ca-53",
            "value": 33
        },
        {
            "hc-key": "us-ca-52",
            "value": 34
        },
        {
            "hc-key": "us-ca-49",
            "value": 35
        },
        {
            "hc-key": "us-ca-25",
            "value": 36
        },
        {
            "hc-key": "us-ca-07",
            "value": 37
        },
        {
            "hc-key": "us-ca-06",
            "value": 38
        },
        {
            "hc-key": "us-ca-04",
            "value": 39
        },
        {
            "hc-key": "us-ca-39",
            "value": 40
        },
        {
            "hc-key": "us-ca-38",
            "value": 41
        },
        {
            "hc-key": "us-ca-05",
            "value": 42
        },
        {
            "hc-key": "us-ca-02",
            "value": 43
        },
        {
            "hc-key": "us-ca-11",
            "value": 44
        },
        {
            "hc-key": "us-ca-03",
            "value": 45
        },
        {
            "hc-key": "us-ca-23",
            "value": 46
        },
        {
            "hc-key": "us-ca-50",
            "value": 47
        },
        {
            "hc-key": "us-ca-01",
            "value": 48
        },
        {
            "hc-key": "us-ca-21",
            "value": 49
        },
        {
            "hc-key": "us-ca-22",
            "value": 50
        },
        {
            "hc-key": "us-ca-19",
            "value": 51
        },
        {
            "hc-key": "us-ca-29",
            "value": 52
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-ca-congress-113.js">California congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-ca-congress-113'],
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
