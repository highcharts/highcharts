$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-bu-620",
            "value": 0
        },
        {
            "hc-key": "no-bu-617",
            "value": 1
        },
        {
            "hc-key": "no-bu-605",
            "value": 2
        },
        {
            "hc-key": "no-bu-615",
            "value": 3
        },
        {
            "hc-key": "no-bu-627",
            "value": 4
        },
        {
            "hc-key": "no-bu-604",
            "value": 5
        },
        {
            "hc-key": "no-bu-622",
            "value": 6
        },
        {
            "hc-key": "no-bu-623",
            "value": 7
        },
        {
            "hc-key": "no-bu-602",
            "value": 8
        },
        {
            "hc-key": "no-bu-621",
            "value": 9
        },
        {
            "hc-key": "no-bu-626",
            "value": 10
        },
        {
            "hc-key": "no-bu-612",
            "value": 11
        },
        {
            "hc-key": "no-bu-618",
            "value": 12
        },
        {
            "hc-key": "no-bu-624",
            "value": 13
        },
        {
            "hc-key": "no-bu-632",
            "value": 14
        },
        {
            "hc-key": "no-bu-628",
            "value": 15
        },
        {
            "hc-key": "no-bu-631",
            "value": 16
        },
        {
            "hc-key": "no-bu-633",
            "value": 17
        },
        {
            "hc-key": "no-bu-616",
            "value": 18
        },
        {
            "hc-key": "no-bu-619",
            "value": 19
        },
        {
            "hc-key": "no-bu-625",
            "value": 20
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-bu-all.js">Buskerud</a>'
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
            mapData: Highcharts.maps['countries/no/no-bu-all'],
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
