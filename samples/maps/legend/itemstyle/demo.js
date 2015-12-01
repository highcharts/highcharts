$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {


        // Initiate the chart
        $('#container').highcharts('Map', {
            chart : {
                borderWidth : 1
            },

            title : {
                text : 'Legend item style'
            },

            mapNavigation: {
                enabled: true
            },

            legend: {
                title: {
                    text: 'Individuals per km²'
                },
                align: 'left',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: 'rgba(255,255,255,0.9)',
                itemStyle: {
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    color: 'gray',
                    textDecoration: 'none'
                },
                itemHoverStyle: {
                    textDecoration: 'underline'
                }
            },

            colorAxis: {
                dataClasses: [{
                    to: 3,
                    color: 'rgba(19,64,117,0.05)'
                }, {
                    from: 3,
                    to: 10,
                    color: 'rgba(19,64,117,0.2)'
                }, {
                    from: 10,
                    to: 30,
                    color: 'rgba(19,64,117,0.4)'
                }, {
                    from: 30,
                    to: 100,
                    color: 'rgba(19,64,117,0.5)'
                }, {
                    from: 100,
                    to: 300,
                    color: 'rgba(19,64,117,0.6)'
                }, {
                    from: 300,
                    to: 1000,
                    color: 'rgba(19,64,117,0.8)'
                }, {
                    from: 1000,
                    color: 'rgba(19,64,117,1)'
                }]
            },

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });
    });
});