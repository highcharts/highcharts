$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kz-5085",
            "value": 0
        },
        {
            "hc-key": "kz-qo",
            "value": 1
        },
        {
            "hc-key": "kz-ac",
            "value": 2
        },
        {
            "hc-key": "kz-as",
            "value": 3
        },
        {
            "hc-key": "kz-qs",
            "value": 4
        },
        {
            "hc-key": "kz-nk",
            "value": 5
        },
        {
            "hc-key": "kz-pa",
            "value": 6
        },
        {
            "hc-key": "kz-am",
            "value": 7
        },
        {
            "hc-key": "kz-zm",
            "value": 8
        },
        {
            "hc-key": "kz-ek",
            "value": 9
        },
        {
            "hc-key": "kz-ar",
            "value": 10
        },
        {
            "hc-key": "kz-mg",
            "value": 11
        },
        {
            "hc-key": "kz-aa",
            "value": 12
        },
        {
            "hc-key": "kz-at",
            "value": 13
        },
        {
            "hc-key": "kz-wk",
            "value": 14
        },
        {
            "hc-key": "kz-sk",
            "value": 15
        },
        {
            "hc-key": "kz-qg",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kz/kz-all.js">Kazakhstan</a>'
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
            mapData: Highcharts.maps['countries/kz/kz-all'],
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
