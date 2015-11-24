$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bg-vt",
            "value": 0
        },
        {
            "hc-key": "bg-mt",
            "value": 1
        },
        {
            "hc-key": "bg-vr",
            "value": 2
        },
        {
            "hc-key": "bg-ky",
            "value": 3
        },
        {
            "hc-key": "bg-vd",
            "value": 4
        },
        {
            "hc-key": "bg-br",
            "value": 5
        },
        {
            "hc-key": "bg-ya",
            "value": 6
        },
        {
            "hc-key": "bg-tu",
            "value": 7
        },
        {
            "hc-key": "bg-rg",
            "value": 8
        },
        {
            "hc-key": "bg-sh",
            "value": 9
        },
        {
            "hc-key": "bg-do",
            "value": 10
        },
        {
            "hc-key": "bg-vn",
            "value": 11
        },
        {
            "hc-key": "bg-si",
            "value": 12
        },
        {
            "hc-key": "bg-rs",
            "value": 13
        },
        {
            "hc-key": "bg-bl",
            "value": 14
        },
        {
            "hc-key": "bg-sl",
            "value": 15
        },
        {
            "hc-key": "bg-sz",
            "value": 16
        },
        {
            "hc-key": "bg-kk",
            "value": 17
        },
        {
            "hc-key": "bg-pd",
            "value": 18
        },
        {
            "hc-key": "bg-pz",
            "value": 19
        },
        {
            "hc-key": "bg-sm",
            "value": 20
        },
        {
            "hc-key": "bg-kz",
            "value": 21
        },
        {
            "hc-key": "bg-sf",
            "value": 22
        },
        {
            "hc-key": "bg-sg",
            "value": 23
        },
        {
            "hc-key": "bg-pn",
            "value": 24
        },
        {
            "hc-key": "bg-gb",
            "value": 25
        },
        {
            "hc-key": "bg-lv",
            "value": 26
        },
        {
            "hc-key": "bg-pv",
            "value": 27
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bg/bg-all.js">Bulgaria</a>'
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
            mapData: Highcharts.maps['countries/bg/bg-all'],
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
