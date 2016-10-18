$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-on-3559",
            "value": 0
        },
        {
            "hc-key": "ca-on-3558",
            "value": 1
        },
        {
            "hc-key": "ca-on-3511",
            "value": 2
        },
        {
            "hc-key": "ca-on-3510",
            "value": 3
        },
        {
            "hc-key": "ca-on-3544",
            "value": 4
        },
        {
            "hc-key": "ca-on-3560",
            "value": 5
        },
        {
            "hc-key": "ca-on-3551",
            "value": 6
        },
        {
            "hc-key": "ca-on-3506",
            "value": 7
        },
        {
            "hc-key": "ca-on-3507",
            "value": 8
        },
        {
            "hc-key": "ca-on-3520",
            "value": 9
        },
        {
            "hc-key": "ca-on-3521",
            "value": 10
        },
        {
            "hc-key": "ca-on-3502",
            "value": 11
        },
        {
            "hc-key": "ca-on-3556",
            "value": 12
        },
        {
            "hc-key": "ca-on-3540",
            "value": 13
        },
        {
            "hc-key": "ca-on-3523",
            "value": 14
        },
        {
            "hc-key": "ca-on-3541",
            "value": 15
        },
        {
            "hc-key": "ca-on-3518",
            "value": 16
        },
        {
            "hc-key": "ca-on-3519",
            "value": 17
        },
        {
            "hc-key": "ca-on-3542",
            "value": 18
        },
        {
            "hc-key": "ca-on-3543",
            "value": 19
        },
        {
            "hc-key": "ca-on-3538",
            "value": 20
        },
        {
            "hc-key": "ca-on-3539",
            "value": 21
        },
        {
            "hc-key": "ca-on-3531",
            "value": 22
        },
        {
            "hc-key": "ca-on-3514",
            "value": 23
        },
        {
            "hc-key": "ca-on-3513",
            "value": 24
        },
        {
            "hc-key": "ca-on-3512",
            "value": 25
        },
        {
            "hc-key": "ca-on-3548",
            "value": 26
        },
        {
            "hc-key": "ca-on-3552",
            "value": 27
        },
        {
            "hc-key": "ca-on-3516",
            "value": 28
        },
        {
            "hc-key": "ca-on-3515",
            "value": 29
        },
        {
            "hc-key": "ca-on-3557",
            "value": 30
        },
        {
            "hc-key": "ca-on-3528",
            "value": 31
        },
        {
            "hc-key": "ca-on-3532",
            "value": 32
        },
        {
            "hc-key": "ca-on-3530",
            "value": 33
        },
        {
            "hc-key": "ca-on-3534",
            "value": 34
        },
        {
            "hc-key": "ca-on-3536",
            "value": 35
        },
        {
            "hc-key": "ca-on-3537",
            "value": 36
        },
        {
            "hc-key": "ca-on-3547",
            "value": 37
        },
        {
            "hc-key": "ca-on-3509",
            "value": 38
        },
        {
            "hc-key": "ca-on-3529",
            "value": 39
        },
        {
            "hc-key": "ca-on-3549",
            "value": 40
        },
        {
            "hc-key": "ca-on-3546",
            "value": 41
        },
        {
            "hc-key": "ca-on-3526",
            "value": 42
        },
        {
            "hc-key": "ca-on-3524",
            "value": 43
        },
        {
            "hc-key": "ca-on-3525",
            "value": 44
        },
        {
            "hc-key": "ca-on-3522",
            "value": 45
        },
        {
            "hc-key": "ca-on-3501",
            "value": 46
        },
        {
            "hc-key": "ca-on-3554",
            "value": 47
        },
        {
            "hc-key": "ca-on-3553",
            "value": 48
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-on-all.js">Ontario</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-on-all'],
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
