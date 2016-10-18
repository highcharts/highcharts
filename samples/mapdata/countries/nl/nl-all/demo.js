$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-fr",
            "value": 0
        },
        {
            "hc-key": "nl-gr",
            "value": 1
        },
        {
            "hc-key": "nl-fl",
            "value": 2
        },
        {
            "hc-key": "nl-ze",
            "value": 3
        },
        {
            "hc-key": "nl-nh",
            "value": 4
        },
        {
            "hc-key": "nl-zh",
            "value": 5
        },
        {
            "hc-key": "nl-dr",
            "value": 6
        },
        {
            "hc-key": "nl-ge",
            "value": 7
        },
        {
            "hc-key": "nl-li",
            "value": 8
        },
        {
            "hc-key": "nl-ov",
            "value": 9
        },
        {
            "hc-key": "nl-nb",
            "value": 10
        },
        {
            "hc-key": "nl-ut",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-all.js">The Netherlands</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-all'],
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
