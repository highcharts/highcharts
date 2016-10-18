$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kp-5044",
            "value": 0
        },
        {
            "hc-key": "kp-wn",
            "value": 1
        },
        {
            "hc-key": "kp-pb",
            "value": 2
        },
        {
            "hc-key": "kp-nj",
            "value": 3
        },
        {
            "hc-key": "kp-wb",
            "value": 4
        },
        {
            "hc-key": "kp-py",
            "value": 5
        },
        {
            "hc-key": "kp-hg",
            "value": 6
        },
        {
            "hc-key": "kp-kw",
            "value": 7
        },
        {
            "hc-key": "kp-ch",
            "value": 8
        },
        {
            "hc-key": "kp-hn",
            "value": 9
        },
        {
            "hc-key": "kp-pn",
            "value": 10
        },
        {
            "hc-key": "kp-yg",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kp/kp-all.js">North Korea</a>'
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
            mapData: Highcharts.maps['countries/kp/kp-all'],
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
