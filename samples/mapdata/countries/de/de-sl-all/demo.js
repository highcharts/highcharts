$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-sl-10042000",
            "value": 0
        },
        {
            "hc-key": "de-sl-10043000",
            "value": 1
        },
        {
            "hc-key": "de-sl-10044000",
            "value": 2
        },
        {
            "hc-key": "de-sl-10041000",
            "value": 3
        },
        {
            "hc-key": "de-sl-10045000",
            "value": 4
        },
        {
            "hc-key": "de-sl-10046000",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-sl-all.js">Saarland</a>'
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
            mapData: Highcharts.maps['countries/de/de-sl-all'],
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
