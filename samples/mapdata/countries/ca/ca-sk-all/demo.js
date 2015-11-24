$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-sk-4711",
            "value": 0
        },
        {
            "hc-key": "ca-sk-4708",
            "value": 1
        },
        {
            "hc-key": "ca-sk-4706",
            "value": 2
        },
        {
            "hc-key": "ca-sk-4707",
            "value": 3
        },
        {
            "hc-key": "ca-sk-4705",
            "value": 4
        },
        {
            "hc-key": "ca-sk-4714",
            "value": 5
        },
        {
            "hc-key": "ca-sk-4704",
            "value": 6
        },
        {
            "hc-key": "ca-sk-4715",
            "value": 7
        },
        {
            "hc-key": "ca-sk-4703",
            "value": 8
        },
        {
            "hc-key": "ca-sk-4702",
            "value": 9
        },
        {
            "hc-key": "ca-sk-4716",
            "value": 10
        },
        {
            "hc-key": "ca-sk-4701",
            "value": 11
        },
        {
            "hc-key": "ca-sk-4717",
            "value": 12
        },
        {
            "hc-key": "ca-sk-4710",
            "value": 13
        },
        {
            "hc-key": "ca-sk-4712",
            "value": 14
        },
        {
            "hc-key": "ca-sk-4713",
            "value": 15
        },
        {
            "hc-key": "ca-sk-4718",
            "value": 16
        },
        {
            "hc-key": "ca-sk-4709",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-sk-all.js">Saskatchewan</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-sk-all'],
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
