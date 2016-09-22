$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ca",
            "value": 0
        },
        {
            "hc-key": "us-or",
            "value": 1
        },
        {
            "hc-key": "us-nd",
            "value": 2
        },
        {
            "hc-key": "ca-sk",
            "value": 3
        },
        {
            "hc-key": "us-mt",
            "value": 4
        },
        {
            "hc-key": "us-az",
            "value": 5
        },
        {
            "hc-key": "us-nv",
            "value": 6
        },
        {
            "hc-key": "us-al",
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
            "hc-key": "us-wi",
            "value": 11
        },
        {
            "hc-key": "us-ks",
            "value": 12
        },
        {
            "hc-key": "us-ne",
            "value": 13
        },
        {
            "hc-key": "us-ok",
            "value": 14
        },
        {
            "hc-key": "us-mi",
            "value": 15
        },
        {
            "hc-key": "us-ak",
            "value": 16
        },
        {
            "hc-key": "us-oh",
            "value": 17
        },
        {
            "hc-key": "ca-bc",
            "value": 18
        },
        {
            "hc-key": "ca-nu",
            "value": 19
        },
        {
            "hc-key": "ca-nt",
            "value": 20
        },
        {
            "hc-key": "ca-ab",
            "value": 21
        },
        {
            "hc-key": "us-ma",
            "value": 22
        },
        {
            "hc-key": "us-vt",
            "value": 23
        },
        {
            "hc-key": "us-mn",
            "value": 24
        },
        {
            "hc-key": "us-wa",
            "value": 25
        },
        {
            "hc-key": "us-id",
            "value": 26
        },
        {
            "hc-key": "us-ar",
            "value": 27
        },
        {
            "hc-key": "us-tx",
            "value": 28
        },
        {
            "hc-key": "us-ri",
            "value": 29
        },
        {
            "hc-key": "us-fl",
            "value": 30
        },
        {
            "hc-key": "us-ms",
            "value": 31
        },
        {
            "hc-key": "us-ut",
            "value": 32
        },
        {
            "hc-key": "us-nc",
            "value": 33
        },
        {
            "hc-key": "us-ga",
            "value": 34
        },
        {
            "hc-key": "us-va",
            "value": 35
        },
        {
            "hc-key": "us-tn",
            "value": 36
        },
        {
            "hc-key": "us-ia",
            "value": 37
        },
        {
            "hc-key": "us-md",
            "value": 38
        },
        {
            "hc-key": "us-de",
            "value": 39
        },
        {
            "hc-key": "us-mo",
            "value": 40
        },
        {
            "hc-key": "us-pa",
            "value": 41
        },
        {
            "hc-key": "us-nj",
            "value": 42
        },
        {
            "hc-key": "us-ny",
            "value": 43
        },
        {
            "hc-key": "us-la",
            "value": 44
        },
        {
            "hc-key": "us-nh",
            "value": 45
        },
        {
            "hc-key": "us-me",
            "value": 46
        },
        {
            "hc-key": "us-sd",
            "value": 47
        },
        {
            "hc-key": "us-ct",
            "value": 48
        },
        {
            "hc-key": "us-il",
            "value": 49
        },
        {
            "hc-key": "us-in",
            "value": 50
        },
        {
            "hc-key": "us-ky",
            "value": 51
        },
        {
            "hc-key": "us-wv",
            "value": 52
        },
        {
            "hc-key": "us-dc",
            "value": 53
        },
        {
            "hc-key": "ca-on",
            "value": 54
        },
        {
            "hc-key": "ca-qc",
            "value": 55
        },
        {
            "hc-key": "ca-nb",
            "value": 56
        },
        {
            "hc-key": "ca-ns",
            "value": 57
        },
        {
            "hc-key": "ca-nl",
            "value": 58
        },
        {
            "hc-key": "ca-mb",
            "value": 59
        },
        {
            "hc-key": "us-sc",
            "value": 60
        },
        {
            "hc-key": "ca-yt",
            "value": 61
        },
        {
            "hc-key": "ca-pe",
            "value": 62
        },
        {
            "value": 63
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Highmaps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/usa-and-canada.js">Canada and United States of America</a>'
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

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/usa-and-canada'],
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
