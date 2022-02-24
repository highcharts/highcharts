function makeRoleButton(chart) {
    chart.series.forEach(s => {
        if (s.name === 'Things') {
            s.points.forEach(p => {
                const el = p.graphic.element;
                el.setAttribute('role', 'button');
            });
        }
    });
}

function makeRoledescription(chart) {
    chart.series.forEach(s => {
        if (s.name === 'Things') {
            s.points.forEach(p => {
                p.graphic.element.setAttribute('role', 'button');
                p.graphic.element.setAttribute('aria-roledescription', 'Expandable datapoint');
            });
        }
    });
}

function makeGraphicsRoles(chart) {
    chart.renderer.box.setAttribute('role', 'graphics-document');
    chart.series.forEach(s => {
        s.group.element.setAttribute('role', 'graphics-object');
        s.group.element.setAttribute('aria-roledescription', 'Data series');
        if (s.name === 'Things') {
            s.points.forEach(p => {
                p.graphic.element.setAttribute('role', 'graphics-symbol');
                p.graphic.element.setAttribute('aria-roledescription', 'Expandable datapoint');
            });
        }
    });
}

function makeLinkWraps(chart, noHref) {
    chart.series.forEach(s => {
        if (s.name === 'Things') {
            s.points.forEach(p => {
                const graphic = p.graphic.element;
                const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');

                if (!graphic.id) {
                    graphic.setAttribute('id', Highcharts.uniqueKey());
                }

                link.setAttribute('tabindex', '-1');
                link.setAttribute('aria-hidden', false);

                if (!noHref) {
                    link.setAttribute('href', '#' + graphic.id);
                }

                link.setAttribute('aria-label', graphic.getAttribute('aria-label'));
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

function makeHTMLOverlay(chart) {
    chart.series.forEach(s => {
        if (s.name === 'Things') {

            const btnContainer = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');

            s.points.forEach(p => {
                const graphic = p.graphic.element;
                graphic.setAttribute('aria-hidden', true);
                const btn = document.createElement('button');
                btn.onclick = function (e) {
                    e.point = p;
                    Highcharts.fireEvent(s, 'click', e);
                    p.firePointEvent('click');
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                };
                btn.setAttribute('aria-label', graphic.getAttribute('aria-label'));
                btn.setAttribute('tabindex', '-1');
                btnContainer.appendChild(btn);
            });

            s.group.element.appendChild(btnContainer);
        }
    });
}


Highcharts.addEvent(Highcharts.Chart.prototype, 'render', function () {
    setTimeout(() => {
        const containerId = this.container.parentNode.id;
        if (containerId === 'containerB') {
            makeRoleButton(this);
        } else if (containerId === 'containerC') {
            makeRoledescription(this);
        } else if (containerId === 'containerD') {
            makeGraphicsRoles(this);
        } else if (containerId === 'containerE') {
            makeLinkWraps(this);
        } else if (containerId === 'containerF') {
            makeLinkWraps(this, true);
        } else if (containerId === 'containerG') {
            makeHTMLOverlay(this);
        }
    }, 1);
});

function makeChart(container, title, expandableLabel) {
    return Highcharts.chart(container, {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        xAxis: {
            type: 'category'
        },
        accessibility: {
            announceNewData: {
                enabled: true
            },
            landmarkVerbosity: 'one',
            screenReaderSection: {
                beforeChartFormat: '<div>{chartTitle}, {typeDescription}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div>'
            },
            point: {
                descriptionFormatter: function (point) {
                    let label = point.name + ', ' + point.y + '.';
                    if (point.series.name === 'Things' && expandableLabel) {
                        label += ' Expandable.';
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
        exporting: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Things',
            colorByPoint: true,
            accessibility: {
                point: {
                    valueDescriptionFormat: expandableLabel ? '{xDescription}{separator}{value}. Expandable.' : '{xDescription}{separator}{value}.'
                }
            },
            data: [{
                name: 'Animals',
                y: 5,
                drilldown: 'animals'
            }, {
                name: 'Fruits',
                y: 2,
                drilldown: 'fruits'
            }, {
                name: 'Cars',
                y: 4,
                drilldown: 'cars'
            }]
        }],
        drilldown: {
            series: [{
                id: 'animals',
                name: 'Animals',
                data: [
                    ['Cats', 4],
                    ['Dogs', 2],
                    ['Cows', 1],
                    ['Sheep', 2],
                    ['Pigs', 1]
                ]
            }, {
                id: 'fruits',
                name: 'Fruits',
                data: [
                    ['Apples', 4],
                    ['Oranges', 2]
                ]
            }, {
                id: 'cars',
                name: 'Cars',
                data: [
                    ['Toyota', 4],
                    ['Opel', 2],
                    ['Volkswagen', 2]
                ]
            }]
        }
    });
}

makeChart('containerA', 'Drilldown with image points', true);
makeChart('containerB', 'Drilldown with button points', true);
makeChart('containerC', 'Drilldown with roledescription points');
makeChart('containerD', 'Drilldown with ARIA graphics roles and roledescription');
makeChart('containerE', 'Drilldown with SVG links');
makeChart('containerF', 'Drilldown with SVG links without destination');
makeChart('containerG', 'Drilldown with HTML overlay');
