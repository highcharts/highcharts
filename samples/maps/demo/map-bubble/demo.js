
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/world-population.json', function (data) {

    // Correct UK to GB in data
    $.each(data, function () {
        if (this.code === 'UK') {
            this.code = 'GB';
        }
    });

    Highcharts.mapChart('container', {
        chart: {
            borderWidth: 1,
            map: 'custom/world'
        },

        title: {
            text: 'World population 2013 by country'
        },

        subtitle: {
            text: 'Demo of Highcharts map with bubbles'
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

        series: [{
            name: 'Countries',
            color: '#E0E0E0',
            enableMouseTracking: false
        }, {
            type: 'mapbubble',
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
