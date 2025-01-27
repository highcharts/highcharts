(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const getGraticule = () => {
        const data = [];

        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: x % 90 === 0 ? [
                        [x, -90],
                        [x, 0],
                        [x, 90]
                    ] : [
                        [x, -80],
                        [x, 80]
                    ]
                }
            });
        }

        // Latitudes
        for (let y = -90; y <= 90; y += 10) {
            const coordinates = [];
            for (let x = -180; x <= 180; x += 5) {
                coordinates.push([x, y]);
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates
                },
                lineWidth: y === 0 ? 2 : undefined
            });
        }
        return data;
    };


    const chart = Highcharts.mapChart('container', {
        chart: {
            map: topology,
            events: {
                load: function () {
                    const chart = this;

                    // initialize custom labels
                    chart.customLonText = chart.renderer.text(
                        `Longitude:
                            ${chart.series[2].points[0].lon.toFixed(3)}`,
                        10, 450
                    )
                        .css({
                            fontSize: '14px'
                        })
                        .add();

                    chart.customLatText = chart.renderer.text(
                        `Latitude:
                            ${chart.series[2].points[0].lat.toFixed(3)}`,
                        10, 470
                    )
                        .css({
                            fontSize: '14px'
                        })
                        .add();
                },
                render: function () {
                    const chart = this;

                    // set new values from draggable point
                    chart.customLonText.attr({
                        text: `Longitude:
                            ${chart.series[2].points[0].lon.toFixed(3)}`
                    });
                    chart.customLatText.attr({
                        text: `Latitude:
                            ${chart.series[2].points[0].lat.toFixed(3)}`
                    });
                }
            }
        },

        title: {
            text: 'Draggable Map Point',
            align: 'left'
        },

        subtitle: {
            text: 'Click and drag the marker to change the map point ' +
                'position <br> Click and drag anywhere else to rotate ' +
                'globe<br>',
            align: 'left'
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },

        mapView: {
            maxZoom: 30,
            projection: {
                name: 'Orthographic',
                rotation: [0, -20]
            }
        },

        tooltip: {
            enabled: false
        },

        plotOptions: {
            series: {
                animation: {
                    duration: 750
                },
                clip: false,
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            }
        },

        series: [{
            name: 'Graticule',
            id: 'graticule',
            type: 'mapline',
            data: getGraticule(),
            nullColor: 'rgba(0, 0, 0, 0.05)',
            accessibility: {
                enabled: false
            },
            enableMouseTracking: false
        }, {
            name: 'Countries',
            nullColor: '#aec584',
            borderColor: '#66a758',
            dataLabels: {
                enabled: false
            },
            accessibility: {
                enabled: false
            }
        }, {
            name: 'Draggable Points',
            type: 'mappoint',
            color: '#fbd304',
            marker: {
                radius: 10,
                lineWidth: 1,
                lineColor: '#564801',
                symbol: 'mapmarker'
            },
            dragDrop: {
                draggableX: true,
                draggableY: true
            },
            data: [{
                lat: 20,
                lon: 0
            }]
        }]
    });

    // Render a circle filled with a radial gradient behind the globe to
    // make it appear as the sea around the continents
    const renderSea = () => {
        let verb = 'animate';
        if (!chart.sea) {
            chart.sea = chart.renderer
                .circle()
                .attr({
                    fill: {
                        radialGradient: {
                            cx: 0.4,
                            cy: 0.4,
                            r: 1
                        },
                        stops: [
                            [0, 'white'],
                            [1, 'lightblue']
                        ]
                    },
                    zIndex: -1
                })
                .add(chart.get('graticule').group);
            verb = 'attr';
        }

        const bounds = chart.get('graticule').bounds,
            p1 = chart.mapView.projectedUnitsToPixels({
                x: bounds.x1,
                y: bounds.y1
            }),
            p2 = chart.mapView.projectedUnitsToPixels({
                x: bounds.x2,
                y: bounds.y2
            });
        chart.sea[verb]({
            cx: (p1.x + p2.x) / 2,
            cy: (p1.y + p2.y) / 2,
            r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
        });
    };
    renderSea();
    Highcharts.addEvent(chart, 'redraw', renderSea);

})();