const day = 24 * 36e5,
    today = Math.floor(Date.now() / day) * day;

const options = {
    chart: {
        plotBackgroundColor: 'rgba(128,128,128,0.02)',
        plotBorderColor: 'rgba(128,128,128,0.1)',
        plotBorderWidth: 1,
        marginTop: 90
    },

    plotOptions: {
        series: {
            borderRadius: '50%',
            connectors: {
                lineWidth: 1,
                lineColor: 'var(--highcharts-neutral-color-60, #666)',
                radius: 10,
                endMarker: {
                    verticalAlign: 'bottom',
                    align: 'center',
                    yOffset: 5
                },
                startMarker: {
                    symbol: 'arrow-half',
                    lineWidth: 1,
                    lineColor: 'var(--highcharts-neutral-color-60, #666)',
                    xOffset: -5
                }
            },
            groupPadding: 0,
            dataLabels: [{
                enabled: true,
                align: 'left',
                format: '{point.name}',
                padding: 10,
                style: {
                    fontWeight: 'normal',
                    textOutline: 'none'
                }
            }, {
                enabled: true,
                align: 'right',
                format: '{#if point.completed}{(multiply ' +
                    'point.completed.amount 100):.0f}%{/if}',
                padding: 10,
                style: {
                    fontWeight: 'normal',
                    textOutline: 'none',
                    opacity: 0.6
                }
            }]
        }
    },

    series: [{
        name: 'Offices',
        data: [{
            name: 'New offices',
            id: 'new_offices',
            owner: 'Peter',
            pointWidth: 3,
            color: 'var(--highcharts-neutral-color-60, #666)',
            dataLabels: {
                align: 'right',
                style: {
                    color: 'var(--highcharts-neutral-color-60, #666)'
                },
                x: 72
            }
        }, {
            name: 'Prepare office building',
            id: 'prepare_building',
            parent: 'new_offices',
            start: today - (8 * day),
            end: today + (6 * day),
            completed: {
                amount: 0.5
            },
            owner: 'Linda'
        }, {
            name: 'Inspect building',
            id: 'inspect_building',
            dependency: 'prepare_building',
            parent: 'new_offices',
            start: today + 6 * day,
            end: today + 8 * day,
            owner: 'Ivy'
        }, {
            name: 'Passed inspection',
            id: 'passed_inspection',
            dependency: 'inspect_building',
            parent: 'new_offices',
            start: today + 9.5 * day,
            milestone: true,
            owner: 'Peter'
        }, {
            name: 'Relocate',
            id: 'relocate',
            parent: 'new_offices',
            owner: 'Josh',
            pointWidth: 3,
            color: 'var(--highcharts-neutral-color-60, #666)',
            dataLabels: {
                align: 'right',
                style: {
                    color: 'var(--highcharts-neutral-color-60, #666)'
                },
                x: 57
            }
        }, {
            name: 'Relocate staff',
            id: 'relocate_staff',
            parent: 'relocate',
            start: today + 10 * day,
            end: today + 11 * day,
            owner: 'Mark'
        }, {
            name: 'Relocate test facility',
            dependency: 'relocate_staff',
            parent: 'relocate',
            start: today + 11 * day,
            end: today + 13 * day,
            owner: 'Anne'
        }, {
            name: 'Relocate cantina',
            dependency: 'relocate_staff',
            parent: 'relocate',
            start: today + 11 * day,
            end: today + 14 * day
        }]
    }, {
        name: 'Product',
        data: [{
            name: 'New product launch',
            id: 'new_product',
            owner: 'Peter',
            pointWidth: 3,
            color: 'var(--highcharts-neutral-color-60, #666)',
            dataLabels: {
                align: 'right',
                style: {
                    color: 'var(--highcharts-neutral-color-60, #666)'
                },
                format: 'Launch',
                x: 50
            }
        }, {
            name: 'Development',
            id: 'development',
            parent: 'new_product',
            start: today - day,
            end: today + (11 * day),
            completed: {
                amount: 0.6
            },
            owner: 'Susan'
        }, {
            name: 'Beta',
            id: 'beta',
            dependency: 'development',
            parent: 'new_product',
            start: today + 12.5 * day,
            milestone: true,
            owner: 'Peter'
        }, {
            name: 'Final development',
            id: 'finalize',
            dependency: 'beta',
            parent: 'new_product',
            start: today + 13 * day,
            end: today + 17 * day
        }, {
            name: 'Launch',
            dependency: 'finalize',
            parent: 'new_product',
            start: today + 17.5 * day,
            milestone: true,
            owner: 'Peter'
        }]
    }],
    tooltip: {
        pointFormat: '<span style="font-weight: bold">{point.name}</span><br>' +
            '{point.start:%e %b}' +
            '{#unless point.milestone} → {point.end:%e %b}{/unless}' +
            '<br>' +
            '{#if point.completed}' +
            'Completed: {multiply point.completed.amount 100}%<br>' +
            '{/if}' +
            'Owner: {#if point.owner}{point.owner}{else}unassigned{/if}'
    },
    title: {
        text: 'Gantt Project Management',
        align: 'left'
    },
    xAxis: [{
        currentDateIndicator: {
            color: '#ef4444',
            dashStyle: 'ShortDot',
            width: 2,
            label: {
                format: ''
            }
        },
        dateTimeLabelFormats: {
            day: '%e<br><span style="opacity: 0.5; font-size: 0.7em">%a</span>'
        },
        grid: {
            borderWidth: 0
        },
        gridLineWidth: 1,
        min: today - 3 * day,
        max: today + 19 * day,
        custom: {
            weekendPlotBands: true
        }
    }],
    yAxis: {
        grid: {
            borderWidth: 0,
            enabled: true,
            columns: [{
                title: {
                    text: 'Title'
                },
                labels: {
                    format: '{value}'
                }
            }, {
                title: {
                    text: 'Duration'
                },
                labels: {
                    format: '{#if point.x2}' +
                        '{(divide (subtract point.x2 point.x) 86400000)} days' +
                        '{else} - {/if}'
                }
            }]
        },
        gridLineWidth: 0,
        labels: {
            symbol: {
                width: 8,
                height: 6,
                x: -4,
                y: -2
            }
        },
        staticScale: 30
    },
    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        },
        point: {
            descriptionFormatter: function (point) {
                const completedValue = point.completed ?
                        point.completed.amount || point.completed : null,
                    completed = completedValue ?
                        ' Task ' + Math.round(completedValue * 1000) / 10 +
                            '% completed.' :
                        '',
                    dependency = point.dependency &&
                        point.series.chart.get(point.dependency).name,
                    dependsOn = dependency ?
                        ' Depends on ' + dependency + '.' : '';

                return Highcharts.format(
                    point.milestone ?
                        '{point.yCategory}. Milestone at {point.x:%Y-%m-%d}. ' +
                        'Owner: {point.owner}.{dependsOn}' :
                        '{point.yCategory}.{completed} Start ' +
                        '{point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}. Owner: ' +
                        '{point.owner}.{dependsOn}',
                    { point, completed, dependsOn }
                );
            }
        }
    },
    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis ' +
                    'showing time in both week numbers and days.'
            }
        }
    }
};

// Plug-in to render plot bands for the weekends
Highcharts.addEvent(Highcharts.Axis, 'foundExtremes', e => {
    if (e.target.options.custom && e.target.options.custom.weekendPlotBands) {
        const axis = e.target,
            chart = axis.chart,
            day = 24 * 36e5,
            isWeekend = t => /[06]/.test(chart.time.dateFormat('%w', t)),
            plotBands = [];

        let inWeekend = false;

        for (
            let x = Math.floor(axis.min / day) * day;
            x <= Math.ceil(axis.max / day) * day;
            x += day
        ) {
            const last = plotBands.at(-1);
            if (isWeekend(x) && !inWeekend) {
                plotBands.push({
                    from: x,
                    color: {
                        pattern: {
                            path: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
                            width: 10,
                            height: 10,
                            color: 'rgba(128,128,128,0.15)'
                        }
                    }
                });
                inWeekend = true;
            }

            if (!isWeekend(x) && inWeekend && last) {
                last.to = x;
                inWeekend = false;
            }
        }
        axis.options.plotBands = plotBands;
    }
});

Highcharts.ganttChart('container', options);
