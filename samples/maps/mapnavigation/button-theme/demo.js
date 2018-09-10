

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Instanciate the map
    Highcharts.mapChart('container', {
        title: {
            text: 'World population 2010 by country'
        },

        subtitle: {
            text: 'Demo of map button theming'
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                theme: {
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#a4edba'
                        },
                        select: {
                            stroke: '#039',
                            fill: '#a4edba'
                        }
                    }
                },
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            minColor: '#efecf3',
            maxColor: '#990041',
            startOnTick: false,
            endOnTick: false,
            type: 'logarithmic'
        },

        series: [{
            name: 'Population',
            mapData: Highcharts.maps['custom/world'],
            data: data,
            joinBy: ['iso-a2', 'code'],
            tooltip: {
                pointFormat: '{point.code}: {point.value:,f},000'
            }
        }]
    });
});