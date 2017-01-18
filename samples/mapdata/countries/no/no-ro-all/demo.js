$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-ro-1160",
            "value": 0
        },
        {
            "hc-key": "no-ro-1149",
            "value": 1
        },
        {
            "hc-key": "no-ro-1144",
            "value": 2
        },
        {
            "hc-key": "no-ro-1151",
            "value": 3
        },
        {
            "hc-key": "no-ro-1142",
            "value": 4
        },
        {
            "hc-key": "no-ro-1141",
            "value": 5
        },
        {
            "hc-key": "no-ro-1145",
            "value": 6
        },
        {
            "hc-key": "no-ro-1111",
            "value": 7
        },
        {
            "hc-key": "no-ro-1112",
            "value": 8
        },
        {
            "hc-key": "no-ro-1114",
            "value": 9
        },
        {
            "hc-key": "no-ro-1119",
            "value": 10
        },
        {
            "hc-key": "no-ro-1129",
            "value": 11
        },
        {
            "hc-key": "no-ro-1122",
            "value": 12
        },
        {
            "hc-key": "no-ro-1120",
            "value": 13
        },
        {
            "hc-key": "no-ro-1124",
            "value": 14
        },
        {
            "hc-key": "no-ro-1127",
            "value": 15
        },
        {
            "hc-key": "no-ro-1106",
            "value": 16
        },
        {
            "hc-key": "no-ro-1133",
            "value": 17
        },
        {
            "hc-key": "no-ro-1134",
            "value": 18
        },
        {
            "hc-key": "no-ro-1146",
            "value": 19
        },
        {
            "hc-key": "no-ro-1102",
            "value": 20
        },
        {
            "hc-key": "no-ro-1130",
            "value": 21
        },
        {
            "hc-key": "no-ro-1135",
            "value": 22
        },
        {
            "hc-key": "no-ro-1121",
            "value": 23
        },
        {
            "hc-key": "no-ro-1103",
            "value": 24
        },
        {
            "hc-key": "no-ro-1101",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-ro-all.js">Rogaland</a>'
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
            mapData: Highcharts.maps['countries/no/no-ro-all'],
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
