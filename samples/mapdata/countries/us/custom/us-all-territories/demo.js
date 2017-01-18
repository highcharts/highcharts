$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ma",
            "value": 0
        },
        {
            "hc-key": "us-wa",
            "value": 1
        },
        {
            "hc-key": "us-ca",
            "value": 2
        },
        {
            "hc-key": "us-or",
            "value": 3
        },
        {
            "hc-key": "us-wi",
            "value": 4
        },
        {
            "hc-key": "us-me",
            "value": 5
        },
        {
            "hc-key": "us-mi",
            "value": 6
        },
        {
            "hc-key": "us-nv",
            "value": 7
        },
        {
            "hc-key": "us-nm",
            "value": 8
        },
        {
            "hc-key": "us-co",
            "value": 9
        },
        {
            "hc-key": "us-wy",
            "value": 10
        },
        {
            "hc-key": "us-ks",
            "value": 11
        },
        {
            "hc-key": "us-ne",
            "value": 12
        },
        {
            "hc-key": "us-ok",
            "value": 13
        },
        {
            "hc-key": "us-mo",
            "value": 14
        },
        {
            "hc-key": "us-il",
            "value": 15
        },
        {
            "hc-key": "us-in",
            "value": 16
        },
        {
            "hc-key": "us-vt",
            "value": 17
        },
        {
            "hc-key": "us-ar",
            "value": 18
        },
        {
            "hc-key": "us-tx",
            "value": 19
        },
        {
            "hc-key": "us-ri",
            "value": 20
        },
        {
            "hc-key": "us-al",
            "value": 21
        },
        {
            "hc-key": "us-ms",
            "value": 22
        },
        {
            "hc-key": "us-nc",
            "value": 23
        },
        {
            "hc-key": "us-va",
            "value": 24
        },
        {
            "hc-key": "us-ia",
            "value": 25
        },
        {
            "hc-key": "us-md",
            "value": 26
        },
        {
            "hc-key": "us-de",
            "value": 27
        },
        {
            "hc-key": "us-pa",
            "value": 28
        },
        {
            "hc-key": "us-nj",
            "value": 29
        },
        {
            "hc-key": "us-ny",
            "value": 30
        },
        {
            "hc-key": "us-id",
            "value": 31
        },
        {
            "hc-key": "us-sd",
            "value": 32
        },
        {
            "hc-key": "us-ct",
            "value": 33
        },
        {
            "hc-key": "us-nh",
            "value": 34
        },
        {
            "hc-key": "us-ky",
            "value": 35
        },
        {
            "hc-key": "us-oh",
            "value": 36
        },
        {
            "hc-key": "us-tn",
            "value": 37
        },
        {
            "hc-key": "us-wv",
            "value": 38
        },
        {
            "hc-key": "us-dc",
            "value": 39
        },
        {
            "hc-key": "us-la",
            "value": 40
        },
        {
            "hc-key": "us-fl",
            "value": 41
        },
        {
            "hc-key": "us-ga",
            "value": 42
        },
        {
            "hc-key": "us-sc",
            "value": 43
        },
        {
            "hc-key": "us-mn",
            "value": 44
        },
        {
            "hc-key": "us-mt",
            "value": 45
        },
        {
            "hc-key": "us-nd",
            "value": 46
        },
        {
            "hc-key": "us-az",
            "value": 47
        },
        {
            "hc-key": "us-ut",
            "value": 48
        },
        {
            "hc-key": "us-hi",
            "value": 49
        },
        {
            "hc-key": "us-ak",
            "value": 50
        },
        {
            "hc-key": "gu-3605",
            "value": 51
        },
        {
            "hc-key": "mp-ti",
            "value": 52
        },
        {
            "hc-key": "mp-sa",
            "value": 53
        },
        {
            "hc-key": "mp-ro",
            "value": 54
        },
        {
            "hc-key": "as-6515",
            "value": 55
        },
        {
            "hc-key": "as-6514",
            "value": 56
        },
        {
            "hc-key": "pr-3614",
            "value": 57
        },
        {
            "hc-key": "vi-3617",
            "value": 58
        },
        {
            "hc-key": "vi-6398",
            "value": 59
        },
        {
            "hc-key": "vi-6399",
            "value": 60
        },
        {
            "value": 61
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-all-territories.js">United States of America with Territories</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-all-territories'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-all-territories'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
