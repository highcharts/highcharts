$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=world-population.json&callback=?', function (data) {

        var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);

        // Correct UK to GB in data
        $.each(data, function () {
            if (this.code === 'UK') {
                this.code = 'GB';
            }
        });

        $('#container').highcharts('Map', {
            chart : {
                borderWidth : 1
            },

            title: {
                text: 'World population 2013 by country'
            },

            subtitle : {
                text : 'Demo of Highcharts map with bubbles'
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
                mapData: mapData,
                color: '#E0E0E0',
                enableMouseTracking: false
            }, {
                type: 'mapbubble',
                mapData: mapData,
                name: 'Population 2013',
                joinBy: ['iso-a2', 'code'],
                data: data,
                minSize: 4,
                maxSize: '12%',
                tooltip: {
                    pointFormat: '{point.code}: {point.z} thousands'
                }
            }]
        });

    });
});