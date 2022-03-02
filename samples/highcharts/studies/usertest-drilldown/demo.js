function makeLinkWraps(chart, role, desc) {
    chart.series.forEach(s => {
        s.group.element.setAttribute('role', 'group');

        if (s.name === 'Country exports') {
            s.points.forEach(p => {
                const graphic = p.graphic.element;
                const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');

                link.setAttribute('tabindex', '-1');
                link.setAttribute('aria-hidden', false);
                link.setAttribute('aria-label', graphic.getAttribute('aria-label'));

                if (role) {
                    link.setAttribute('role', role);
                }
                if (desc) {
                    link.setAttribute('aria-roledescription', desc);
                }

                link.addEventListener('click', function (e) {
                    e.point = p;
                    Highcharts.fireEvent(s, 'click', e);
                    p.firePointEvent('click');
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });

                graphic.parentNode.appendChild(link);
                link.appendChild(graphic);
                graphic.setAttribute('aria-hidden', true);
            });
        }
    });
}

Highcharts.addEvent(Highcharts.Chart.prototype, 'render', function () {
    const desc = this.container.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'desc')[0];
    desc.textContent = 'Created with Highcharts';

    setTimeout(() => {
        makeLinkWraps(this, 'button');
    }, 1);
});

Highcharts.addEvent(Highcharts.Chart, 'aftergetTableAST', function (e) {
    const tree = e.tree;
    const tbody = tree.children[2];
    const rows = tbody.children;

    rows.forEach(row => {
        const dataCell = row.children[1];
        const num = parseFloat(dataCell.textContent);
        dataCell.textContent = Highcharts.numberFormat(num, -1, '.', ',') + ' billion USD';
    });
});

let clearTimer = null;
function announce(text) {
    const div = document.getElementById('announce');
    if (clearTimer) {
        clearTimeout(clearTimer);
    }
    div.textContent = text;
    clearTimer = setTimeout(() => (div.textContent = ''), 10000);
}

Highcharts.addEvent(Highcharts.Chart, 'afterApplyDrilldown', function () {
    const series = this.series[0];
    announce('Navigated to details for ' + series.name + '. New bar series with ' + series.points.length + ' bars. Back to Country exports button.');

    // Fix drillup btn
    setTimeout(() => {
        const chart = this;
        this.accessibility.components.zoom.drillUpProxyButton.remove();
        this.drillUpButton.element.setAttribute('aria-hidden', true);

        const parentGroup = series.group.element.parentNode;
        const link = chart.drillUpLink = document.createElementNS('http://www.w3.org/2000/svg', 'a');

        link.setAttribute('tabindex', '-1');
        link.setAttribute('aria-hidden', false);
        link.setAttribute('aria-label', 'Back to Country exports');
        link.setAttribute('role', 'button');

        link.addEventListener('click', function () {
            chart.drillUp();
        });

        parentGroup.insertBefore(link, series.group.element);
        link.focus();
    }, 10);
});

Highcharts.addEvent(Highcharts.Chart, 'drillupall', function () {
    const series = this.series[0];
    series.group.element.focus();
    if (this.drillUpLink) {
        this.drillUpLink.remove();
    }
    announce('Navigated back to ' + series.name + '. Bar series with ' + series.points.length + ' bars.');
});

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) {
        Highcharts.charts.forEach(chart => {
            chart.drillUp();
        });
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Exports by country'
    },
    subtitle: {
        text: 'Click each country for details'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Billion USD'
        }
    },
    accessibility: {
        announceNewData: {
            enabled: false
        },
        landmarkVerbosity: 'disabled',
        screenReaderSection: {
            beforeChartFormatter: function (chart) {
                const chartTitle = chart.options.title.text;
                const chartSubtitle = chart.options.subtitle.text;
                const typeDesc = 'Bar chart with ' + chart.series[0].points.length + ' bars';
                const xAxisDescription = 'The chart has 1 X axis displaying ' +
                    (chart.series[0].name === 'Country exports' ? 'countries.' : 'export categories.');
                const yAxisDescription = 'The chart has 1 Y axis displaying billion USD. Data ranges from ' +
                    chart.yAxis[0].dataMin + ' billion USD to ' + chart.yAxis[0].dataMax + ' billion USD.';
                return `<div>${chartTitle}, ${typeDesc}. ${chartSubtitle}.</div><div>${xAxisDescription}</div><div>${yAxisDescription}</div>`; // eslint-disable-line
            }
        },
        point: {
            descriptionFormatter: function (point) {
                let label = point.name + ', ' + point.y + ' billion USD.';
                if (point.series.name === 'Country exports') {
                    label += ' Click to load detailed data.';
                }
                return label;
            }
        },
        series: {
            describeSingleSeries: true
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            accessibility: {
                description: 'Currently at bottom level.'
            },
            borderWidth: 0,
            dataLabels: {
                enabled: true
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        valueSuffix: ' billion USD'
    },
    series: [{
        name: 'Country exports',
        colorByPoint: true,
        accessibility: {
            description: 'Currently at top level.'
        },
        data: [{
            name: 'China',
            y: 2591,
            drilldown: 'china'
        }, {
            name: 'USA',
            y: 1431,
            drilldown: 'usa'
        }, {
            name: 'Germany',
            y: 1378,
            drilldown: 'germany'
        }, {
            name: 'Turkey',
            y: 169.5,
            drilldown: 'turkey'
        }]
    }],
    drilldown: {
        breadcrumbs: {
            showFullPath: false,
            floating: true,
            buttonTheme: {
                fill: '#f7f7f7',
                padding: 8,
                stroke: '#cccccc',
                'stroke-width': 1
            },
            position: {
                align: 'right'
            }
        },
        series: [{
            id: 'china',
            name: 'China',
            data: [
                ['Phone system devices', 223.2],
                ['Computers and optical readers', 170.2],
                ['Integrated circuits', 117.1],
                ['Miscellaneous articles', 55.2],
                ['Lamps and lighting', 37.6]
            ]
        }, {
            id: 'usa',
            name: 'USA',
            data: [
                ['Oil and gas', 144.3],
                ['Cars and car parts', 78.9],
                ['Integrated circuits', 44.2],
                ['Phone system devices', 28.1],
                ['Electro-medical devices', 28.0]
            ]
        }, {
            id: 'germany',
            name: 'Germany',
            data: [
                ['Cars and car parts', 176.4],
                ['Medication', 60.1],
                ['Blood fractions', 31.8],
                ['Aircraft and spacecraft', 20.7],
                ['Electro-medical devices', 16.7]
            ]
        }, {
            id: 'turkey',
            name: 'Turkey',
            data: [
                ['Cars and car parts', 16.3],
                ['Trucks', 4.4],
                ['Oil and gas', 6.1],
                ['Jewelry', 5.1],
                ['Gold', 2.0]
            ]
        }]
    }
});
