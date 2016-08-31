$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-3559-gm0351",
            "value": 0
        },
        {
            "hc-key": "nl-3559-gm0632",
            "value": 1
        },
        {
            "hc-key": "nl-3559-gm1904",
            "value": 2
        },
        {
            "hc-key": "nl-3559-gm0352",
            "value": 3
        },
        {
            "hc-key": "nl-3559-gm0355",
            "value": 4
        },
        {
            "hc-key": "nl-3559-gm0345",
            "value": 5
        },
        {
            "hc-key": "nl-3559-gm1581",
            "value": 6
        },
        {
            "hc-key": "nl-3559-gm0307",
            "value": 7
        },
        {
            "hc-key": "nl-3559-gm0313",
            "value": 8
        },
        {
            "hc-key": "nl-3559-gm0308",
            "value": 9
        },
        {
            "hc-key": "nl-3559-gm0356",
            "value": 10
        },
        {
            "hc-key": "nl-3559-gm0317",
            "value": 11
        },
        {
            "hc-key": "nl-3559-gm0736",
            "value": 12
        },
        {
            "hc-key": "nl-3559-gm0327",
            "value": 13
        },
        {
            "hc-key": "nl-3559-gm0342",
            "value": 14
        },
        {
            "hc-key": "nl-3559-gm0339",
            "value": 15
        },
        {
            "hc-key": "nl-3559-gm0340",
            "value": 16
        },
        {
            "hc-key": "nl-3559-gm0331",
            "value": 17
        },
        {
            "hc-key": "nl-3559-gm0589",
            "value": 18
        },
        {
            "hc-key": "nl-3559-gm0312",
            "value": 19
        },
        {
            "hc-key": "nl-3559-gm0321",
            "value": 20
        },
        {
            "hc-key": "nl-3559-gm0310",
            "value": 21
        },
        {
            "hc-key": "nl-3559-gm0344",
            "value": 22
        },
        {
            "hc-key": "nl-3559-gm0335",
            "value": 23
        },
        {
            "hc-key": "nl-3559-gm0353",
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-ut-all.js">Utrecht</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-ut-all'],
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
