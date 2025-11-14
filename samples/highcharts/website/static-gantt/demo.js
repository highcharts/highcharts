(function syncThemeWithParentAndSystem() {
    try {
        const parentDoc = window.top?.document;
        if (!parentDoc) {
            return;
        }

        const parentHtml = parentDoc.documentElement;
        if (!parentHtml) {
            return;
        }

        const body = document.body;
        if (!body) {
            return;
        }

        let currentTheme = null;

        // --- System-level preference ---
        const systemPref = window.matchMedia('(prefers-color-scheme: dark)');

        const getEffectiveTheme = () => {
            // Get main site's data-theme attribute
            // eslint-disable-next-line max-len
            const parentTheme = parentHtml.getAttribute('data-theme') || 'light';
            // If main site is using system mode,
            // derive from user’s system preference
            if (parentTheme === 'system') {
                return systemPref.matches ? 'dark' : 'light';
            }
            return parentTheme;
        };

        const applyTheme = () => {
            const theme = getEffectiveTheme();
            if (theme === currentTheme) {
                return;
            } // Avoid unnecessary DOM churn

            currentTheme = theme;

            body.classList.remove('highcharts-light', 'highcharts-dark');
            body.classList.add('highcharts-' + theme);

            // Mirror color-scheme hint for form controls, scrollbars, etc.
            document.documentElement.style.colorScheme = theme;

            console.info(`[Highcharts Demo] Applied theme: ${theme}`);
        };

        // Initial apply
        applyTheme();

        // --- Watch parent <html> attribute changes ---
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                // eslint-disable-next-line max-len
                if (m.attributeName === 'data-theme' || m.attributeName === 'style') {
                    applyTheme();
                }
            }
        });
        observer.observe(parentHtml, { attributes: true });

        // --- Watch for system color scheme changes ---
        systemPref.addEventListener('change', applyTheme);

        // --- Cleanup when iframe unloads ---
        window.addEventListener('unload', () => {
            observer.disconnect();
            systemPref.removeEventListener('change', applyTheme);
        });

        // eslint-disable-next-line max-len
        console.info('[Highcharts Demo] Theme sync active (with system mode support).');
    } catch (err) {
        if (err.name === 'SecurityError') {
            // eslint-disable-next-line max-len
            console.warn('[Highcharts Demo] Cross-origin context; theme sync disabled.');
        } else {
            console.error('[Highcharts Demo] Theme sync failed:', err);
        }
    }
}());

Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
// Math.easeInQuint = function (pos) {
//     return Math.pow(pos, 5);
// },

Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

const big = window.matchMedia('(min-width: 500px)').matches;

const ganttChart = function () {

    const day = 24 * 3600 * 1000,
        today = Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate()
        );
    // Create the chart
    Highcharts.ganttChart('gantt', {
        chart: {
            height: '100%',
            margin: [120, 10, 20, 10],
            spacing: [30, 0, 0, 10],
            events: {
                load: function () {
                    const chart = this;

                    // eslint-disable-next-line max-len
                    // const buttonGroup = document.getElementById('button-group');
                    // const background = document.querySelector(
                    //     '.highcharts-background'
                    // );
                    const scrollMask = document.querySelector(
                        '.highcharts-scrollable-mask'
                    );

                    // buttonGroup.classList.add('on');
                    // background.classList.add('on');
                    if (scrollMask) {
                        scrollMask.style.fill = 'var(--illo-background)';
                    }

                    chart.series[0].points[6].onMouseOver();

                    if (!big) {
                        chart.update({
                            chart: {
                                margin: [80, 10, 20, 10],
                                scrollablePlotArea: {
                                    minHeight: 250,
                                    minWidth: 250
                                }
                            }
                        });
                    }

                },
                redraw: function () {
                    const background = document.querySelector(
                        '.highcharts-background'
                    );
                    const scrollMask = document.querySelector(
                        '.highcharts-scrollable-mask'
                    );
                    background.classList.add('on');
                    if (scrollMask) {
                        scrollMask.style.fill = 'var(--illo-background)';
                    }

                }
            },
            styledMode: true
        },
        lang: {
            accessibility: {
                chartContainerLabel: '',
                screenReaderSection: {
                    beforeRegionLabel: '',
                    endOfChartMarker: ''
                }
            }
        },
        accessibility: {
            announceNewData: {
                enabled: true
            },
            screenReaderSection: {
                beforeChartFormat: '<h1>{chartTitle}</h1><p>' +
                    '{typeDescription}</p><p>{chartSubtitle}</p><p>' +
                    'Interactive Gantt diagram showing tasks and milestones ' +
                    'across three departments, Tech, Marketing, and Sales.</p>'
            },
            point: {
                descriptionFormatter: function (point) {
                    const formatTime = t => point.series.chart.time.dateFormat(
                        '%a %B %e, %l:%M %p', new Date(t).getTime()
                    );
                    const startDate = formatTime(point.start);
                    const endDate = formatTime(point.end);
                    const category = point.yCategory;

                    return point.end ?
                        ` ${point.name}, from: ${startDate} to ${endDate}. ${category} department.` // eslint-disable-line
                        : ` Milestone, ${point.name}, ${startDate}. ${category} department.`; // eslint-disable-line
                }
            }
        },

        title: {
            text: 'Interactive Gantt Chart',
            floating: true
        },
        subtitle: {
            text: 'Drag and drop points to edit'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: false, // Do not animate dependency connectors
                dragDrop: {
                    draggableX: true,
                    draggableY: true,
                    dragMinY: 0,
                    dragMaxY: 2,
                    dragPrecisionX: day / 3 // Snap to eight hours
                },
                borderRadius: 3,
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    format: '{point.name}',
                    style: {
                        cursor: 'default',
                        pointerEvents: 'none'
                    },
                    y: 15
                },
                connectors: {
                    endMarker: {
                        color: '#fff',
                        lineColor: '#fff'
                    }
                },
                pointPadding: 0.42,
                groupPadding: 0,
                allowPointSelect: true
                // point: {
                //     events: {
                //         select: updateRemoveButtonStatus,
                //         unselect: updateRemoveButtonStatus,
                //         remove: updateRemoveButtonStatus
                //     }
                // }
            }
        },

        yAxis: {
            type: 'category',
            title: {
                text: ''
            },
            categories: ['Tech', 'Marketing', 'Sales'],
            min: 0,
            max: 2,
            plotLines: [

                {
                    value: 0.5
                },
                {
                    value: 1.5
                },
                {
                    value: 2.5
                }],
            visible: true,
            grid: {
                enabled: false
            },
            padding: 0,
            labels: {
                useHTML: true,
                align: 'left',
                formatter: function () {
                    const name = this.value;
                    if (this.value.length > 1) {
                        const htmlString = `<div class="gantt-label">
                            ${name}</div>`;
                        return htmlString;
                    }
                }
            }
        },
        xAxis: [
            {
                className: 'xAxis',
                minorTicks: true,
                gridLineDashStyle: 'dot',
                currentDateIndicator: true,
                dateTimeLabelFormats: {
                    day: {
                        list: ['%A, %e. %B', '%a, %e. %b', '%E']
                    }
                },
                grid: {
                    cellHeight: 15
                },
                labels: {
                    useHTML: true,
                    padding: 0,
                    formatter: function () {
                        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                        const dayDate = new Date(this.value).getDay();
                        const day = days[dayDate];
                        const htmlString = `
                        <div class="day-label">${day}</div>`;
                        return htmlString;
                    }
                }
            },
            {
                grid: {
                    cellHeight: 20
                }
            }
        ],

        tooltip: {
            xDateFormat: '%a %b %d, %H:%M',
            outside: true,
            className: 'tip',
            shadow: false,
            stickOnContact: true
        },

        series: [{
            name: 'Project 1',
            data: [{
                start: today + 2 * day,
                end: today + day * 5,
                name: 'Prototype',
                id: 'prototype',
                y: 0
            },  {
                start: today + day * 6,
                name: 'Prototype done',
                milestone: true,
                dependency: 'prototype',
                id: 'proto_done',
                y: 0
            }, {
                start: today + day * 7,
                end: today + day * 11,
                name: 'Testing',
                dependency: 'proto_done',
                y: 0
            }, {
                start: today + day * 5,
                end: today + day * 8,
                name: 'Product pages',
                y: 1
            }, {
                start: today + day * 9,
                end: today + day * 10,
                name: 'Newsletter',
                y: 1
            }, {
                start: today + day * 9,
                end: today + day * 11,
                name: 'Licensing',
                id: 'testing',
                y: 2
            }, {
                start: today + day * 11.5,
                end: today + day * 12.5,
                name: 'Publish',
                dependency: 'testing',
                y: 2
            }]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 250
                },
                chartOptions: {
                    chart: {
                        // height: 250,
                        margin: [80, 10, 20, 10]
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: false,
                                y: 15
                            }
                        }
                    },
                    title: {
                        y: 0
                    },
                    subtitle: {
                        y: 50
                    }
                }
            },
            {
                condition: {
                    maxWidth: 300,
                    minWidth: 251
                },
                chartOptions: {
                    chart: {
                        // height: 300
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: false,
                                y: 15
                            }
                        }
                    },
                    title: {
                        y: 0
                    },
                    subtitle: {
                        y: 50
                    }
                }
            },
            {
                condition: {
                    maxWidth: 400,
                    minWidth: 301
                },
                chartOptions: {
                    chart: {
                        // height: 400
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                y: 20
                            }
                        }
                    },
                    title: {
                        y: 0
                    },
                    subtitle: {
                        y: 50
                    }
                }
            },
            {
                condition: {
                    minWidth: 499
                },
                chartOptions: {
                    chart: {
                        // height: 500,
                        margin: [120, 10, 20, 10]
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                y: 25
                            }
                        }
                    },
                    title: {
                        y: 10
                    },
                    subtitle: {
                        y: 30
                    }
                }
            }]
        }
    });
};

ganttChart();
