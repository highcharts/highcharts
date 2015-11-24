$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {

        $('#container').highcharts('Map', {
            chart : {
                borderWidth : 1
            },

            title: {
                text: 'World population 2010 by country'
            },

            subtitle : {
                text : 'Click bubbles to select'
            },

            legend: {
                enabled: false
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            series : [{
                name: 'Countries',
                mapData: Highcharts.maps['custom/world'],
                color: '#E0E0E0',
                enableMouseTracking: false
            }, {
                type: 'mapbubble',
                animation: false,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                data: data,
                name: 'Population 2010',
                minSize: 4,
                maxSize: '12%',
                tooltip: {
                    pointFormat: '{point.code}: {point.z} thousands'
                }
            }]
        });

    });
});