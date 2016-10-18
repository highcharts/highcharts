$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-ho-1251",
            "value": 0
        },
        {
            "hc-key": "no-ho-1231",
            "value": 1
        },
        {
            "hc-key": "no-ho-1233",
            "value": 2
        },
        {
            "hc-key": "no-ho-1227",
            "value": 3
        },
        {
            "hc-key": "no-ho-1241",
            "value": 4
        },
        {
            "hc-key": "no-ho-1238",
            "value": 5
        },
        {
            "hc-key": "no-ho-1252",
            "value": 6
        },
        {
            "hc-key": "no-ho-1243",
            "value": 7
        },
        {
            "hc-key": "no-ho-1245",
            "value": 8
        },
        {
            "hc-key": "no-ho-1201",
            "value": 9
        },
        {
            "hc-key": "no-ho-1246",
            "value": 10
        },
        {
            "hc-key": "no-ho-1244",
            "value": 11
        },
        {
            "hc-key": "no-ho-1242",
            "value": 12
        },
        {
            "hc-key": "no-ho-1253",
            "value": 13
        },
        {
            "hc-key": "no-ho-1222",
            "value": 14
        },
        {
            "hc-key": "no-ho-1219",
            "value": 15
        },
        {
            "hc-key": "no-ho-1224",
            "value": 16
        },
        {
            "hc-key": "no-ho-1211",
            "value": 17
        },
        {
            "hc-key": "no-ho-1223",
            "value": 18
        },
        {
            "hc-key": "no-ho-1216",
            "value": 19
        },
        {
            "hc-key": "no-ho-1234",
            "value": 20
        },
        {
            "hc-key": "no-ho-1247",
            "value": 21
        },
        {
            "hc-key": "no-ho-1232",
            "value": 22
        },
        {
            "hc-key": "no-ho-1221",
            "value": 23
        },
        {
            "hc-key": "no-ho-1263",
            "value": 24
        },
        {
            "hc-key": "no-ho-1266",
            "value": 25
        },
        {
            "hc-key": "no-ho-1228",
            "value": 26
        },
        {
            "hc-key": "no-ho-1235",
            "value": 27
        },
        {
            "hc-key": "no-ho-1259",
            "value": 28
        },
        {
            "hc-key": "no-ho-1260",
            "value": 29
        },
        {
            "hc-key": "no-ho-1265",
            "value": 30
        },
        {
            "hc-key": "no-ho-1264",
            "value": 31
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-ho-all.js">Hordaland</a>'
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
            mapData: Highcharts.maps['countries/no/no-ho-all'],
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
