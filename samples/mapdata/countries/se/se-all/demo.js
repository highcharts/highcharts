$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "se-4461",
            "value": 0
        },
        {
            "hc-key": "se-ka",
            "value": 1
        },
        {
            "hc-key": "se-og",
            "value": 2
        },
        {
            "hc-key": "se-nb",
            "value": 3
        },
        {
            "hc-key": "se-vn",
            "value": 4
        },
        {
            "hc-key": "se-vb",
            "value": 5
        },
        {
            "hc-key": "se-gt",
            "value": 6
        },
        {
            "hc-key": "se-st",
            "value": 7
        },
        {
            "hc-key": "se-up",
            "value": 8
        },
        {
            "hc-key": "se-bl",
            "value": 9
        },
        {
            "hc-key": "se-vg",
            "value": 10
        },
        {
            "hc-key": "se-ko",
            "value": 11
        },
        {
            "hc-key": "se-gv",
            "value": 12
        },
        {
            "hc-key": "se-jo",
            "value": 13
        },
        {
            "hc-key": "se-kr",
            "value": 14
        },
        {
            "hc-key": "se-or",
            "value": 15
        },
        {
            "hc-key": "se-vm",
            "value": 16
        },
        {
            "hc-key": "se-ha",
            "value": 17
        },
        {
            "hc-key": "se-sd",
            "value": 18
        },
        {
            "hc-key": "se-vr",
            "value": 19
        },
        {
            "hc-key": "se-ja",
            "value": 20
        },
        {
            "hc-key": "se-sn",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/se/se-all.js">Sweden</a>'
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
            mapData: Highcharts.maps['countries/se/se-all'],
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
