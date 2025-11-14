(function syncThemeWithParentAndSystem() {
    try {

        if (window.top?.location?.href?.startsWith('http://localhost:3030/samples/')) {
            // eslint-disable-next-line max-len
            console.info('[Highcharts Demo] Local samples environment detected — skipping theme sync.');
            return;
        }

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


const finalMap = function () {
    (async () => {

        // Load the dataset
        const data = await fetch(
            'https://www.highcharts.com/samples/data/world-population-density.json'
        ).then(response => response.json());

        // Assign id's
        data.forEach(function (p) {
            p.id = p.code;
        });
        // Initialize the chart
        Highcharts.mapChart('maps', {
            chart: {
                styledMode: true,
                animation: {

                    duration: 1000

                },
                events: {
                    load: function () {
                        const mapSeries = document.querySelector(
                            '.highcharts-map-series'
                        );
                        const title = document.querySelector(
                            '.highcharts-title'
                        );
                        const subtitle = document.querySelector(
                            '.highcharts-subtitle'
                        );
                        mapSeries.style.opacity = 0;
                        setTimeout(function () {
                            mapSeries.style.opacity = 0;
                            title.classList.add('fade-in');
                            subtitle.classList.add('fade-in');
                        }, 200);

                        setTimeout(function () {
                            mapSeries.classList.add('fade-in');
                        }, 500);
                    },
                    redraw: function () {
                        const mapSeries = document.querySelector(
                            '.highcharts-map-series'
                        );
                        mapSeries.classList.add('show');

                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'World Population Density',
                style: {
                    fontFamily: 'IBM Plex Sans',
                    color: 'var(--text-primary)'
                }
            },
            exporting: {
                enabled: false
            },
            legend: {
                title: {
                    text: 'Population density per km²'
                },
                labelStyle: {
                    color: 'var(--text-primary)'

                },
                floating: true,
                y: 20
            },
            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic',
                maxColor: 'var(--illo-brand-700)'
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom',
                    padding: 10,
                    x: 5
                }
            },
            // mapView: {
            //     center: [4100, 8280], // In terms of pre-projected units
            //     zoom: 0.1
            // },
            tooltip: {
                useHTML: true,
                distance: -15,
                formatter: function () {
                    const htmlString =
                        `<div class="tip-grid">
                        <div class="tip-content">
                            <div class="dot"></div>${this.point.name}
                        </div>
                        <i class="fas fa-caret-down tip-point"></i>
                        </div>
                        `;
                    return htmlString;
                },
                valueSuffix: '/km²'
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
                screenReaderSection: {
                    beforeChartFormat: '<h1>Population density</h1><p>' +
                        'Interactive map showing population density of the ' +
                        'world\'s countries.</p>'
                }
            },
            series: [{
                data: data,
                accessibility: {
                    keyboardNavigation: {
                        enabled: false
                    },
                    exposeAsGroupOnly: true
                },
                mapData: Highcharts.maps['custom/world-highres'],
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                allowPointSelect: true,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        e.point.zoomTo();
                    }
                }

            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 400
                    },
                    chartOptions: {
                        subtitle: {
                            text: ''
                        },
                        chart: {
                            margin: [40, 1, 65, 0]
                        }
                    }
                },
                {
                    condition: {
                        minWidth: 401
                    },
                    chartOptions: {
                        subtitle: {
                            text: 'Click a country to zoom to it.'
                        },
                        chart: {
                            margin: [60, 1, 65, 0]
                        }

                    }
                }]
            }
        });

    })();
};
finalMap();
