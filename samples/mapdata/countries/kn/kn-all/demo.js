$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kn-tp",
            "value": 0
        },
        {
            "hc-key": "kn-cc",
            "value": 1
        },
        {
            "hc-key": "kn-as",
            "value": 2
        },
        {
            "hc-key": "kn-gb",
            "value": 3
        },
        {
            "hc-key": "kn-gg",
            "value": 4
        },
        {
            "hc-key": "kn-jw",
            "value": 5
        },
        {
            "hc-key": "kn-jc",
            "value": 6
        },
        {
            "hc-key": "kn-jf",
            "value": 7
        },
        {
            "hc-key": "kn-mc",
            "value": 8
        },
        {
            "hc-key": "kn-pp",
            "value": 9
        },
        {
            "hc-key": "kn-pl",
            "value": 10
        },
        {
            "hc-key": "kn-pb",
            "value": 11
        },
        {
            "hc-key": "kn-tl",
            "value": 12
        },
        {
            "hc-key": "kn-tm",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kn/kn-all.js">Saint Kitts and Nevis</a>'
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
            mapData: Highcharts.maps['countries/kn/kn-all'],
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
