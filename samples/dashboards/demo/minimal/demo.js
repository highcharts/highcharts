const colors = Highcharts.getOptions().colors.map((c, i) =>
    Highcharts.color('#0443E1')
        .brighten(i / 10)
        .get()
);

Highcharts.setOptions({
    title: {
        align: 'left',
        style: {
            fontSize: '1em'
        }
    },
    chart: {
        spacing: 20
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    }
});

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
                ['Phone', 'Sales', 5, 35, 55, 3.2],
                ['In app', 'Sales', 6, 10, 241, 1.3],
                ['Other', 'Marketing', 7, 5000, 65, 2.4]
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
                title: {
                    text: 'Ticket distribution by channel'
                },
                chart: {
                    type: 'pie'
                },
                plotOptions: {
                    series: {
                        colors: colors,
                        borderRadius: 4,
                        dataSorting: {
                            enabled: true
                        },
                        dataLabels: [{
                            enabled: true
                        }, {
                            enabled: true,
                            distance: -40,
                            format: '{point.percentage:.1f}%',
                            backgroundColor: '#00000025',
                            borderRadius: 5,
                            style: {
                                fontSize: '0.8em',
                                textOutline: 'none'
                            }
                        }],
                        states: {
                            hover: {
                                halo: {
                                    opacity: 1,
                                    size: 5
                                }
                            },
                            inactive: {
                                opacity: 1
                            }
                        }
                    }
                }
            }
        }, {
            renderTo: 'dashboard-col-1',
            sync: {
                highlight: true
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
                title: {
                    text: 'Average resolution time by channel'
                },
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        pointWidth: 18,
                        color: colors[3],
                        borderColor: colors[2],
                        borderRadius: 6
                    }
                },
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
                        text: 'Avg. resolution time'
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
                                return `<div
                                    class="department ${dept.toLowerCase()}">
                                    ${dept}</div>`;
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
                                    return `${minutes}
                                        <span class="time-unit">mins<span>`;
                                }

                                const hours = minutes / 60;
                                if (hours < 24) {
                                    const roundedHours = Math.floor(hours);
                                    return `${roundedHours}
                                        <span class="time-unit">hours</span>`;
                                }

                                const days = minutes / (60 * 24);
                                const roundedDays = Math.floor(days);
                                return `${roundedDays}
                                    <span class="time-unit">days</span>`;
                            }
                        }
                    },
                    {
                        id: 'Resolution time',
                        cells: {
                            format:
                                '{value} <span class="time-unit">hours</span>'
                        }
                    }
                ]
            }
        }]
}, true);
