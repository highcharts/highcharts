$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-ov-gm0166",
            "value": 0
        },
        {
            "hc-key": "nl-ov-gm0168",
            "value": 1
        },
        {
            "hc-key": "nl-ov-gm0148",
            "value": 2
        },
        {
            "hc-key": "nl-ov-gm0160",
            "value": 3
        },
        {
            "hc-key": "nl-ov-gm0158",
            "value": 4
        },
        {
            "hc-key": "nl-ov-gm0164",
            "value": 5
        },
        {
            "hc-key": "nl-ov-gm1896",
            "value": 6
        },
        {
            "hc-key": "nl-ov-gm0193",
            "value": 7
        },
        {
            "hc-key": "nl-ov-gm0153",
            "value": 8
        },
        {
            "hc-key": "nl-ov-gm0173",
            "value": 9
        },
        {
            "hc-key": "nl-ov-gm1774",
            "value": 10
        },
        {
            "hc-key": "nl-ov-gm0163",
            "value": 11
        },
        {
            "hc-key": "nl-ov-gm0175",
            "value": 12
        },
        {
            "hc-key": "nl-ov-gm0177",
            "value": 13
        },
        {
            "hc-key": "nl-ov-gm1708",
            "value": 14
        },
        {
            "hc-key": "nl-ov-gm0180",
            "value": 15
        },
        {
            "hc-key": "nl-ov-gm1742",
            "value": 16
        },
        {
            "hc-key": "nl-ov-gm0147",
            "value": 17
        },
        {
            "hc-key": "nl-ov-gm0141",
            "value": 18
        },
        {
            "hc-key": "nl-ov-gm1773",
            "value": 19
        },
        {
            "hc-key": "nl-ov-gm0189",
            "value": 20
        },
        {
            "hc-key": "nl-ov-gm0183",
            "value": 21
        },
        {
            "hc-key": "nl-ov-gm1735",
            "value": 22
        },
        {
            "hc-key": "nl-ov-gm0150",
            "value": 23
        },
        {
            "hc-key": "nl-ov-gm1700",
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-ov-all.js">Overijssel</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-ov-all'],
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
