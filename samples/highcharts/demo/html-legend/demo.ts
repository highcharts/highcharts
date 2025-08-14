declare namespace Highcharts {
    interface Series {
        tr?: HTMLElement;
        trRefresh?: boolean;
    }
}

// Plugin to render custom HTML legend and custom HTML tooltip outside chart
// container
(({ addEvent, format, Chart, Series }) => {
    const table = document.getElementById('custom-legend'),
        tooltip = document.getElementById('custom-tooltip'),
        tooltipDefault = document.getElementById('tooltip-default'),
        tooltipName = document.getElementById('tooltip-name'),
        tooltipValue = document.getElementById('tooltip-value');

    // Do now remove tr while updating the series
    (Series as typeof Series & { keepProps: string[] }).keepProps.push('tr');

    addEvent(Chart, 'render', function () {
        const series = this.series;

        // Function to update the tooltip and legend row styles based on hover
        // state
        const highlightRow = () => {
            if (this.hoverPoint) {
                tooltipDefault.style.display = 'none';
                tooltipName.innerHTML = format(
                    this.options.tooltip.headerFormat,
                    this.hoverPoint
                );
                tooltipValue.innerHTML = format(
                    this.options.tooltip.pointFormat,
                    this.hoverPoint
                );
                if (typeof this.hoverPoint.series.color === 'string') {
                    tooltip.style.borderColor = this.hoverPoint.series.color;
                }
            } else {
                tooltipDefault.style.display = 'block';
                tooltipName.innerText = tooltipValue.innerText = '';
                tooltip.style.borderColor = 'gray';
            }

            series.forEach(s => {
                if (!this.hoverSeries || s === this.hoverSeries) {
                    s.tr.classList.remove('inactive');
                } else {
                    s.tr.classList.add('inactive');
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

                const symbol = document.createElement('th');
                symbol.innerText = '\u25CF';
                if (typeof s.color === 'string') {
                    symbol.style.color = s.color;
                }
                s.tr.appendChild(symbol);

                const name = document.createElement('th');
                name.innerText = s.name;
                s.tr.appendChild(name);

                const last = document.createElement('td');
                last.innerHTML =
                    s.points[s.points.length - 1].y.toFixed(1) +
                    s.options.custom.valueSuffix;
                s.tr.appendChild(last);

                const min = document.createElement('td');
                min.innerHTML = s.dataMin.toFixed(1) +
                    s.options.custom.valueSuffix;
                s.tr.appendChild(min);

                const max = document.createElement('td');
                max.innerHTML = s.dataMax.toFixed(1) +
                    s.options.custom.valueSuffix;
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

        // Also update highlight when hovering over chart area itself
        addEvent(this.container, 'mouseover', highlightRow);
        addEvent(this.container, 'mouseout', highlightRow);
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
})(Highcharts);

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        complete: function (options) {
            // Add custom properties to series
            options.series.forEach(s => {
                s.custom = {
                    icon: {
                        Year: '📅',
                        Coal: '🏭',
                        Gas: '🔥',
                        Petroleum: '⛽️',
                        Hydro: '💧',
                        Nuclear: '☢️',
                        'Net Imports': '🚢',
                        Other: '🔧',
                        Renewables: '🌱'
                    }[s.name] || ''
                };
            });
        }
    },

    title: {
        text:
            'Electricity Generation by Fuel Type in New York State (GWh), ' +
            '1980-2021'
    },

    subtitle: {
        text: `Data source: <a style="color: #ddd" href="https://data.gov/">
            U.S. Government's Open Data</a>`
    },

    legend: {
        enabled: false
    },

    tooltip: {
        enabled: false, // Because we use a custom tooltip
        headerFormat: `<b>Fuel type</b>:
            {series.name} {series.options.custom.icon}<br/>`,
        pointFormat: `<b>Electricity Generation</b>:
            <span class="tooltip-value">
                {point.y:,.1f} {series.options.custom.valueSuffix}
            </span>`
    },

    xAxis: {
        title: {
            text: 'Year'
        }
    },

    yAxis: {
        title: {
            text: 'Electricity Generation (GWh)'
        }
    },

    plotOptions: {
        series: {
            custom: {
                valueSuffix: ' GWh'
            },
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            stickyTracking: false
        }
    }
});
