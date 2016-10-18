$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ls-be",
            "value": 0
        },
        {
            "hc-key": "ls-ms",
            "value": 1
        },
        {
            "hc-key": "ls-mh",
            "value": 2
        },
        {
            "hc-key": "ls-qt",
            "value": 3
        },
        {
            "hc-key": "ls-le",
            "value": 4
        },
        {
            "hc-key": "ls-bb",
            "value": 5
        },
        {
            "hc-key": "ls-mk",
            "value": 6
        },
        {
            "hc-key": "ls-qn",
            "value": 7
        },
        {
            "hc-key": "ls-tt",
            "value": 8
        },
        {
            "hc-key": "ls-mf",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ls/ls-all.js">Lesotho</a>'
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
            mapData: Highcharts.maps['countries/ls/ls-all'],
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
