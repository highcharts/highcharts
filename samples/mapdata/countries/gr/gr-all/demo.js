$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gr-as",
            "value": 0
        },
        {
            "hc-key": "gr-ii",
            "value": 1
        },
        {
            "hc-key": "gr-at",
            "value": 2
        },
        {
            "hc-key": "gr-pp",
            "value": 3
        },
        {
            "hc-key": "gr-ts",
            "value": 4
        },
        {
            "hc-key": "gr-an",
            "value": 5
        },
        {
            "hc-key": "gr-gc",
            "value": 6
        },
        {
            "hc-key": "gr-cr",
            "value": 7
        },
        {
            "hc-key": "gr-mc",
            "value": 8
        },
        {
            "hc-key": "gr-ma",
            "value": 9
        },
        {
            "hc-key": "gr-mt",
            "value": 10
        },
        {
            "hc-key": "gr-gw",
            "value": 11
        },
        {
            "hc-key": "gr-mw",
            "value": 12
        },
        {
            "hc-key": "gr-ep",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gr/gr-all.js">Greece</a>'
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
            mapData: Highcharts.maps['countries/gr/gr-all'],
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
