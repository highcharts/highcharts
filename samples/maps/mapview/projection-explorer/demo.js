(async () => {

    // Get random data for this sample
    function getRandomData(topology) {
        return topology.objects.default.geometries.map(() =>
            Math.round(Math.random() * 100));
    }

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const antarctica = await fetch(
        'https://code.highcharts.com/mapdata/custom/antarctica.topo.json'
    ).then(response => response.json());

    const data = getRandomData(topology);

    // Get the graticule, the grid of meridians an parallels.
    function getGraticule() {
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

        // Parallels
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
    }

    let chart;

    const drawMap = projectionKey => {

        // Apply projection
        const projection = Highcharts.merge({
            name: undefined
        }, {
            equalearth: {
                name: 'EqualEarth',
                projectedBounds: 'world'
            },
            lcc: {
                name: 'LambertConformalConic',
                parallels: [30, 40],
                projectedBounds: { x1: -200, y1: -200, x2: 200, y2: 200 }
            },
            miller: {
                name: 'Miller',
                projectedBounds: 'world'
            },
            'ortho-africa': {
                name: 'Orthographic',
                rotation: [-15, 0],
                projectedBounds: 'world'
            },
            'ortho-antarctica': {
                name: 'Orthographic',
                rotation: [0, 90],
                projectedBounds: 'world'
            },
            'ortho-asia': {
                name: 'Orthographic',
                rotation: [-90, -40],
                projectedBounds: 'world'
            },
            'ortho-australia': {
                name: 'Orthographic',
                rotation: [-140, 30],
                projectedBounds: 'world'
            },
            'ortho-europe': {
                name: 'Orthographic',
                rotation: [-15, -40],
                projectedBounds: 'world'
            },
            'ortho-north-america': {
                name: 'Orthographic',
                rotation: [100, -45],
                projectedBounds: 'world'
            },
            'ortho-south-america': {
                name: 'Orthographic',
                rotation: [60, 10],
                projectedBounds: 'world'
            },
            webmerc: {
                name: 'WebMercator',
                projectedBounds: 'world'
            }
        }[projectionKey] || {});

        // Ortho, pre-rotated views
        if (projection.rotation) {
            document.getElementById('rotation-lambda').value =
                projection.rotation[0] || 0;
            document.getElementById('rotation-phi').value =
                projection.rotation[1] || 0;
            document.getElementById('rotation-gamma').value =
                projection.rotation[2] || 0;

        // Otherwise, keep the rotation
        } else {
            projection.rotation = [
                parseInt(document.getElementById('rotation-lambda').value, 10),
                parseInt(document.getElementById('rotation-phi').value, 10),
                parseInt(document.getElementById('rotation-gamma').value, 10)
            ];
        }

        // Initialize the chart
        if (!chart) {

            console.time('@mapChart');

            chart = Highcharts.mapChart('container', {
                chart: {
                    map: topology
                },

                title: {
                    text: 'Highcharts Projection Explorer',
                    floating: true,
                    align: 'left',
                    style: {
                        textOutline: '2px white'
                    }
                },

                legend: {
                    enabled: false
                },

                mapNavigation: {
                    enabled: true,
                    enableDoubleClickZoomTo: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                mapView: {
                    projection
                    /*
                    projection: {
                        name: 'WebMercator'
                    },
                    zoom: 4,
                    center: [6.5, 61]
                    */
                },

                colorAxis: {
                    tickPixelInterval: 100,
                    minColor: '#F1EEF6',
                    maxColor: '#900037'
                },

                tooltip: {
                    pointFormat: '{point.name}: {point.value}'
                },

                plotOptions: {
                    series: {
                        animationLimit: 500
                    }
                },

                series: [{
                    name: 'Graticule',
                    type: 'mapline',
                    data: getGraticule(),
                    nullColor: '#e8e8e8',
                    color: '#e8e8e8'
                }, {
                    data,
                    joinBy: null,
                    name: 'Random data',
                    states: {
                        hover: {
                            color: '#a4edba',
                            borderColor: '#333333'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.name}'
                    },
                    clip: false
                }, {
                    mapData: antarctica,
                    allAreas: true,
                    name: 'Antarctica',
                    clip: false,
                    opacity: 0.75
                }, {
                    type: 'mapline',
                    data: [{
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [4.90, 53.38], // Amsterdam
                                [-118.24, 34.05] // Los Angeles
                            ]
                        },
                        color: '#3030d0'
                    }],
                    lineWidth: 2
                }, {
                    type: 'mappoint',
                    data: [{
                        geometry: {
                            type: 'Point',
                            coordinates: [4.90, 53.38]
                        },
                        name: 'Amsterdam'
                    }, {
                        geometry: {
                            type: 'Point',
                            coordinates: [-118.24, 34.05]
                        },
                        name: 'LA'
                    }],
                    color: '#3030d0'
                }]
            });
            console.timeEnd('@mapChart');


        } else {
            chart.update({
                mapView: {
                    projection
                }
            });
        }

        document.querySelectorAll('#projection-buttons button').forEach(btn =>
            btn.classList.remove('active')
        );
        document.querySelector(`#projection-buttons #${projectionKey}`).classList.add('active');
    };


    const enableInputs = () => {
        document.querySelectorAll('#projection-buttons button').forEach(btn =>
            btn.addEventListener('click', e => drawMap(e.target.id))
        );
        document.querySelectorAll('.rotation').forEach(input => {
            input.addEventListener('input', () => {
                const lambda = document.getElementById('rotation-lambda').value;
                const phi = document.getElementById('rotation-phi').value;
                const gamma = document.getElementById('rotation-gamma').value;
                document.getElementById('rotation-lambda-output')
                    .innerText = lambda;
                document.getElementById('rotation-phi-output').innerText = phi;
                document.getElementById('rotation-gamma-output').innerText = gamma;

                const rotation = chart.mapView.projection.options.rotation ||
                    [0, 0];
                rotation[0] = parseInt(lambda, 10);
                rotation[1] = parseInt(phi, 10);
                rotation[2] = parseInt(gamma, 10);
                chart.mapView.update({
                    projection: {
                        rotation
                    }
                }, true, false);
            });
        });
    };

    drawMap('equalearth');

    enableInputs();
})();