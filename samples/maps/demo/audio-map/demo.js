(async () => {
    let sonifyOnHover = false;

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json'
    ).then(response => response.json());

    // Instantiate the map
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },
        title: {
            text: 'France population density (/km²)',
            align: 'left'
        },
        subtitle: {
            text: 'Click a map area to start sonifying as you interact with the map',
            align: 'left'
        },
        sonification: {
            // Play marker / tooltip can make it hard to click other points
            // while a point is playing, so we turn it off
            showTooltip: false
        },
        legend: {
            layout: 'vertical',
            backgroundColor: 'rgba(255,255,255,0.85)',
            floating: true,
            verticalAlign: 'bottom',
            align: 'left',
            symbolHeight: 450
        },
        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic',
            stops: [
                [0, '#0B4C63'],
                [0.5, '#7350BB'],
                [0.7, '#3CD391'],
                [0.9, '#4AA0FF']
            ],
            marker: {
                color: '#343'
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 580
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        floating: false,
                        align: 'center',
                        symbolHeight: 10
                    }
                }
            }]
        },
        tooltip: {
            valueSuffix: '/km²'
        },
        series: [{
            name: 'Population density',
            sonification: {
                tracks: [{
                    // First play a note to indicate new map area
                    instrument: 'vibraphone',
                    mapping: {
                        pitch: 'c7',
                        volume: 0.3
                    }
                }, {
                    mapping: {
                        // Array of notes to play. We just repeat the same note
                        // and vary the gap between the notes to indicate
                        // density. Note: Can use Array.from in modern browsers
                        pitch: Array.apply(null, Array(25)).map(function () {
                            return 'g2';
                        }),
                        gapBetweenNotes: {
                            mapTo: '-value', // Smaller value = bigger gaps
                            min: 90,
                            max: 1000,
                            mapFunction: 'logarithmic'
                        },
                        pan: 0,
                        noteDuration: 500,
                        playDelay: 150 // Make space for initial notification
                    }
                }, {
                    // Speak the name after a while
                    type: 'speech',
                    language: 'fr-FR', // Speak in French, preferably
                    mapping: {
                        text: '{point.name}',
                        volume: 0.4,
                        rate: 1.5,
                        playDelay: 1500
                    }
                }]
            },
            accessibility: {
                point: {
                    valueDescriptionFormat: '{xDescription}, {point.value} people per square kilometer.'
                }
            },
            events: {
                mouseOut: function () {
                    // Cancel sonification when mousing out of point
                    this.chart.sonification.cancel();
                }
            },
            point: {
                // Handle when to sonify and not
                events: {
                    // We require a click before we start playing, so we don't
                    // surprise users. Also some browsers will block audio
                    // until there have been interactions.
                    click: function () {
                        if (!sonifyOnHover) {
                            this.sonify();
                        } else {
                            this.series.chart.sonification.cancel();
                        }
                        sonifyOnHover = !sonifyOnHover;
                    },
                    mouseOver: function () {
                        if (sonifyOnHover) {
                            this.sonify();
                        }
                    }
                }
            },
            cursor: 'pointer',
            borderColor: '#4A5A4A',
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            data: [
                ['fr-hdf', 189],
                ['fr-nor', 111],
                ['fr-idf', 1021],
                ['fr-ges', 97],
                ['fr-bre', 123],
                ['fr-pdl', 119],
                ['fr-cvl', 66],
                ['fr-bfc', 59],
                ['fr-naq', 72],
                ['fr-ara', 115],
                ['fr-occ', 82],
                ['fr-pac', 162],
                ['fr-lre', 344],
                ['fr-may', 1],
                ['fr-gf', 3],
                ['fr-mq', 323],
                ['fr-gua', 236],
                ['fr-cor', 39]
            ]
        }]
    });
})();