$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-bc-5917",
            "value": 0
        },
        {
            "hc-key": "ca-bc-5924",
            "value": 1
        },
        {
            "hc-key": "ca-bc-5926",
            "value": 2
        },
        {
            "hc-key": "ca-bc-5927",
            "value": 3
        },
        {
            "hc-key": "ca-bc-5923",
            "value": 4
        },
        {
            "hc-key": "ca-bc-5929",
            "value": 5
        },
        {
            "hc-key": "ca-bc-5947",
            "value": 6
        },
        {
            "hc-key": "ca-bc-5945",
            "value": 7
        },
        {
            "hc-key": "ca-bc-5943",
            "value": 8
        },
        {
            "hc-key": "ca-bc-5949",
            "value": 9
        },
        {
            "hc-key": "ca-bc-5959",
            "value": 10
        },
        {
            "hc-key": "ca-bc-5955",
            "value": 11
        },
        {
            "hc-key": "ca-bc-5957",
            "value": 12
        },
        {
            "hc-key": "ca-bc-5915",
            "value": 13
        },
        {
            "hc-key": "ca-bc-5921",
            "value": 14
        },
        {
            "hc-key": "ca-bc-5933",
            "value": 15
        },
        {
            "hc-key": "ca-bc-5941",
            "value": 16
        },
        {
            "hc-key": "ca-bc-5953",
            "value": 17
        },
        {
            "hc-key": "ca-bc-5935",
            "value": 18
        },
        {
            "hc-key": "ca-bc-5907",
            "value": 19
        },
        {
            "hc-key": "ca-bc-5939",
            "value": 20
        },
        {
            "hc-key": "ca-bc-5937",
            "value": 21
        },
        {
            "hc-key": "ca-bc-5931",
            "value": 22
        },
        {
            "hc-key": "ca-bc-5919",
            "value": 23
        },
        {
            "hc-key": "ca-bc-5905",
            "value": 24
        },
        {
            "hc-key": "ca-bc-5909",
            "value": 25
        },
        {
            "hc-key": "ca-bc-5951",
            "value": 26
        },
        {
            "hc-key": "ca-bc-5903",
            "value": 27
        },
        {
            "hc-key": "ca-bc-5901",
            "value": 28
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-bc-all.js">British Columbia</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-bc-all'],
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
