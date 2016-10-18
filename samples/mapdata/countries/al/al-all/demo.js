$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "al-vr",
            "value": 0
        },
        {
            "hc-key": "al-ke",
            "value": 1
        },
        {
            "hc-key": "al-du",
            "value": 2
        },
        {
            "hc-key": "al-fi",
            "value": 3
        },
        {
            "hc-key": "al-sd",
            "value": 4
        },
        {
            "hc-key": "al-kk",
            "value": 5
        },
        {
            "hc-key": "al-be",
            "value": 6
        },
        {
            "hc-key": "al-eb",
            "value": 7
        },
        {
            "hc-key": "al-gk",
            "value": 8
        },
        {
            "hc-key": "al-db",
            "value": 9
        },
        {
            "hc-key": "al-lz",
            "value": 10
        },
        {
            "hc-key": "al-ti",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/al/al-all.js">Albania</a>'
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
            mapData: Highcharts.maps['countries/al/al-all'],
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
