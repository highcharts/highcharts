$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "az-cf",
            "value": 0
        },
        {
            "hc-key": "az-sh",
            "value": 1
        },
        {
            "hc-key": "az-qz",
            "value": 2
        },
        {
            "hc-key": "az-ba",
            "value": 3
        },
        {
            "hc-key": "az-6369",
            "value": 4
        },
        {
            "hc-key": "az-sa",
            "value": 5
        },
        {
            "hc-key": "az-ga",
            "value": 6
        },
        {
            "hc-key": "az-xr",
            "value": 7
        },
        {
            "hc-key": "az-na",
            "value": 8
        },
        {
            "hc-key": "az-gr",
            "value": 9
        },
        {
            "hc-key": "az-ka",
            "value": 10
        },
        {
            "hc-key": "az-yv",
            "value": 11
        },
        {
            "hc-key": "az-as",
            "value": 12
        },
        {
            "hc-key": "az-dv",
            "value": 13
        },
        {
            "hc-key": "az-bs",
            "value": 14
        },
        {
            "hc-key": "az-st",
            "value": 15
        },
        {
            "hc-key": "az-sq",
            "value": 16
        },
        {
            "hc-key": "az-xi",
            "value": 17
        },
        {
            "hc-key": "az-si",
            "value": 18
        },
        {
            "hc-key": "az-qa",
            "value": 19
        },
        {
            "hc-key": "az-qb",
            "value": 20
        },
        {
            "hc-key": "az-805",
            "value": 21
        },
        {
            "hc-key": "az-xd",
            "value": 22
        },
        {
            "hc-key": "az-qd",
            "value": 23
        },
        {
            "hc-key": "az-2051",
            "value": 24
        },
        {
            "hc-key": "az-xc",
            "value": 25
        },
        {
            "hc-key": "az-bb",
            "value": 26
        },
        {
            "hc-key": "az-la",
            "value": 27
        },
        {
            "hc-key": "az-sl",
            "value": 28
        },
        {
            "hc-key": "az-ab",
            "value": 29
        },
        {
            "hc-key": "az-sb",
            "value": 30
        },
        {
            "hc-key": "az-7025",
            "value": 31
        },
        {
            "hc-key": "az-kg",
            "value": 32
        },
        {
            "hc-key": "az-af",
            "value": 33
        },
        {
            "hc-key": "az-ds",
            "value": 34
        },
        {
            "hc-key": "az-sx",
            "value": 35
        },
        {
            "hc-key": "az-to",
            "value": 36
        },
        {
            "hc-key": "az-ta",
            "value": 37
        },
        {
            "hc-key": "az-am",
            "value": 38
        },
        {
            "hc-key": "az-ha",
            "value": 39
        },
        {
            "hc-key": "az-au",
            "value": 40
        },
        {
            "hc-key": "az-br",
            "value": 41
        },
        {
            "hc-key": "az-yr",
            "value": 42
        },
        {
            "hc-key": "az-cl",
            "value": 43
        },
        {
            "hc-key": "az-zg",
            "value": 44
        },
        {
            "hc-key": "az-cb",
            "value": 45
        },
        {
            "hc-key": "az-zr",
            "value": 46
        },
        {
            "hc-key": "az-bq",
            "value": 47
        },
        {
            "hc-key": "az-im",
            "value": 48
        },
        {
            "hc-key": "az-ku",
            "value": 49
        },
        {
            "hc-key": "az-uc",
            "value": 50
        },
        {
            "hc-key": "az-gy",
            "value": 51
        },
        {
            "hc-key": "az-is",
            "value": 52
        },
        {
            "hc-key": "az-ln",
            "value": 53
        },
        {
            "hc-key": "az-ma",
            "value": 54
        },
        {
            "hc-key": "az-ne",
            "value": 55
        },
        {
            "hc-key": "az-ac",
            "value": 56
        },
        {
            "hc-key": "az-og",
            "value": 57
        },
        {
            "hc-key": "az-qx",
            "value": 58
        },
        {
            "hc-key": "az-sk",
            "value": 59
        },
        {
            "hc-key": "az-qr",
            "value": 60
        },
        {
            "hc-key": "az-xz",
            "value": 61
        },
        {
            "hc-key": "az-zq",
            "value": 62
        },
        {
            "hc-key": "az-bl",
            "value": 63
        },
        {
            "hc-key": "az-sd",
            "value": 64
        },
        {
            "hc-key": "az-or",
            "value": 65
        },
        {
            "hc-key": "az-sr",
            "value": 66
        },
        {
            "hc-key": "az-gd",
            "value": 67
        },
        {
            "hc-key": "az-sm",
            "value": 68
        },
        {
            "hc-key": "az-ar",
            "value": 69
        },
        {
            "hc-key": "az-aa",
            "value": 70
        },
        {
            "hc-key": "az-fu",
            "value": 71
        },
        {
            "hc-key": "az-le",
            "value": 72
        },
        {
            "hc-key": "az-qo",
            "value": 73
        },
        {
            "hc-key": "az-sy",
            "value": 74
        },
        {
            "hc-key": "az-nx",
            "value": 75
        },
        {
            "hc-key": "az-mi",
            "value": 76
        },
        {
            "hc-key": "az-ye",
            "value": 77
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/az/az-all.js">Azerbaijan</a>'
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
            mapData: Highcharts.maps['countries/az/az-all'],
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
