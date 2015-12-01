$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-he-441",
            "value": 0
        },
        {
            "hc-key": "no-he-439",
            "value": 1
        },
        {
            "hc-key": "no-he-438",
            "value": 2
        },
        {
            "hc-key": "no-he-437",
            "value": 3
        },
        {
            "hc-key": "no-he-436",
            "value": 4
        },
        {
            "hc-key": "no-he-434",
            "value": 5
        },
        {
            "hc-key": "no-he-430",
            "value": 6
        },
        {
            "hc-key": "no-he-428",
            "value": 7
        },
        {
            "hc-key": "no-he-423",
            "value": 8
        },
        {
            "hc-key": "no-he-432",
            "value": 9
        },
        {
            "hc-key": "no-he-402",
            "value": 10
        },
        {
            "hc-key": "no-he-427",
            "value": 11
        },
        {
            "hc-key": "no-he-403",
            "value": 12
        },
        {
            "hc-key": "no-he-429",
            "value": 13
        },
        {
            "hc-key": "no-he-415",
            "value": 14
        },
        {
            "hc-key": "no-he-420",
            "value": 15
        },
        {
            "hc-key": "no-he-417",
            "value": 16
        },
        {
            "hc-key": "no-he-425",
            "value": 17
        },
        {
            "hc-key": "no-he-412",
            "value": 18
        },
        {
            "hc-key": "no-he-426",
            "value": 19
        },
        {
            "hc-key": "no-he-418",
            "value": 20
        },
        {
            "hc-key": "no-he-419",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-he-all.js">Hedmark</a>'
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
            mapData: Highcharts.maps['countries/no/no-he-all'],
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
