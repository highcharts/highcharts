$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pe-an",
            "value": 0
        },
        {
            "hc-key": "pe-cj",
            "value": 1
        },
        {
            "hc-key": "pe-3341",
            "value": 2
        },
        {
            "hc-key": "pe-hc",
            "value": 3
        },
        {
            "hc-key": "pe-pi",
            "value": 4
        },
        {
            "hc-key": "pe-ic",
            "value": 5
        },
        {
            "hc-key": "pe-ll",
            "value": 6
        },
        {
            "hc-key": "pe-pa",
            "value": 7
        },
        {
            "hc-key": "pe-sm",
            "value": 8
        },
        {
            "hc-key": "pe-cs",
            "value": 9
        },
        {
            "hc-key": "pe-uc",
            "value": 10
        },
        {
            "hc-key": "pe-md",
            "value": 11
        },
        {
            "hc-key": "pe-am",
            "value": 12
        },
        {
            "hc-key": "pe-lo",
            "value": 13
        },
        {
            "hc-key": "pe-ay",
            "value": 14
        },
        {
            "hc-key": "pe-145",
            "value": 15
        },
        {
            "hc-key": "pe-hv",
            "value": 16
        },
        {
            "hc-key": "pe-ju",
            "value": 17
        },
        {
            "hc-key": "pe-lr",
            "value": 18
        },
        {
            "hc-key": "pe-lb",
            "value": 19
        },
        {
            "hc-key": "pe-tu",
            "value": 20
        },
        {
            "hc-key": "pe-ap",
            "value": 21
        },
        {
            "hc-key": "pe-ar",
            "value": 22
        },
        {
            "hc-key": "pe-cl",
            "value": 23
        },
        {
            "hc-key": "pe-mq",
            "value": 24
        },
        {
            "hc-key": "pe-ta",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pe/pe-all.js">Peru</a>'
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
            mapData: Highcharts.maps['countries/pe/pe-all'],
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
