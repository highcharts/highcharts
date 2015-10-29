$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-il-12",
            "value": 0
        },
        {
            "hc-key": "us-il-01",
            "value": 1
        },
        {
            "hc-key": "us-il-11",
            "value": 2
        },
        {
            "hc-key": "us-il-04",
            "value": 3
        },
        {
            "hc-key": "us-il-07",
            "value": 4
        },
        {
            "hc-key": "us-il-05",
            "value": 5
        },
        {
            "hc-key": "us-il-08",
            "value": 6
        },
        {
            "hc-key": "us-il-09",
            "value": 7
        },
        {
            "hc-key": "us-il-02",
            "value": 8
        },
        {
            "hc-key": "us-il-18",
            "value": 9
        },
        {
            "hc-key": "us-il-15",
            "value": 10
        },
        {
            "hc-key": "us-il-16",
            "value": 11
        },
        {
            "hc-key": "us-il-14",
            "value": 12
        },
        {
            "hc-key": "us-il-13",
            "value": 13
        },
        {
            "hc-key": "us-il-17",
            "value": 14
        },
        {
            "hc-key": "us-il-06",
            "value": 15
        },
        {
            "hc-key": "us-il-03",
            "value": 16
        },
        {
            "hc-key": "us-il-10",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-il-congress-113.js">Illinois congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-il-congress-113'],
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
