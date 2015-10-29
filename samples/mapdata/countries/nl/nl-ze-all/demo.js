$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-ze-gm0716",
            "value": 0
        },
        {
            "hc-key": "nl-ze-gm0717",
            "value": 1
        },
        {
            "hc-key": "nl-ze-gm1714",
            "value": 2
        },
        {
            "hc-key": "nl-ze-gm1676",
            "value": 3
        },
        {
            "hc-key": "nl-ze-gm0678",
            "value": 4
        },
        {
            "hc-key": "nl-ze-gm0703",
            "value": 5
        },
        {
            "hc-key": "nl-ze-gm0664",
            "value": 6
        },
        {
            "hc-key": "nl-ze-gm0687",
            "value": 7
        },
        {
            "hc-key": "nl-ze-gm1695",
            "value": 8
        },
        {
            "hc-key": "nl-ze-gm0718",
            "value": 9
        },
        {
            "hc-key": "nl-ze-gm0654",
            "value": 10
        },
        {
            "hc-key": "nl-ze-gm0715",
            "value": 11
        },
        {
            "hc-key": "nl-ze-gm0677",
            "value": 12
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-ze-all.js">Zeeland</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-ze-all'],
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
