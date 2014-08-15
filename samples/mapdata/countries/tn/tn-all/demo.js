$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tn-4431",
            "value": 0
        },
        {
            "hc-key": "tn-sf",
            "value": 1
        },
        {
            "hc-key": "tn-me",
            "value": 2
        },
        {
            "hc-key": "tn-to",
            "value": 3
        },
        {
            "hc-key": "tn-mn",
            "value": 4
        },
        {
            "hc-key": "tn-bj",
            "value": 5
        },
        {
            "hc-key": "tn-ba",
            "value": 6
        },
        {
            "hc-key": "tn-bz",
            "value": 7
        },
        {
            "hc-key": "tn-je",
            "value": 8
        },
        {
            "hc-key": "tn-nb",
            "value": 9
        },
        {
            "hc-key": "tn-tu",
            "value": 10
        },
        {
            "hc-key": "tn-kf",
            "value": 11
        },
        {
            "hc-key": "tn-ks",
            "value": 12
        },
        {
            "hc-key": "tn-gb",
            "value": 13
        },
        {
            "hc-key": "tn-gf",
            "value": 14
        },
        {
            "hc-key": "tn-sz",
            "value": 15
        },
        {
            "hc-key": "tn-sl",
            "value": 16
        },
        {
            "hc-key": "tn-mh",
            "value": 17
        },
        {
            "hc-key": "tn-ms",
            "value": 18
        },
        {
            "hc-key": "tn-kr",
            "value": 19
        },
        {
            "hc-key": "tn-ss",
            "value": 20
        },
        {
            "hc-key": "tn-za",
            "value": 21
        },
        {
            "hc-key": "tn-kb",
            "value": 22
        },
        {
            "hc-key": "tn-ta",
            "value": 23
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tn/tn-all.js">Tunisia</a>'
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
            mapData: Highcharts.maps['countries/tn/tn-all'],
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
