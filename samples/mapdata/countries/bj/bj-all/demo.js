$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bj-do",
            "value": 0
        },
        {
            "hc-key": "bj-bo",
            "value": 1
        },
        {
            "hc-key": "bj-al",
            "value": 2
        },
        {
            "hc-key": "bj-cl",
            "value": 3
        },
        {
            "hc-key": "bj-aq",
            "value": 4
        },
        {
            "hc-key": "bj-li",
            "value": 5
        },
        {
            "hc-key": "bj-cf",
            "value": 6
        },
        {
            "hc-key": "bj-ou",
            "value": 7
        },
        {
            "hc-key": "bj-zo",
            "value": 8
        },
        {
            "hc-key": "bj-pl",
            "value": 9
        },
        {
            "hc-key": "bj-mo",
            "value": 10
        },
        {
            "hc-key": "bj-ak",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bj/bj-all.js">Benin</a>'
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
            mapData: Highcharts.maps['countries/bj/bj-all'],
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
