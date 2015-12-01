$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sa",
            "value": 0
        },
        {
            "hc-key": "bh",
            "value": 1
        },
        {
            "hc-key": "tr",
            "value": 2
        },
        {
            "hc-key": "om",
            "value": 3
        },
        {
            "hc-key": "ir",
            "value": 4
        },
        {
            "hc-key": "ye",
            "value": 5
        },
        {
            "hc-key": "kw",
            "value": 6
        },
        {
            "hc-key": "eg",
            "value": 7
        },
        {
            "hc-key": "il",
            "value": 8
        },
        {
            "hc-key": "jo",
            "value": 9
        },
        {
            "hc-key": "iq",
            "value": 10
        },
        {
            "hc-key": "qa",
            "value": 11
        },
        {
            "hc-key": "ae",
            "value": 12
        },
        {
            "hc-key": "sy",
            "value": 13
        },
        {
            "hc-key": "lb",
            "value": 14
        },
        {
            "hc-key": "cy",
            "value": 15
        },
        {
            "hc-key": "nc",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/middle-east.js">Middle East</a>'
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
            mapData: Highcharts.maps['custom/middle-east'],
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
