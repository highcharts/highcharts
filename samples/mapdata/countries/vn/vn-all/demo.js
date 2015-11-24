$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "vn-yb",
            "value": 0
        },
        {
            "hc-key": "vn-pt",
            "value": 1
        },
        {
            "hc-key": "vn-3655",
            "value": 2
        },
        {
            "hc-key": "vn-qn",
            "value": 3
        },
        {
            "hc-key": "vn-kh",
            "value": 4
        },
        {
            "hc-key": "vn-tg",
            "value": 5
        },
        {
            "hc-key": "vn-bv",
            "value": 6
        },
        {
            "hc-key": "vn-bu",
            "value": 7
        },
        {
            "hc-key": "vn-hc",
            "value": 8
        },
        {
            "hc-key": "vn-br",
            "value": 9
        },
        {
            "hc-key": "vn-st",
            "value": 10
        },
        {
            "hc-key": "vn-li",
            "value": 11
        },
        {
            "hc-key": "vn-311",
            "value": 12
        },
        {
            "hc-key": "vn-ty",
            "value": 13
        },
        {
            "hc-key": "vn-318",
            "value": 14
        },
        {
            "hc-key": "vn-hd",
            "value": 15
        },
        {
            "hc-key": "vn-bn",
            "value": 16
        },
        {
            "hc-key": "vn-317",
            "value": 17
        },
        {
            "hc-key": "vn-vc",
            "value": 18
        },
        {
            "hc-key": "vn-nb",
            "value": 19
        },
        {
            "hc-key": "vn-hm",
            "value": 20
        },
        {
            "hc-key": "vn-ho",
            "value": 21
        },
        {
            "hc-key": "vn-bg",
            "value": 22
        },
        {
            "hc-key": "vn-tb",
            "value": 23
        },
        {
            "hc-key": "vn-ld",
            "value": 24
        },
        {
            "hc-key": "vn-bp",
            "value": 25
        },
        {
            "hc-key": "vn-tn",
            "value": 26
        },
        {
            "hc-key": "vn-py",
            "value": 27
        },
        {
            "hc-key": "vn-bd",
            "value": 28
        },
        {
            "hc-key": "vn-3623",
            "value": 29
        },
        {
            "hc-key": "vn-724",
            "value": 30
        },
        {
            "hc-key": "vn-qg",
            "value": 31
        },
        {
            "hc-key": "vn-331",
            "value": 32
        },
        {
            "hc-key": "vn-dt",
            "value": 33
        },
        {
            "hc-key": "vn-333",
            "value": 34
        },
        {
            "hc-key": "vn-la",
            "value": 35
        },
        {
            "hc-key": "vn-337",
            "value": 36
        },
        {
            "hc-key": "vn-bl",
            "value": 37
        },
        {
            "hc-key": "vn-vl",
            "value": 38
        },
        {
            "hc-key": "vn-hg",
            "value": 39
        },
        {
            "hc-key": "vn-nd",
            "value": 40
        },
        {
            "hc-key": "vn-db",
            "value": 41
        },
        {
            "hc-key": "vn-ls",
            "value": 42
        },
        {
            "hc-key": "vn-th",
            "value": 43
        },
        {
            "hc-key": "vn-307",
            "value": 44
        },
        {
            "hc-key": "vn-tq",
            "value": 45
        },
        {
            "hc-key": "vn-328",
            "value": 46
        },
        {
            "hc-key": "vn-na",
            "value": 47
        },
        {
            "hc-key": "vn-qb",
            "value": 48
        },
        {
            "hc-key": "vn-723",
            "value": 49
        },
        {
            "hc-key": "vn-nt",
            "value": 50
        },
        {
            "hc-key": "vn-6365",
            "value": 51
        },
        {
            "hc-key": "vn-299",
            "value": 52
        },
        {
            "hc-key": "vn-300",
            "value": 53
        },
        {
            "hc-key": "vn-qt",
            "value": 54
        },
        {
            "hc-key": "vn-tt",
            "value": 55
        },
        {
            "hc-key": "vn-kg",
            "value": 56
        },
        {
            "hc-key": "vn-da",
            "value": 57
        },
        {
            "hc-key": "vn-ag",
            "value": 58
        },
        {
            "hc-key": "vn-cm",
            "value": 59
        },
        {
            "hc-key": "vn-tv",
            "value": 60
        },
        {
            "hc-key": "vn-cb",
            "value": 61
        },
        {
            "hc-key": "vn-lo",
            "value": 62
        },
        {
            "hc-key": "vn-bi",
            "value": 63
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/vn/vn-all.js">Vietnam</a>'
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
            mapData: Highcharts.maps['countries/vn/vn-all'],
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
