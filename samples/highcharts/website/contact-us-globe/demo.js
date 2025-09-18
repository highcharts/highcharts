const data = [
    {
        name: 'Norway',
        value: 1
    }
];

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

const afterAnimate = e => {
    const chart = e.target.chart;
    chart.addSeries({
        type: 'mappoint',
        animation: false,
        data: [{
            name: 'Bergen',
            id: 'bergen',
            zIndex: 1,
            lat: 60.3913,
            lon: 5.3221,
            dataLabels: {
                style: {
                    fontSize: 10,
                    fontWeight: 500,
                    textOutline: 'none'
                },
                x: -26,
                y: 14
            },
            marker: {
                enabled: true,
                symbol: 'circle',
                fillColor: '#000',
                lineColor: '#fff',
                lineWidth: 2,
                radius: 4
            }
        },
        {
            name: 'Vik i Sogn (HQ)',
            id: 'vik',
            lat: 61.0275,
            lon: 6.564,
            zIndex: 30,
            enableMouseTracking: false,
            dataLabels: {
                style: {
                    fontSize: 14,
                    textOutline: 'none'
                },
                x: 65,
                y: -2
            },
            marker: {
                enabled: true,
                symbol: 'mapmarker',
                fillColor: '#34D399',
                lineColor: '#fff',
                lineWidth: 2,
                radius: 10
            }

        }],
        color: '#313f77',
        accessibility: {
            enabled: false
        }
    }, false);
    chart.redraw(false);
};


Highcharts.getJSON(
    'https://code.highcharts.com/mapdata/custom/world.topo.json',
    topology => {

        const chart = Highcharts.mapChart('container', {
            chart: {
                map: topology,
                backgroundColor: 'transparent'
            },
            accessibility: {
                screenReaderSection: {
                    beforeChartFormat: '',
                    afterChartFormat: ''
                },
                keyboardNavigation: {
                    enabled: false
                }
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Highcharts Office Locations',
                floating: true,
                align: 'left',
                style: {
                    textOutline: '2px contrast'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            mapNavigation: {
                enabled: false
            },
            mapView: {
                maxZoom: 30,
                projection: {
                    name: 'Orthographic',
                    rotation: [20, -45]
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                mappoint: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        formatter: function () {
                            const html = `
                            <div class="city  ${this.point.id}">
                            ${this.point.name}
                            </div>
                            `;
                            return html;
                        }
                    },
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
                    enableMouseTracking: false
                },
                series: {
                    animation: {
                        duration: 750
                    },
                    clip: false
                }
            },
            series: [{
                name: 'Graticule',
                id: 'graticule',
                opacity: 0.9,
                type: 'mapline',
                data: getGraticule(),
                nullColor: 'rgba(0, 0, 0, 0)',
                accessibility: {
                    enabled: false
                },
                enableMouseTracking: false
            }, {
                data,
                joinBy: 'name',
                color: '#fff',
                nullColor: 'var(--highcharts-highlight-color-20)',
                borderColor: 'rgba(246,248,255,0.7)',
                borderWidth: 0,
                name: '',
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                },
                events: {
                    afterAnimate
                },
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }]
        });

        // Render a circle
        // make it appear as the sea around the continents
        const renderSea = () => {
            let verb = 'animate';
            if (!chart.sea) {
                chart.sea = chart.renderer
                    .circle()
                    .attr({
                        fill: '#626BD0',
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

    }
);
