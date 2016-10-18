$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kv-841",
            "value": 0
        },
        {
            "hc-key": "kv-7318",
            "value": 1
        },
        {
            "hc-key": "kv-7319",
            "value": 2
        },
        {
            "hc-key": "kv-7320",
            "value": 3
        },
        {
            "hc-key": "kv-7321",
            "value": 4
        },
        {
            "hc-key": "kv-7322",
            "value": 5
        },
        {
            "hc-key": "kv-844",
            "value": 6
        },
        {
            "hc-key": "kv-7302",
            "value": 7
        },
        {
            "hc-key": "kv-7303",
            "value": 8
        },
        {
            "hc-key": "kv-7304",
            "value": 9
        },
        {
            "hc-key": "kv-7305",
            "value": 10
        },
        {
            "hc-key": "kv-7306",
            "value": 11
        },
        {
            "hc-key": "kv-845",
            "value": 12
        },
        {
            "hc-key": "kv-7307",
            "value": 13
        },
        {
            "hc-key": "kv-7308",
            "value": 14
        },
        {
            "hc-key": "kv-7309",
            "value": 15
        },
        {
            "hc-key": "kv-7310",
            "value": 16
        },
        {
            "hc-key": "kv-7311",
            "value": 17
        },
        {
            "hc-key": "kv-842",
            "value": 18
        },
        {
            "hc-key": "kv-7312",
            "value": 19
        },
        {
            "hc-key": "kv-7313",
            "value": 20
        },
        {
            "hc-key": "kv-7314",
            "value": 21
        },
        {
            "hc-key": "kv-843",
            "value": 22
        },
        {
            "hc-key": "kv-7315",
            "value": 23
        },
        {
            "hc-key": "kv-7316",
            "value": 24
        },
        {
            "hc-key": "kv-7317",
            "value": 25
        },
        {
            "hc-key": "kv-7323",
            "value": 26
        },
        {
            "hc-key": "kv-7324",
            "value": 27
        },
        {
            "hc-key": "kv-7325",
            "value": 28
        },
        {
            "hc-key": "kv-7326",
            "value": 29
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kv/kv-all.js">Kosovo</a>'
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
            mapData: Highcharts.maps['countries/kv/kv-all'],
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
