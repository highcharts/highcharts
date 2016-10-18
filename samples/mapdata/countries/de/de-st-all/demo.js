$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-st-15002000",
            "value": 0
        },
        {
            "hc-key": "de-st-15001000",
            "value": 1
        },
        {
            "hc-key": "de-st-15082000",
            "value": 2
        },
        {
            "hc-key": "de-st-15090000",
            "value": 3
        },
        {
            "hc-key": "de-st-15081000",
            "value": 4
        },
        {
            "hc-key": "de-st-14730000",
            "value": 5
        },
        {
            "hc-key": "de-st-15085000",
            "value": 6
        },
        {
            "hc-key": "de-st-15086000",
            "value": 7
        },
        {
            "hc-key": "de-st-15088000",
            "value": 8
        },
        {
            "hc-key": "de-st-15089000",
            "value": 9
        },
        {
            "hc-key": "de-st-15087000",
            "value": 10
        },
        {
            "hc-key": "de-st-15083000",
            "value": 11
        },
        {
            "hc-key": "de-st-15003000",
            "value": 12
        },
        {
            "hc-key": "de-st-15084000",
            "value": 13
        },
        {
            "hc-key": "de-st-15091000",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-st-all.js">Sachsen-Anhalt</a>'
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
            mapData: Highcharts.maps['countries/de/de-st-all'],
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
