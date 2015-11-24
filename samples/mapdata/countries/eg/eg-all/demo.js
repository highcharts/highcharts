$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "eg-5847",
            "value": 0
        },
        {
            "hc-key": "eg-ba",
            "value": 1
        },
        {
            "hc-key": "eg-js",
            "value": 2
        },
        {
            "hc-key": "eg-uq",
            "value": 3
        },
        {
            "hc-key": "eg-is",
            "value": 4
        },
        {
            "hc-key": "eg-gh",
            "value": 5
        },
        {
            "hc-key": "eg-mf",
            "value": 6
        },
        {
            "hc-key": "eg-qh",
            "value": 7
        },
        {
            "hc-key": "eg-ql",
            "value": 8
        },
        {
            "hc-key": "eg-sq",
            "value": 9
        },
        {
            "hc-key": "eg-ss",
            "value": 10
        },
        {
            "hc-key": "eg-sw",
            "value": 11
        },
        {
            "hc-key": "eg-dq",
            "value": 12
        },
        {
            "hc-key": "eg-bs",
            "value": 13
        },
        {
            "hc-key": "eg-dt",
            "value": 14
        },
        {
            "hc-key": "eg-bh",
            "value": 15
        },
        {
            "hc-key": "eg-mt",
            "value": 16
        },
        {
            "hc-key": "eg-ik",
            "value": 17
        },
        {
            "hc-key": "eg-jz",
            "value": 18
        },
        {
            "hc-key": "eg-fy",
            "value": 19
        },
        {
            "hc-key": "eg-wj",
            "value": 20
        },
        {
            "hc-key": "eg-mn",
            "value": 21
        },
        {
            "hc-key": "eg-bn",
            "value": 22
        },
        {
            "hc-key": "eg-ks",
            "value": 23
        },
        {
            "hc-key": "eg-at",
            "value": 24
        },
        {
            "hc-key": "eg-an",
            "value": 25
        },
        {
            "hc-key": "eg-qn",
            "value": 26
        },
        {
            "hc-key": "eg-sj",
            "value": 27
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/eg/eg-all.js">Egypt</a>'
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
            mapData: Highcharts.maps['countries/eg/eg-all'],
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
