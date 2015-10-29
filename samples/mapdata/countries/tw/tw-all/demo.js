$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tw-pt",
            "value": 0
        },
        {
            "hc-key": "tw-tn",
            "value": 1
        },
        {
            "hc-key": "tw-il",
            "value": 2
        },
        {
            "hc-key": "tw-ch",
            "value": 3
        },
        {
            "hc-key": "tw-tt",
            "value": 4
        },
        {
            "hc-key": "tw-ph",
            "value": 5
        },
        {
            "hc-key": "tw-km",
            "value": 6
        },
        {
            "hc-key": "tw-lk",
            "value": 7
        },
        {
            "hc-key": "tw-tw",
            "value": 8
        },
        {
            "hc-key": "tw-cs",
            "value": 9
        },
        {
            "hc-key": "tw-th",
            "value": 10
        },
        {
            "hc-key": "tw-yl",
            "value": 11
        },
        {
            "hc-key": "tw-kh",
            "value": 12
        },
        {
            "hc-key": "tw-tp",
            "value": 13
        },
        {
            "hc-key": "tw-hs",
            "value": 14
        },
        {
            "hc-key": "tw-hh",
            "value": 15
        },
        {
            "hc-key": "tw-cl",
            "value": 16
        },
        {
            "hc-key": "tw-ml",
            "value": 17
        },
        {
            "hc-key": "tw-ty",
            "value": 18
        },
        {
            "hc-key": "tw-cg",
            "value": 19
        },
        {
            "hc-key": "tw-hl",
            "value": 20
        },
        {
            "hc-key": "tw-nt",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/tw/tw-all.js">Taiwan</a>'
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
            mapData: Highcharts.maps['countries/tw/tw-all'],
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
