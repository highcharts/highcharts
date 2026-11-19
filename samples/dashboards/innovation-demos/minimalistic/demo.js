const lightColor = 'E0FFF3',
    ambientColor = '#E0FFF3';

Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'column-chart',
                    height: 200
                }, {
                    id: 'donut-chart',
                    height: 200
                }, {
                    id: 'line-chart',
                    height: 200
                }]
            }, {
                cells: [{
                    id: 'misc-0'
                }, {
                    id: 'misc-1'
                }, {
                    id: 'misc-2'
                }, {
                    id: 'misc-3'
                }]
            }]
        }]
    },
    components: [{
        type: 'Highcharts',
        renderTo: 'column-chart',
        chartOptions: {
            chart: {
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: false,
            legend: false,
            credits: false,
            xAxis: {
                visible: false
            },
            yAxis: {
                visible: false
            },
            series: [{
                // White at the top, fading into the base color
                color: '#E0FFF3',
                borderWidth: 0,
                borderRadius: {
                    radius: 5,
                    where: 'all'
                },
                data: [20, 10, 30, 50]
            }]
        }
    }, {
        type: 'Highcharts',
        renderTo: 'donut-chart',
        chartOptions: {
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
            },
            colors: ['#FD5DAE', '#3CD1FE', '#8C5DF7'],
            title: false,
            credits: false,
            series: [{
                dataLabels: {
                    enabled: false
                },
                innerSize: '70%',
                borderWidth: 0.5,
                borderColor: null,
                borderRadius: 0,
                slicedOffset: 0,
                data: [20, 10, 30]
            }]
        }
    }, {
        type: 'Highcharts',
        renderTo: 'line-chart',
        chartOptions: {
            chart: {
                styledMode: true,
                type: 'spline'
            },
            defs: {
                neon: {
                    tagName: 'filter',
                    attributes: {
                        id: 'neon',
                        x: '-100%',
                        y: '-100%',
                        width: '300%',
                        height: '300%',
                        'color-interpolation-filters': 'sRGB'
                    },
                    children: [{
                        tagName: 'feDropShadow',
                        attributes: {
                            in: 'SourceGraphic',
                            dx: 0,
                            dy: 0,
                            stdDeviation: 2,
                            'flood-color': lightColor,
                            'flood-opacity': 1,
                            result: 'innerGlow'
                        }
                    }, {
                        tagName: 'feDropShadow',
                        attributes: {
                            in: 'SourceGraphic',
                            dx: 0,
                            dy: 0,
                            stdDeviation: 6,
                            'flood-color': ambientColor,
                            'flood-opacity': 0.7,
                            result: 'outerGlow'
                        }
                    }, {
                        tagName: 'feMerge',
                        children: [
                            {
                                tagName: 'feMergeNode',
                                attributes: {
                                    in: 'outerGlow'
                                }
                            },
                            {
                                tagName: 'feMergeNode',
                                attributes: {
                                    in: 'innerGlow'
                                }
                            },
                            {
                                tagName: 'feMergeNode',
                                attributes: {
                                    in: 'SourceGraphic'
                                }
                            }
                        ]
                    }]
                }
            },
            title: false,
            legend: false,
            credits: false,
            xAxis: {
                visible: false
            },
            yAxis: {
                visible: false
            },
            series: [{
                marker: {
                    enabled: false
                },
                data: [20, 10, 30, 50]
            }]
        }
    }]
});
