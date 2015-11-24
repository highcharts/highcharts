$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mw-6970",
            "value": 0
        },
        {
            "hc-key": "mw-ma",
            "value": 1
        },
        {
            "hc-key": "mw-de",
            "value": 2
        },
        {
            "hc-key": "mw-li",
            "value": 3
        },
        {
            "hc-key": "mw-do",
            "value": 4
        },
        {
            "hc-key": "mw-mg",
            "value": 5
        },
        {
            "hc-key": "mw-mc",
            "value": 6
        },
        {
            "hc-key": "mw-nu",
            "value": 7
        },
        {
            "hc-key": "mw-ni",
            "value": 8
        },
        {
            "hc-key": "mw-sa",
            "value": 9
        },
        {
            "hc-key": "mw-ba",
            "value": 10
        },
        {
            "hc-key": "mw-ck",
            "value": 11
        },
        {
            "hc-key": "mw-th",
            "value": 12
        },
        {
            "hc-key": "mw-cr",
            "value": 13
        },
        {
            "hc-key": "mw-ns",
            "value": 14
        },
        {
            "hc-key": "mw-zo",
            "value": 15
        },
        {
            "hc-key": "mw-bl",
            "value": 16
        },
        {
            "hc-key": "mw-1649",
            "value": 17
        },
        {
            "hc-key": "mw-mj",
            "value": 18
        },
        {
            "hc-key": "mw-ph",
            "value": 19
        },
        {
            "hc-key": "mw-mw",
            "value": 20
        },
        {
            "hc-key": "mw-1011",
            "value": 21
        },
        {
            "hc-key": "mw-ct",
            "value": 22
        },
        {
            "hc-key": "mw-ks",
            "value": 23
        },
        {
            "hc-key": "mw-mz",
            "value": 24
        },
        {
            "hc-key": "mw-na",
            "value": 25
        },
        {
            "hc-key": "mw-nk",
            "value": 26
        },
        {
            "hc-key": "mw-ru",
            "value": 27
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mw/mw-all.js">Malawi</a>'
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
            mapData: Highcharts.maps['countries/mw/mw-all'],
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
