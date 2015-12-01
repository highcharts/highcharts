$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sn-sl",
            "value": 0
        },
        {
            "hc-key": "sn-th",
            "value": 1
        },
        {
            "hc-key": "sn-680",
            "value": 2
        },
        {
            "hc-key": "sn-zg",
            "value": 3
        },
        {
            "hc-key": "sn-tc",
            "value": 4
        },
        {
            "hc-key": "sn-kd",
            "value": 5
        },
        {
            "hc-key": "sn-6976",
            "value": 6
        },
        {
            "hc-key": "sn-6978",
            "value": 7
        },
        {
            "hc-key": "sn-6975",
            "value": 8
        },
        {
            "hc-key": "sn-dk",
            "value": 9
        },
        {
            "hc-key": "sn-db",
            "value": 10
        },
        {
            "hc-key": "sn-fk",
            "value": 11
        },
        {
            "hc-key": "sn-1181",
            "value": 12
        },
        {
            "hc-key": "sn-lg",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sn/sn-all.js">Senegal</a>'
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
            mapData: Highcharts.maps['countries/sn/sn-all'],
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
