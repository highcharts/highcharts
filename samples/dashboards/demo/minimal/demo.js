/* eslint-disable max-len */
const colors = Highcharts.getOptions().colors.map((c, i) =>
    Highcharts.color('#0443E1')
        .brighten(i / 10)
        .get()
);

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'support',
            type: 'JSON',
            firstRowAsNames: false,
            columnIds: [
                'Channel', 'Department', 'Satisfaction',
                'Wait time', 'Tickets', 'Resolution time'
            ],
            data: [
                ['Email', 'Marketing', 8, 310, 140, 1.4],
                ['Chat', 'Marketing', 7, 14, 90, 2.3],
                ['Phone', 'Marketing', 5, 35, 55, 3.2],
                ['In app', 'Sales', 6, 10, 241, 1.3],
                ['Social', 'Sales', 7, 180, 18, 3.3],
                ['Helpdesk', 'Marketing', 2, 14, 44, 2.3],
                ['Other', 'Marketing', 7, 5000, 10, 2.4]
            ]
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [
        {
            renderTo: 'dashboard-col-0',
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            connector: {
                id: 'support',
                columnAssignment: [{
                    seriesId: 'tickets',
                    data: ['Channel', 'Tickets']
                }]
            },
            chartOptions: {
                chart: {
                    type: 'pie',
                    spacing: 20
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        colors: colors,
                        dataLabels: [{
                            enabled: true,
                            distance: 20
                        }, {
                            enabled: true,
                            distance: -40,
                            format: '{point.percentage:.1f}%',
                            backgroundColor: '#00000030',
                            borderRadius: 5,
                            style: {
                                fontSize: '0.9em',
                                textOutline: 'none'
                            }
                        }]
                    }
                },
                title: {
                    text: 'Ticket distribution by channel',
                    align: 'left'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                }
            }
        }, {
            renderTo: 'dashboard-col-1',
            sync: {
                visibility: true,
                highlight: true,
                extremes: true
            },
            connector: {
                id: 'support',
                columnAssignment: [{
                    seriesId: 'resolution',
                    data: ['Channel', 'Resolution time']
                }]
            },
            type: 'Highcharts',
            chartOptions: {
                xAxis: {
                    type: 'category',
                    title: {
                        text: 'Channels'
                    }
                },
                yAxis: {
                    max: 5,
                    plotBands: [{
                        from: 0,
                        to: 1.8,
                        color: '#00E28424',
                        label: {
                            text: 'Safezone',
                            align: 'right',
                            style: {
                                color: '#007D49',
                                dashStyle: 'Solid',
                                fontSize: '0.7em'
                            },
                            rotation: 90,
                            x: -15,
                            y: 30
                        }
                    }],
                    plotLines: [{
                        value: 1.8,
                        color: '#00DD81',
                        dashStyle: 'ShortDash'

                    }],
                    title: {
                        text: ''
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        pointWidth: 18,
                        color: '#4295f7',
                        borderColor: '#3477c6',
                        borderRadius: 6
                    }
                },
                title: {
                    text: 'Average resolution time by channel',
                    align: 'left'
                },
                legend: {
                    enabled: false
                    // verticalAlign: 'top'
                },
                chart: {
                    type: 'column'
                },
                tooltip: {
                    valueSuffix: ' mcg',
                    stickOnContact: true
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Iron in food. Highcharts ' +
                        'Interactive Chart.'
                    }
                },
                accessibility: {
                    description: `The chart is displaying the Iron amount in
                micrograms for some groceries. There is a plotLine demonstrating
                the daily Recommended Dietary Allowance (RDA) of 8
                micrograms.`,
                    point: {
                        valueSuffix: ' mcg'
                    }
                }
            }
        }, {
            renderTo: 'dashboard-col-2',
            connector: {
                id: 'support'
            },
            type: 'Grid',
            sync: {
                highlight: true,
                visibility: true
            },
            gridOptions: {
                credits: {
                    enabled: false
                },
                rendering: {
                    theme: 'hcg-theme-default theme-support'
                },
                columns: [
                    {
                        id: 'Department',
                        cells: {
                            formatter() {
                                const dept = this.value;
                                return `<div class="department ${dept.toLowerCase()}">${dept}</div>`;
                            }
                        }
                    },
                    {
                        id: 'Satisfaction',
                        cells: {
                            format: '<div class="rating r{value}"></div>'
                        }
                    },
                    {
                        id: 'Wait time',
                        cells: {
                            formatter() {
                                const minutes = this.value;
                                if (minutes < 60) {
                                    return `${minutes} <span class="time-unit">mins<span>`;
                                }

                                const hours = minutes / 60;
                                if (hours < 24) {
                                    const roundedHours = Math.floor(hours);
                                    return `${roundedHours} <span class="time-unit">hours</span>`;
                                }

                                const days = minutes / (60 * 24);
                                const roundedDays = Math.floor(days);
                                return `${roundedDays} <span class="time-unit">days</span>`;
                            }
                        }
                    },
                    {
                        id: 'Resolution time',
                        cells: {
                            format: '{value} <span class="time-unit">hours</span>'
                        }
                    }
                ]
            }
        }]
}, true);
