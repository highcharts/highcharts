$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-op-522",
            "value": 0
        },
        {
            "hc-key": "no-op-542",
            "value": 1
        },
        {
            "hc-key": "no-op-513",
            "value": 2
        },
        {
            "hc-key": "no-op-519",
            "value": 3
        },
        {
            "hc-key": "no-op-517",
            "value": 4
        },
        {
            "hc-key": "no-op-543",
            "value": 5
        },
        {
            "hc-key": "no-op-515",
            "value": 6
        },
        {
            "hc-key": "no-op-544",
            "value": 7
        },
        {
            "hc-key": "no-op-511",
            "value": 8
        },
        {
            "hc-key": "no-op-516",
            "value": 9
        },
        {
            "hc-key": "no-op-541",
            "value": 10
        },
        {
            "hc-key": "no-op-545",
            "value": 11
        },
        {
            "hc-key": "no-op-520",
            "value": 12
        },
        {
            "hc-key": "no-op-532",
            "value": 13
        },
        {
            "hc-key": "no-op-529",
            "value": 14
        },
        {
            "hc-key": "no-op-502",
            "value": 15
        },
        {
            "hc-key": "no-op-538",
            "value": 16
        },
        {
            "hc-key": "no-op-501",
            "value": 17
        },
        {
            "hc-key": "no-op-528",
            "value": 18
        },
        {
            "hc-key": "no-op-521",
            "value": 19
        },
        {
            "hc-key": "no-op-534",
            "value": 20
        },
        {
            "hc-key": "no-op-533",
            "value": 21
        },
        {
            "hc-key": "no-op-512",
            "value": 22
        },
        {
            "hc-key": "no-op-540",
            "value": 23
        },
        {
            "hc-key": "no-op-514",
            "value": 24
        },
        {
            "hc-key": "no-op-536",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-op-all.js">Oppland</a>'
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
            mapData: Highcharts.maps['countries/no/no-op-all'],
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
