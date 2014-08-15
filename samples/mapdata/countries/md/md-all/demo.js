$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "md-le",
            "value": 0
        },
        {
            "hc-key": "md-ni",
            "value": 1
        },
        {
            "hc-key": "md-1605",
            "value": 2
        },
        {
            "hc-key": "md-oh",
            "value": 3
        },
        {
            "hc-key": "md-2266",
            "value": 4
        },
        {
            "hc-key": "md-rz",
            "value": 5
        },
        {
            "hc-key": "md-st",
            "value": 6
        },
        {
            "hc-key": "md-te",
            "value": 7
        },
        {
            "hc-key": "md-2267",
            "value": 8
        },
        {
            "hc-key": "md-cu",
            "value": 9
        },
        {
            "hc-key": "md-bd",
            "value": 10
        },
        {
            "hc-key": "md-sv",
            "value": 11
        },
        {
            "hc-key": "md-sd",
            "value": 12
        },
        {
            "hc-key": "md-so",
            "value": 13
        },
        {
            "hc-key": "md-do",
            "value": 14
        },
        {
            "hc-key": "md-ed",
            "value": 15
        },
        {
            "hc-key": "md-br",
            "value": 16
        },
        {
            "hc-key": "md-oc",
            "value": 17
        },
        {
            "hc-key": "md-rs",
            "value": 18
        },
        {
            "hc-key": "md-bt",
            "value": 19
        },
        {
            "hc-key": "md-dr",
            "value": 20
        },
        {
            "hc-key": "md-fa",
            "value": 21
        },
        {
            "hc-key": "md-gl",
            "value": 22
        },
        {
            "hc-key": "md-si",
            "value": 23
        },
        {
            "hc-key": "md-ug",
            "value": 24
        },
        {
            "hc-key": "md-ch",
            "value": 25
        },
        {
            "hc-key": "md-ta",
            "value": 26
        },
        {
            "hc-key": "md-ga",
            "value": 27
        },
        {
            "hc-key": "md-cv",
            "value": 28
        },
        {
            "hc-key": "md-an",
            "value": 29
        },
        {
            "hc-key": "md-ba",
            "value": 30
        },
        {
            "hc-key": "md-cn",
            "value": 31
        },
        {
            "hc-key": "md-ca",
            "value": 32
        },
        {
            "hc-key": "md-cs",
            "value": 33
        },
        {
            "hc-key": "md-cr",
            "value": 34
        },
        {
            "hc-key": "md-fl",
            "value": 35
        },
        {
            "hc-key": "md-du",
            "value": 36
        },
        {
            "hc-key": "md-db",
            "value": 37
        },
        {
            "hc-key": "md-hi",
            "value": 38
        },
        {
            "hc-key": "md-ia",
            "value": 39
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/md/md-all.js">Moldova</a>'
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
            mapData: Highcharts.maps['countries/md/md-all'],
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
