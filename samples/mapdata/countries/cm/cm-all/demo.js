$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cm-es",
            "value": 0
        },
        {
            "hc-key": "cm-ad",
            "value": 1
        },
        {
            "hc-key": "cm-nw",
            "value": 2
        },
        {
            "hc-key": "cm-no",
            "value": 3
        },
        {
            "hc-key": "cm-ce",
            "value": 4
        },
        {
            "hc-key": "cm-ou",
            "value": 5
        },
        {
            "hc-key": "cm-en",
            "value": 6
        },
        {
            "hc-key": "cm-sw",
            "value": 7
        },
        {
            "hc-key": "cm-lt",
            "value": 8
        },
        {
            "hc-key": "cm-su",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cm/cm-all.js">Cameroon</a>'
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
            mapData: Highcharts.maps['countries/cm/cm-all'],
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
