$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gt-qc",
            "value": 0
        },
        {
            "hc-key": "gt-pe",
            "value": 1
        },
        {
            "hc-key": "gt-hu",
            "value": 2
        },
        {
            "hc-key": "gt-qz",
            "value": 3
        },
        {
            "hc-key": "gt-re",
            "value": 4
        },
        {
            "hc-key": "gt-sm",
            "value": 5
        },
        {
            "hc-key": "gt-bv",
            "value": 6
        },
        {
            "hc-key": "gt-av",
            "value": 7
        },
        {
            "hc-key": "gt-es",
            "value": 8
        },
        {
            "hc-key": "gt-cm",
            "value": 9
        },
        {
            "hc-key": "gt-gu",
            "value": 10
        },
        {
            "hc-key": "gt-su",
            "value": 11
        },
        {
            "hc-key": "gt-sa",
            "value": 12
        },
        {
            "hc-key": "gt-so",
            "value": 13
        },
        {
            "hc-key": "gt-to",
            "value": 14
        },
        {
            "hc-key": "gt-pr",
            "value": 15
        },
        {
            "hc-key": "gt-sr",
            "value": 16
        },
        {
            "hc-key": "gt-iz",
            "value": 17
        },
        {
            "hc-key": "gt-cq",
            "value": 18
        },
        {
            "hc-key": "gt-ja",
            "value": 19
        },
        {
            "hc-key": "gt-ju",
            "value": 20
        },
        {
            "hc-key": "gt-za",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gt/gt-all.js">Guatemala</a>'
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
            mapData: Highcharts.maps['countries/gt/gt-all'],
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
