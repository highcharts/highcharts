$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "in-an",
            "value": 0
        },
        {
            "hc-key": "in-wb",
            "value": 1
        },
        {
            "hc-key": "in-ld",
            "value": 2
        },
        {
            "hc-key": "in-5390",
            "value": 3
        },
        {
            "hc-key": "in-py",
            "value": 4
        },
        {
            "hc-key": "in-3464",
            "value": 5
        },
        {
            "hc-key": "in-mz",
            "value": 6
        },
        {
            "hc-key": "in-as",
            "value": 7
        },
        {
            "hc-key": "in-pb",
            "value": 8
        },
        {
            "hc-key": "in-ga",
            "value": 9
        },
        {
            "hc-key": "in-2984",
            "value": 10
        },
        {
            "hc-key": "in-jk",
            "value": 11
        },
        {
            "hc-key": "in-hr",
            "value": 12
        },
        {
            "hc-key": "in-nl",
            "value": 13
        },
        {
            "hc-key": "in-mn",
            "value": 14
        },
        {
            "hc-key": "in-tr",
            "value": 15
        },
        {
            "hc-key": "in-mp",
            "value": 16
        },
        {
            "hc-key": "in-ct",
            "value": 17
        },
        {
            "hc-key": "in-ar",
            "value": 18
        },
        {
            "hc-key": "in-ml",
            "value": 19
        },
        {
            "hc-key": "in-kl",
            "value": 20
        },
        {
            "hc-key": "in-ap",
            "value": 21
        },
        {
            "hc-key": "in-ka",
            "value": 22
        },
        {
            "hc-key": "in-mh",
            "value": 23
        },
        {
            "hc-key": "in-or",
            "value": 24
        },
        {
            "hc-key": "in-dn",
            "value": 25
        },
        {
            "hc-key": "in-dl",
            "value": 26
        },
        {
            "hc-key": "in-hp",
            "value": 27
        },
        {
            "hc-key": "in-rj",
            "value": 28
        },
        {
            "hc-key": "in-up",
            "value": 29
        },
        {
            "hc-key": "in-ut",
            "value": 30
        },
        {
            "hc-key": "in-jh",
            "value": 31
        },
        {
            "hc-key": "in-ch",
            "value": 32
        },
        {
            "hc-key": "in-br",
            "value": 33
        },
        {
            "hc-key": "in-sk",
            "value": 34
        },
        {
            "hc-key": "in-tn",
            "value": 35
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.js">India with disputed territories</a>'
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
            mapData: Highcharts.maps['countries/in/custom/in-all-disputed'],
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
