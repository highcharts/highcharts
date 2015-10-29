$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-fi-2002",
            "value": 0
        },
        {
            "hc-key": "no-fi-2019",
            "value": 1
        },
        {
            "hc-key": "no-fi-2030",
            "value": 2
        },
        {
            "hc-key": "no-fi-2018",
            "value": 3
        },
        {
            "hc-key": "no-fi-2014",
            "value": 4
        },
        {
            "hc-key": "no-fi-2020",
            "value": 5
        },
        {
            "hc-key": "no-fi-2015",
            "value": 6
        },
        {
            "hc-key": "no-fi-2017",
            "value": 7
        },
        {
            "hc-key": "no-tr-2012",
            "value": 8
        },
        {
            "hc-key": "no-fi-2004",
            "value": 9
        },
        {
            "hc-key": "no-fi-2027",
            "value": 10
        },
        {
            "hc-key": "no-fi-2025",
            "value": 11
        },
        {
            "hc-key": "no-fi-2011",
            "value": 12
        },
        {
            "hc-key": "no-fi-2022",
            "value": 13
        },
        {
            "hc-key": "no-fi-2024",
            "value": 14
        },
        {
            "hc-key": "no-fi-2021",
            "value": 15
        },
        {
            "hc-key": "no-fi-2023",
            "value": 16
        },
        {
            "hc-key": "no-fi-2028",
            "value": 17
        },
        {
            "hc-key": "no-fi-2003",
            "value": 18
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-fi-all.js">Finnmark</a>'
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
            mapData: Highcharts.maps['countries/no/no-fi-all'],
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
