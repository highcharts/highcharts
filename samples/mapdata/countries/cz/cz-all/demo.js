$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cz-2293",
            "value": 0
        },
        {
            "hc-key": "cz-6305",
            "value": 1
        },
        {
            "hc-key": "cz-6306",
            "value": 2
        },
        {
            "hc-key": "cz-6307",
            "value": 3
        },
        {
            "hc-key": "cz-6308",
            "value": 4
        },
        {
            "hc-key": "cz-kk",
            "value": 5
        },
        {
            "hc-key": "cz-ck",
            "value": 6
        },
        {
            "hc-key": "cz-jk",
            "value": 7
        },
        {
            "hc-key": "cz-sk",
            "value": 8
        },
        {
            "hc-key": "cz-lk",
            "value": 9
        },
        {
            "hc-key": "cz-hk",
            "value": 10
        },
        {
            "hc-key": "cz-vk",
            "value": 11
        },
        {
            "hc-key": "cz-6303",
            "value": 12
        },
        {
            "hc-key": "cz-6304",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cz/cz-all.js">Czech Republic</a>'
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
            mapData: Highcharts.maps['countries/cz/cz-all'],
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
        }]
    });
});
