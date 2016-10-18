$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-va-1004",
            "value": 0
        },
        {
            "hc-key": "no-va-1001",
            "value": 1
        },
        {
            "hc-key": "no-va-1014",
            "value": 2
        },
        {
            "hc-key": "no-va-1032",
            "value": 3
        },
        {
            "hc-key": "no-va-1037",
            "value": 4
        },
        {
            "hc-key": "no-va-1046",
            "value": 5
        },
        {
            "hc-key": "no-va-1034",
            "value": 6
        },
        {
            "hc-key": "no-va-1003",
            "value": 7
        },
        {
            "hc-key": "no-va-1027",
            "value": 8
        },
        {
            "hc-key": "no-va-1026",
            "value": 9
        },
        {
            "hc-key": "no-va-1021",
            "value": 10
        },
        {
            "hc-key": "no-va-1018",
            "value": 11
        },
        {
            "hc-key": "no-va-1002",
            "value": 12
        },
        {
            "hc-key": "no-va-1017",
            "value": 13
        },
        {
            "hc-key": "no-va-1029",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-va-all.js">Vest-Agder</a>'
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
            mapData: Highcharts.maps['countries/no/no-va-all'],
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
