$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sb-4191",
            "value": 0
        },
        {
            "hc-key": "sb-ml",
            "value": 1
        },
        {
            "hc-key": "sb-rb",
            "value": 2
        },
        {
            "hc-key": "sb-1014",
            "value": 3
        },
        {
            "hc-key": "sb-is",
            "value": 4
        },
        {
            "hc-key": "sb-te",
            "value": 5
        },
        {
            "hc-key": "sb-3343",
            "value": 6
        },
        {
            "hc-key": "sb-ch",
            "value": 7
        },
        {
            "hc-key": "sb-mk",
            "value": 8
        },
        {
            "hc-key": "sb-6633",
            "value": 9
        },
        {
            "hc-key": "sb-gc",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sb/sb-all.js">Solomon Islands</a>'
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
            mapData: Highcharts.maps['countries/sb/sb-all'],
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
