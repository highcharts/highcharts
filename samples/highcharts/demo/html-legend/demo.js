(({ addEvent, Chart }) => {
    const table = document.getElementById('custom-legend'),
        tooltip = document.getElementById('custom-tooltip'),
        tooltipDefault = document.getElementById('tooltip-default'),
        tooltipName = document.getElementById('tooltip-name'),
        tooltipValue = document.getElementById('tooltip-value'),
        icons = {
            Year: '📅',
            Coal: '🏭',
            Gas: '🔥',
            Petroleum: '⛽️',
            Hydro: '💧',
            Nuclear: '☢️',
            'Net Imports': '🚢',
            Other: '🔧',
            Renewables: '🌱'
        };


    addEvent(Chart, 'render', function () {
        const series = this.series;

        const highlightRow = () => {
            if (this.hoverPoint) {
                tooltipDefault.style.display = 'none';
                tooltipName.innerHTML = '<b>Fuel type</b>: ' +
                    this.hoverPoint.series.name + ' ' +
                    icons[this.hoverPoint.series.name];
                tooltipValue.innerHTML = '<b>Elec. Gen.</b>: ' +
                    this.hoverPoint.y +
                    this.hoverPoint.series.options.custom.valueSuffix;
                tooltip.style.borderColor = this.hoverPoint.series.color;
            } else {
                tooltipDefault.style.display = 'block';
                tooltipName.innerHTML = tooltipValue.innerHTML = '';
            }

            this.series.forEach(s => {
                if (!this.hoverSeries || s === this.hoverSeries) {
                    s.tr.classList.remove('inactive');
                } else {
                    s.tr.classList.add('inactive');
                }
            });
        };

        series.forEach(s => {
            if (!s.tr) {
                s.tr = document.createElement('tr');

                const symbol = document.createElement('th');
                symbol.innerText = '\u25CF';
                symbol.style.color = s.color;
                s.tr.appendChild(symbol);

                const name = document.createElement('th');
                name.innerText = s.name;
                s.tr.appendChild(name);

                const last = document.createElement('td');
                last.innerHTML = s.getColumn('y').at(-1).toFixed(1) +
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

                addEvent(s.tr, 'mouseout', () => {
                    series.forEach(otherSeries => {
                        otherSeries.setState('normal');
                    });
                    this.hoverSeries = undefined;
                    highlightRow();
                });
            }
        });

        addEvent(this.container, 'mouseover', highlightRow);
        addEvent(this.container, 'mouseout', highlightRow);
    });
})(Highcharts);

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    data: {
        csv: document.getElementById('csv').innerHTML
    },

    title: {
        text: 'Electricity Generation by Fuel Type in New York State (GWh), ' +
            '1980–2021'
    },

    subtitle: {
        text: 'Data source: https://data.gov/'
    },

    legend: {
        enabled: false
    },

    tooltip: {
        enabled: false
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
                valueSuffix: '&nbsp;GWh'
            },
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            stickyTracking: false
        }
    }
});
