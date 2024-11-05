const data = [
    // Name, Arrivals (M), Population (M)
    { name: 'France', arrivals: 93.2, population: 68.0 },
    { name: 'Spain', arrivals: 71.7, population: 47.8 },
    { name: 'United States of America', arrivals: 50.9, population: 333.3 },
    { name: 'Turkey', arrivals: 50.5, population: 85.0 },
    { name: 'Italy', arrivals: 49.9, population: 58.9 },
    { name: 'Mexico', arrivals: 38.3, population: 127.5 },
    { name: 'United Kingdom', arrivals: 30.7, population: 67.0 },
    { name: 'Germany', arrivals: 28.5, population: 83.8 },
    { name: 'Greece', arrivals: 27.8, population: 10.4 },
    { name: 'Austria', arrivals: 26.2, population: 9.0 }
];

const getGraticule = () => {
    const data = [];

    // Meridians
    for (let x = -180; x <= 180; x += 15) {
        data.push({
            geometry: {
                type: 'LineString',
                coordinates:
                    x % 90 === 0 ?
                        [
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
            lineWidth: y === 0 ? 1 : undefined
        });
    }

    return data;
};

Highcharts.getJSON(
    'https://code.highcharts.com/mapdata/custom/world-highres.topo.json',
    topology => {
        const mapData = topology.objects.default.geometries.map(country => [
            country.properties['hc-key'],
            country.id
        ]);

        const countries = topology.objects.default.geometries.filter(el =>
            data.map(c => c.name).includes(el.properties.name)
        );

        const rotation = countryName => {
            const countryProperties = countries.find(
                g => g.properties.name === countryName
            ).properties;
            return [
                -countryProperties['hc-middle-lon'],
                -countryProperties['hc-middle-lat']
            ];
        };

        const chart = Highcharts.mapChart('container', {
            chart: {
                map: topology,
                events: {
                    load() {
                        const chart = this;
                        chart.rotateToCountry = countryName => {
                            const point1 =
                                    chart.mapView.projection.options.rotation,
                                point2 = rotation(countryName),
                                distance = Highcharts.Projection.distance(
                                    point1,
                                    point2
                                );

                            if (!distance) {
                                return;
                            }
                            const stepDistance = distance / 1000,
                                geodesic = Highcharts.Projection.geodesic(
                                    chart.mapView.projection.options.rotation,
                                    rotation(countryName),
                                    true,
                                    stepDistance
                                );

                            chart.renderer.boxWrapper.animator = 0;

                            const animateGlobe = () => new Promise(resolve => {
                                Highcharts.animate(
                                    chart.renderer.boxWrapper,
                                    { animator: 999 },
                                    {
                                        duration: 1000,
                                        step: (now, fx) => {
                                            const rotation =
                                                geodesic[Math.round(now)];
                                            chart.mapView.update(
                                                {
                                                    projection: {
                                                        rotation
                                                    }
                                                },
                                                true,
                                                false
                                            );

                                            // Resolve after animation
                                            if (fx.pos === 1) {
                                                resolve();
                                            }
                                        }
                                    }
                                );
                            });

                            // Set rotation state as chart property
                            (async () => {
                                chart.isRotating = true;
                                await animateGlobe();
                                chart.isRotating = false;
                            })();
                        };

                        chart.findCountry = countryName =>
                            this.series[1].data.find(
                                p => p.name === countryName
                            );
                    },
                    redraw() {
                        const chart = this;
                        chart.renderSea?.();
                    },
                    render() {
                        const chart = this,
                            renderer = chart.renderer;

                        // Responsive rules cause the render event to happen
                        // before load event, therefore we need to create
                        // these functions on the render event instead.

                        if (!chart.renderSea) {
                        // Render a circle filled with a radial
                        // gradient behind the globe to make it
                        // appear as the sea around the continents
                            chart.renderSea = () => {
                                let verb = 'animate';
                                if (!chart.sea) {
                                    chart.sea = renderer
                                        .circle()
                                        .attr({
                                            fill: {
                                                radialGradient: {
                                                    cx: 0.4,
                                                    cy: 0.4,
                                                    r: 1
                                                },
                                                stops: [
                                                    [0, '#fff'],
                                                    [1, '#FCED33']
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
                            chart.renderSea();
                        }

                        if (!chart.getStickyLabel) {
                            chart.getStickyLabel = () => {
                                const point = chart.getSelectedPoints()[0],
                                    countryName = point.name,
                                    text = `<b>${countryName}</b>
                            <br/>Arrivals: <b>${point.z}M</b>
                            <br/>Arrivals per capita:
                            <b>${point.y}</b>`;

                                if (!chart.sticky) {
                                    chart.sticky = renderer
                                        .label()
                                        .css({
                                            color: '#071436'
                                        })
                                        .add();
                                }

                                chart.sticky.attr({
                                    text
                                });
                            };
                        }

                        // Avoid rerendering while chart is rotating
                        if (!chart.isRotating || chart.justSelectedPoint) {
                            chart.justSelectedPoint = false;
                            const pieSeries = chart.series[2],
                                [
                                    centerX, centerY, d, innerD
                                ] = pieSeries.center,
                                innerR = innerD / 2,
                                r = d / 2,
                                cx = centerX + chart.plotLeft,
                                cy = centerY + chart.plotTop,
                                fontSize = innerR > 85 ? '1em' : '0.8em';

                            // Adding "axes" to indicate what type
                            // of data is in the variable pie series
                            chart.customAxes?.destroy();
                            chart.customAxes = renderer.g().attr({
                                fill: '#071436'
                            }).add();

                            // Radial axis
                            const radialAxis = renderer.path([
                                'M', cx - 1, cy - innerR, 'L', cx - 1, cy - r
                            ]).attr({
                                stroke: '#071436',
                                'stroke-width': 2
                            }).add(chart.customAxes);

                            // Radial axis title
                            renderer.text(
                                'Arrivals'
                            ).setTextPath(radialAxis, {
                                attributes: {
                                    dy: -8
                                }
                            }).attr({
                                'font-size': fontSize,
                                'font-weight': 'bold'
                            }).add(chart.customAxes);

                            // Angular axis
                            const AngularAxisR = innerR + 1;
                            renderer.path([
                                'M', cx - AngularAxisR, cy, 'A', AngularAxisR,
                                AngularAxisR, 0, 0, 1, cx, cy - AngularAxisR
                            ]).attr({
                                stroke: '#071436',
                                'stroke-width': 2
                            }).add(chart.customAxes);

                            // Angular axis title
                            const AngularAxisTitleR = AngularAxisR + 3;
                            const AngularAxisTitlePath = renderer.path([
                                'M', cx - AngularAxisTitleR, cy, 'A',
                                AngularAxisTitleR, AngularAxisTitleR,
                                0, 0, 1, cx, cy - AngularAxisTitleR
                            ]).add(chart.customAxes);

                            renderer.text('Per capita')
                                .setTextPath(AngularAxisTitlePath, {
                                }).attr({
                                    'font-size': fontSize,
                                    'font-weight': 'bold'
                                })
                                .add(chart.customAxes);

                            if (chart.getSelectedPoints().length === 1) {
                                chart.getStickyLabel();

                                // Align sticky label
                                chart.sticky.css({
                                    fontSize
                                });
                                const labelWidth = chart.sticky.bBox.width,
                                    x = cx - labelWidth - 40;
                                chart.sticky.attr({
                                    x: x > 0 ? x : 0,
                                    y: cy - r
                                });
                            }
                        }
                    }
                }
            },

            credits: {
                enabled: false
            },

            title: {
                text: '2022 Top 10 Countries in Tourism Performance',
                style: {
                    fontSize: '28px',
                    color: '#071436'
                }
            },

            subtitle: {
                text: 'By arrivals. Sources: <a href="https://www.unwto.org/tourism-data/global-and-regional-tourism-performance" target="_blank">UNWTO</a> and <a href="https://databank.worldbank.org/reports.aspx?source=2&series=SP.POP.TOTL&year=2022" target="_blank">World Bank</a>.'
            },

            legend: {
                enabled: false
            },

            mapView: {
                padding: ['39%', '30%', '19%', '30%'],
                projection: {
                    name: 'Orthographic',
                    rotation: rotation('France')
                }
            },

            plotOptions: {
                variablepie: {
                    dataLabels: {
                        style: {
                            color: '#071436',
                            fontSize: '1em'
                        }
                    },
                    includeInDataExport: true
                },
                series: {
                    animation: {
                        duration: 1000
                    },
                    includeInDataExport: false
                }
            },

            exporting: {
                csv: {
                    columnHeaderFormatter: function (_, key) {
                        return key === 'y' ? 'Arrivals per Capita' :
                            key === 'z' ? 'Arrivals (M)' : 'Country';

                    }
                }
            },

            tooltip: {
                style: {
                    color: '#071436',
                    fontSize: '1em'
                },
                headerFormat:
                    `<span style="font-weight: bold">
                    {point.key}</span><br/>`,
                pointFormat:
                    `<span>Arrivals: <b>{point.z}M
                    </b><br/>Arrivals per capita: <b>{point.y}</b></span>`
            },

            series: [
                {
                    name: 'Graticule',
                    id: 'graticule',
                    type: 'mapline',
                    data: getGraticule(),
                    nullColor: '#148a97',
                    accessibility: {
                        enabled: false
                    },
                    enableMouseTracking: false,
                    states: {
                        inactive: {
                            opacity: 0.6
                        }
                    }
                },
                {
                    name: 'Map',
                    data: mapData,
                    keys: ['hc-key', 'id'],
                    accessibility: {
                        enabled: false
                    },
                    enableMouseTracking: false,
                    borderColor: '#215DFC',
                    borderWidth: 0.5,
                    color: '#071436',
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                },
                {
                    name: 'Countries',
                    type: 'variablepie',
                    allowPointSelect: true,
                    slicedOffset: 0,
                    states: {
                        select: {
                            color: '#FCED33'
                        }
                    },
                    inactiveOtherPoints: false,
                    cursor: 'pointer',
                    innerSize: '45%',
                    size: '100%',
                    center: ['50%', '60%'],
                    borderColor: '#071436',
                    endAngle: 270,
                    zMin: 25,
                    borderRadius: 5,
                    data: data.map(pointData => ({
                        name: pointData.name,
                        z: pointData.arrivals,
                        y: Math.round(
                            100 * pointData.arrivals /
                            pointData.population
                        ) / 100,
                        countryID: countries.find(
                            country => country.properties.name ===
                            pointData.name
                        ).id
                    })),
                    colors: [
                        '#1a4aca',
                        '#1e54e3',
                        '#215dfc',
                        '#376dfc',
                        '#4d7dfd',
                        '#648efd',
                        '#7a9efd',
                        '#90aefe',
                        '#a6befe',
                        '#bccefe'
                    ],
                    point: {
                        events: {
                            unselect() {
                                const point = this,
                                    countryName = point.name,
                                    mapPoint =
                                        chart.findCountry(countryName);
                                mapPoint.update({
                                    color: null
                                });

                                if (countryName === chart.selectedCountry) {
                                    chart.sticky = chart.sticky.destroy();
                                }
                            },
                            select() {
                                const point = this,
                                    selectedPoints = chart.getSelectedPoints(),
                                    countryName = point.name,
                                    mapPoint =
                                            chart.findCountry(countryName);
                                mapPoint.update({
                                    color: '#FCED33'
                                }, false);
                                chart.selectedCountry = countryName;
                                chart.justSelectedPoint = true;

                                // Remove previously selected points
                                // from selectedPoints array
                                selectedPoints.forEach(point => {
                                    if (point.name !== countryName) {
                                        point.select(false);
                                    }
                                });

                                // "Reset" view to account for
                                // manual globe rotation
                                // (also initiates chart redraw)
                                chart.mapView.fitToBounds();

                                // Rotate to selected country
                                chart.rotateToCountry(countryName);
                            }
                        }
                    }
                }
            ],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 650
                    },
                    chartOptions: {
                        plotOptions: {
                            variablepie: {
                                dataLabels: {
                                    distance: 5,
                                    connectorColor: 'transparent',
                                    padding: 0,
                                    style: {
                                        fontSize: '1em'
                                    },
                                    format: '{point.countryID}'
                                }
                            }
                        }
                    }
                }]
            }
        });
    }
);
