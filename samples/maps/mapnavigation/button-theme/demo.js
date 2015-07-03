$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=world-population-density.json&callback=?', function (data) {

        // Instanciate the map
        $('#container').highcharts('Map', {
            title: {
                text: 'World population 2010 by country'
            },

            subtitle : {
                text : 'Demo of map button theming'
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
                                fill: '#bada55'
                            },
                            select: {
                                stroke: '#039',
                                fill: '#bada55'
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

            series : [{
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
});