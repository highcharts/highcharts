const data = [
    // Name, Arrivals (M), Population (M)
    { name: 'France', z: 93.2, y: 68.0 },
    { name: 'Spain', z: 71.7, y: 47.8 },
    { name: 'United States of America', z: 50.9, y: 333.3 },
    { name: 'Turkey', z: 50.5, y: 85.0 },
    { name: 'Italy', z: 49.9, y: 58.9 },
    { name: 'Mexico', z: 38.3, y: 127.5 },
    { name: 'United Kingdom', z: 30.7, y: 67.0 },
    { name: 'Germany', z: 28.5, y: 83.8 },
    { name: 'Greece', z: 27.8, y: 10.4 },
    { name: 'Austria', z: 26.2, y: 9.0 }
];

function getGraticule() {
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
}

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

        function rotation(countryName) {
            const countryProperties = countries.find(
                g => g.properties.name === countryName
            ).properties;
            return [
                -countryProperties['hc-middle-lon'],
                -countryProperties['hc-middle-lat']
            ];
        }

        const chart = Highcharts.mapChart('container', {
            chart: {
                map: topology,
                events: {
                    load() {
                        const chart = this;
                        chart.rotateToCountry = function (countryName) {
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
                            Highcharts.animate(
                                chart.renderer.boxWrapper,
                                { animator: 999 },
                                {
                                    duration: 1000,
                                    step: now => {
                                        const rotation =
                                            geodesic[Math.round(now)];
                                        chart.mapView.update(
                                            {
                                                projection: {
                                                    rotation
                                                },
                                                center: [0, 0]
                                            },
                                            true,
                                            false
                                        );
                                    }
                                }
                            );
                        };

                        chart.findCountry = function (countryName) {
                            return this.series[1].data.find(
                                p => p.name === countryName
                            );
                        };
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
                text: `By arrivals. Sources: <a href="https://www.unwto.org/
                tourism-data/global-and-regional-tourism-performance" target=
                "_blank">UNWTO</a> and <a href="https://databank.worldbank.org/
                reports.aspx?source=2&series=SP.POP.TOTL&year=2022" target=
                "_blank">World Bank</a>.`
            },

            caption: {
                text: `Interactive variable pie chart indicating the top ten 
                countries in terms of tourist arrivals in 2022. <strong>Click 
                a slice to rotate the globe to the corresponding country
                </strong>. Slice heights indicate tourist arrivals in millions
                , while widths indicate arrivals per capita.`,
                align: 'center',
                margin: 0
            },

            legend: {
                enabled: false
            },

            mapView: {
                maxZoom: 1.5,
                projection: {
                    name: 'Orthographic',
                    rotation: rotation('France')
                }
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        style: {
                            color: '#071436'
                        }
                    },
                    animation: {
                        duration: 1000
                    }
                }
            },

            tooltip: {
                enabled: false,
                backgroundColor: 'none',
                shadow: false,
                headerFormat:
                    `<span style="font-size: 24px; font-weight: 600; 
                    color: #071436">{point.key}</span><br/><br/>`,
                pointFormat:
                    `<span style="font-size: 16px; font-weight: 600; 
                    color: #071436">Arrivals: <b>{point.z}M</b><br/>
                    Arrivals per capita: <b>{point.y}</b></span>`,
                positioner: function (labelWidth) {
                    return {
                        x: chart.plotBox.width / 2 - labelWidth * 1.1,
                        y: 120
                    };
                }
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
                            opacity: 1
                        }
                    },
                    shadow: {
                        color: 'white',
                        width: 4
                    }
                },
                {
                    name: 'Map',
                    data: mapData,
                    keys: ['hc-key', 'id'],
                    nullInteraction: true,
                    enableMouseTracking: false,
                    borderColor: '#215DFC',
                    borderWidth: 0.5,
                    color: '#071436',
                    dataLabels: {
                        enabled: false
                    },
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
                    cursor: 'pointer',
                    innerSize: '50%',
                    center: ['50%', '50%'],
                    borderColor: '#000',
                    endAngle: 270,
                    zMin: 25,
                    borderRadius: 3,
                    data: data.map(c => ({
                        ...c,
                        y: Math.round((100 * c.z) / c.y) / 100
                    })),

                    dataLabels: {
                        style: {
                            fontSize: 18
                        }
                    },
                    label: {
                        onArea: true
                    },
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
                            click() {
                                const point = this;

                                if (point.selected) {
                                    point.series.chart.tooltip.refresh(point);
                                }
                                chart.tooltip.refresh(
                                    chart.series[2].points[point.index]
                                );

                                const countryName = point.name;

                                if (countryName !== chart.selectedCountry) {
                                    const mapPoint =
                                        chart.findCountry(countryName);
                                    mapPoint.update({
                                        color: '#FCED33'
                                    });
                                    if (chart.selectedCountry) {
                                        chart
                                            .findCountry(chart.selectedCountry)
                                            .update({ color: null });
                                    }
                                    chart.selectedCountry = countryName;
                                    chart.rotateToCountry(countryName);
                                }
                            },
                            select() {
                                chart.update({
                                    tooltip: {
                                        enabled: true,
                                        hideDelay: 9999999999
                                    }
                                });
                            },
                            unselect(e) {
                                if (chart.selectedCountry === e.target.name) {
                                    chart.update({
                                        tooltip: {
                                            enabled: false
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            ]
        });

        function renderSea() {
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
        }

        renderSea();
        Highcharts.addEvent(chart, 'redraw', renderSea);
    }
);
