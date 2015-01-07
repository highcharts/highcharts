$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sc-6700",
            "value": 0
        },
        {
            "hc-key": "sc-6707",
            "value": 1
        },
        {
            "hc-key": "sc-6708",
            "value": 2
        },
        {
            "hc-key": "sc-6711",
            "value": 3
        },
        {
            "hc-key": "sc-6714",
            "value": 4
        },
        {
            "hc-key": "sc-6702",
            "value": 5
        },
        {
            "hc-key": "sc-6703",
            "value": 6
        },
        {
            "hc-key": "sc-6704",
            "value": 7
        },
        {
            "hc-key": "sc-6705",
            "value": 8
        },
        {
            "hc-key": "sc-6706",
            "value": 9
        },
        {
            "hc-key": "sc-6709",
            "value": 10
        },
        {
            "hc-key": "sc-6710",
            "value": 11
        },
        {
            "hc-key": "sc-6712",
            "value": 12
        },
        {
            "hc-key": "sc-6713",
            "value": 13
        },
        {
            "hc-key": "sc-6715",
            "value": 14
        },
        {
            "hc-key": "sc-6716",
            "value": 15
        },
        {
            "hc-key": "sc-6717",
            "value": 16
        },
        {
            "hc-key": "sc-6718",
            "value": 17
        },
        {
            "hc-key": "sc-6694",
            "value": 18
        },
        {
            "hc-key": "sc-6695",
            "value": 19
        },
        {
            "hc-key": "sc-6696",
            "value": 20
        },
        {
            "hc-key": "sc-6697",
            "value": 21
        },
        {
            "hc-key": "sc-6698",
            "value": 22
        },
        {
            "hc-key": "sc-6699",
            "value": 23
        },
        {
            "hc-key": "sc-6701",
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sc/sc-all.js">Seychelles</a>'
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
            mapData: Highcharts.maps['countries/sc/sc-all'],
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
