$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-fl-gm0050",
            "value": 0
        },
        {
            "hc-key": "nl-fl-gm0995",
            "value": 1
        },
        {
            "hc-key": "nl-fl-gm0171",
            "value": 2
        },
        {
            "hc-key": "nl-fl-gm0303",
            "value": 3
        },
        {
            "hc-key": "nl-fl-gm0034",
            "value": 4
        },
        {
            "hc-key": "nl-fl-gm0184",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-fl-all.js">Flevoland</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-fl-all'],
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
