$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-li-gm0889",
            "value": 0
        },
        {
            "hc-key": "nl-li-gm0899",
            "value": 1
        },
        {
            "hc-key": "nl-li-gm0882",
            "value": 2
        },
        {
            "hc-key": "nl-li-gm0917",
            "value": 3
        },
        {
            "hc-key": "nl-li-gm0951",
            "value": 4
        },
        {
            "hc-key": "nl-li-gm0971",
            "value": 5
        },
        {
            "hc-key": "nl-li-gm0888",
            "value": 6
        },
        {
            "hc-key": "nl-li-gm0881",
            "value": 7
        },
        {
            "hc-key": "nl-li-gm1883",
            "value": 8
        },
        {
            "hc-key": "nl-li-gm0928",
            "value": 9
        },
        {
            "hc-key": "nl-li-gm0944",
            "value": 10
        },
        {
            "hc-key": "nl-li-gm1711",
            "value": 11
        },
        {
            "hc-key": "nl-li-gm0946",
            "value": 12
        },
        {
            "hc-key": "nl-li-gm0938",
            "value": 13
        },
        {
            "hc-key": "nl-li-gm1641",
            "value": 14
        },
        {
            "hc-key": "nl-li-gm0957",
            "value": 15
        },
        {
            "hc-key": "nl-li-gm1669",
            "value": 16
        },
        {
            "hc-key": "nl-li-gm0962",
            "value": 17
        },
        {
            "hc-key": "nl-li-gm0965",
            "value": 18
        },
        {
            "hc-key": "nl-li-gm0935",
            "value": 19
        },
        {
            "hc-key": "nl-li-gm1729",
            "value": 20
        },
        {
            "hc-key": "nl-li-gm1507",
            "value": 21
        },
        {
            "hc-key": "nl-li-gm0994",
            "value": 22
        },
        {
            "hc-key": "nl-li-gm0893",
            "value": 23
        },
        {
            "hc-key": "nl-li-gm0986",
            "value": 24
        },
        {
            "hc-key": "nl-li-gm0983",
            "value": 25
        },
        {
            "hc-key": "nl-li-gm1640",
            "value": 26
        },
        {
            "hc-key": "nl-li-gm0984",
            "value": 27
        },
        {
            "hc-key": "nl-li-gm1894",
            "value": 28
        },
        {
            "hc-key": "nl-li-gm0981",
            "value": 29
        },
        {
            "hc-key": "nl-li-gm0988",
            "value": 30
        },
        {
            "hc-key": "nl-li-gm1903",
            "value": 31
        },
        {
            "hc-key": "nl-li-gm0907",
            "value": 32
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-li-all.js">Limburg</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-li-all'],
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
