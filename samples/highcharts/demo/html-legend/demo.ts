declare namespace Highcharts {
    interface ExtendedSeries {
        keepProps: string[];
    }

    interface Series {
        tr?: HTMLElement;
        trRefresh?: boolean;
        last?: string;
        min?: string;
        max?: string;
    }
}

// Plugin to render custom HTML legend and custom HTML tooltip outside chart
// container
(({ addEvent, color, format, Chart, Series, Point }) => {
    const table = document.getElementById('custom-legend'),
        tooltipHeader = document.getElementById('tooltip-header'),
        tooltipSeriesName = document.getElementById('tooltip-series-name'),
        tooltipValue = document.getElementById('tooltip-value'),
        tooltipLastValue = document.getElementById('tooltip-last-value'),
        tooltipMinValue = document.getElementById('tooltip-min-value'),
        tooltipMaxValue = document.getElementById('tooltip-max-value');

    // Do now remove tr while updating the series
    (Series as unknown as Highcharts.ExtendedSeries).keepProps.push('tr');

    addEvent(Chart, 'render', function () {
        const series = this.series;

        // Function to update the tooltip and legend row styles based on hover
        // state
        const highlightRow = () => {
            const valueSuffix =
                this.options.plotOptions.series.custom.valueSuffix,
                name = this.options.plotOptions.series.custom.name;

            tooltipHeader.innerHTML = format(
                this.options.tooltip.headerFormat,
                this.hoverPoint
            );

            if (this.hoverPoint) {
                const tooltipHeaderValue =
                    document.getElementById('tooltip-header-value');
                tooltipHeaderValue.style.backgroundColor =
                    color(this.hoverPoint.color).get() as string;
                tooltipSeriesName.innerHTML =
                    `${this.hoverPoint.x} ${name}`;
                tooltipValue.innerHTML = format(
                    this.options.tooltip.pointFormat,
                    this.hoverPoint
                );
                tooltipLastValue.innerHTML = this.hoverPoint.series.last;
                tooltipMinValue.innerHTML = this.hoverPoint.series.min;
                tooltipMaxValue.innerHTML = this.hoverPoint.series.max;
            } else {
                tooltipSeriesName.innerHTML = `- ${name}`;
                tooltipValue.innerHTML = `- ${valueSuffix}`;
                tooltipLastValue.innerHTML = `- <span>${valueSuffix}</span>`;
                tooltipMinValue.innerHTML = `- <span>${valueSuffix}</span>`;
                tooltipMaxValue.innerHTML = `- <span>${valueSuffix}</span>`;
            }

            series.forEach(s => {
                if (s === this.hoverSeries) {
                    s.tr.classList.add('active');
                } else {
                    s.tr.classList.remove('active');
                }
            });
        };

        // Create a custom legend row for each series if not already created
        series.forEach(s => {
            if (!s.tr || s.trRefresh) {
                if (s.trRefresh) {
                    while (s.tr.firstChild) {
                        s.tr.removeChild(s.tr.lastChild);
                    }
                } else {
                    s.tr = document.createElement('tr');
                }

                const name = document.createElement('td'),
                    dot = document.createElement('span');
                dot.style.display = 'inline-block';
                dot.style.width = '12px';
                dot.style.height = '4px';
                dot.style.backgroundColor =
                    color(s.color).get() as string;
                dot.style.borderRadius = '999px';

                name.appendChild(dot);
                name.appendChild(document.createTextNode(` ${s.name}`));
                name.className = 'series-name';
                s.tr.appendChild(name);

                const last = document.createElement('td'),
                    lastValue = last.innerHTML =
                    s.points[s.points.length - 1].y.toFixed(1) +
                    '<span>' + s.options.custom.valueSuffix + '</span>';
                s.last = lastValue;
                s.tr.appendChild(last);

                const min = document.createElement('td'),
                    minValue = min.innerHTML = s.dataMin.toFixed(1) +
                    '<span>' + s.options.custom.valueSuffix + '</span>';
                s.min = minValue;
                s.tr.appendChild(min);

                const max = document.createElement('td'),
                    maxValue = max.innerHTML = s.dataMax.toFixed(1) +
                    '<span>' + s.options.custom.valueSuffix + '</span>';
                s.max = maxValue;
                s.tr.appendChild(max);

                if (!s.trRefresh) {
                    table.appendChild(s.tr);

                    // Hovering the legend highlights the graph
                    addEvent(s.tr, 'mouseover', () => {
                        s.setState('hover');
                        series.forEach(otherSeries => {
                            if (otherSeries !== s) {
                                otherSeries.setState('inactive');
                            }
                        });
                        this.hoverSeries = s;
                        highlightRow();
                    });

                    // Reset highlight when mouse leaves the row
                    addEvent(s.tr, 'mouseout', () => {
                        series.forEach(otherSeries => {
                            otherSeries.setState('normal');
                        });
                        this.hoverSeries = undefined;
                        highlightRow();
                    });
                }
                delete s.trRefresh;
            }
        });

        // Also update highlight when hovering over the point and series
        addEvent(Point, 'mouseOver', highlightRow);
        addEvent(Series, 'mouseOut', highlightRow);

        // Design hack to allow rounded corners on the plot area
        (this as any).plotBorder.attr({ r: 6 });
    });

    addEvent(Series, 'remove', function () {
        if (this.tr) {
            this.tr.remove();
            delete this.tr;
        }
    });

    addEvent(Series, 'afterUpdate', function () {
        if (this.tr) {
            this.trRefresh = true;
        }
    });

    document.getElementById('tooltip-btn')
        .addEventListener('click', () => {
            (Highcharts.charts[0] as any).exporting.downloadCSV();
        });
})(Highcharts);

Highcharts.chart({
    chart: {
        renderTo: 'container',
        plotBorderWidth: 1,
        spacingTop: 0,
        spacingBottom: 0,
        height: 337
    },

    credits: {
        enabled: false
    },

    data: {
        csv: document.getElementById('csv').innerHTML,
        complete: function (options) {
            // Add custom properties to series
            options.series.forEach(s => {
                s.custom = {
                    icon: {
                        Coal: '<i class="icon-tasks"></i>',
                        Gas: '<i class="icon-fire"></i>',
                        Petroleum: '<i class="icon-truck"></i>',
                        Hydro: '<i class="icon-tint"></i>',
                        Nuclear: '<i class="icon-certificate"></i>',
                        'Net Imports': '<i class="icon-random"></i>',
                        Other: '<i class="icon-briefcase"></i>',
                        Renewables: '<i class="icon-leaf"></i>'
                    }[s.name] || ''
                };
            });
        }
    },

    title: {
        text: void 0
    },

    subtitle: {
        text: void 0
    },

    exporting: {
        enabled: false
    },

    legend: {
        enabled: false
    },

    tooltip: {
        enabled: false, // Because we use a custom tooltip
        headerFormat: `<span id="tooltip-header-label">FUEL TYPE</span>
            <div id="tooltip-header-value">
                {series.options.custom.icon} {series.name}
            </div>`,
        pointFormat: '{point.y:,.1f} {series.options.custom.valueSuffix}'
    },

    xAxis: {
        crosshair: {
            dashStyle: 'Dash'
        },
        lineWidth: 0,
        tickColor: 'var(--border-color-1)'
    },

    yAxis: {
        crosshair: true,
        title: {
            text: 'TWh',
            align: 'high',
            reserveSpace: false,
            x: 13,
            y: 10
        },
        gridLineColor: 'var(--border-color-2)',
        labels: {
            align: 'left',
            x: 3,
            y: -3,
            format: '{divide value 1000}'
        },
        showLastLabel: false
    },

    plotOptions: {
        series: {
            custom: {
                name: 'Electricity Generation',
                valueSuffix: ' GWh'
            },
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            stickyTracking: true,
            events: {
                mouseOut() {}
            }
        }
    }
});
