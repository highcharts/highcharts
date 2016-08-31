$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-nh",
            "value": 0
        },
        {
            "hc-key": "nl-fr",
            "value": 1
        },
        {
            "hc-key": "be-bu",
            "value": 2
        },
        {
            "hc-key": "nl-gr",
            "value": 3
        },
        {
            "hc-key": "nl-fl",
            "value": 4
        },
        {
            "hc-key": "nl-ze",
            "value": 5
        },
        {
            "hc-key": "be-3528",
            "value": 6
        },
        {
            "hc-key": "be-3529",
            "value": 7
        },
        {
            "hc-key": "be-489",
            "value": 8
        },
        {
            "hc-key": "lu-di",
            "value": 9
        },
        {
            "hc-key": "lu-gr",
            "value": 10
        },
        {
            "hc-key": "lu-lu",
            "value": 11
        },
        {
            "hc-key": "nl-nb",
            "value": 12
        },
        {
            "hc-key": "nl-ut",
            "value": 13
        },
        {
            "hc-key": "nl-zh",
            "value": 14
        },
        {
            "hc-key": "nl-dr",
            "value": 15
        },
        {
            "hc-key": "nl-ge",
            "value": 16
        },
        {
            "hc-key": "nl-li",
            "value": 17
        },
        {
            "hc-key": "be-vb",
            "value": 18
        },
        {
            "hc-key": "be-490",
            "value": 19
        },
        {
            "hc-key": "nl-ov",
            "value": 20
        },
        {
            "hc-key": "be-3526",
            "value": 21
        },
        {
            "hc-key": "be-3527",
            "value": 22
        },
        {
            "hc-key": "be-3535",
            "value": 23
        },
        {
            "hc-key": "be-ov",
            "value": 24
        },
        {
            "hc-key": "be-3534",
            "value": 25
        },
        {
            "value": 26
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/benelux.js">Benelux</a>'
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
            mapData: Highcharts.maps['custom/benelux'],
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
