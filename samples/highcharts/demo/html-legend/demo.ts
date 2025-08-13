// Mapping series names to small icon-like symbols (used in tooltip display)
const icons = {
    Year: "📅",
    Coal: "🏭",
    Gas: "🔥",
    Petroleum: "⛽️",
    Hydro: "💧",
    Nuclear: "☢️",
    "Net Imports": "🚢",
    Other: "🔧",
    Renewables: "🌱",
};

// Plugin to render custom HTML legend and custom HTML tooltip outside chart
// container
(({ addEvent, Chart, Series }) => {
    const table = document.getElementById("custom-legend"),
        tooltip = document.getElementById("custom-tooltip"),
        tooltipDefault = document.getElementById("tooltip-default"),
        tooltipName = document.getElementById("tooltip-name"),
        tooltipValue = document.getElementById("tooltip-value");

    // Do now remove tr while updating the series
    Series.keepProps.push('tr');

    addEvent(Chart, "render", function (this: typeof Chart) {
        const series = this.series;

        // Function to update the tooltip and legend row styles based on hover state
        const highlightRow = () => {
            if (this.hoverPoint) {
                tooltipDefault.style.display = "none";
                tooltipName.innerHTML =
                    "<b>Fuel type</b>: " +
                    this.hoverPoint.series.name +
                    " " +
                    icons[this.hoverPoint.series.name as keyof typeof icons];
                tooltipValue.innerHTML =
                    "<b>Elec. Gen.</b>: " +
                    this.hoverPoint.y +
                    this.hoverPoint.series.options.custom.valueSuffix;
                tooltip.style.borderColor = this.hoverPoint.series.color.toString();
            } else {
                tooltipDefault.style.display = "block";
                tooltipName.innerHTML = tooltipValue.innerHTML = "";
                tooltip.style.borderColor = "gray";
            }

            this.series.forEach((s: typeof Series) => {
                if (!this.hoverSeries || s === this.hoverSeries) {
                    s.tr.classList.remove("inactive");
                } else {
                    s.tr.classList.add("inactive");
                }
            });
        };

        // Create a custom legend row for each series if not already created
        series.forEach((s: typeof Series) => {
            console.log(s.name, s.tr);
            if (!s.tr || s.tr.refresh) {
                if (s.tr?.refresh) {
                    while (s.tr.firstChild) {
                        s.tr.removeChild(s.tr.lastChild);
                    }
                } else {
                    s.tr = document.createElement("tr");
                }

                const symbol = document.createElement("th");
                symbol.innerText = "\u25CF";
                symbol.style.color = s.color.toString();
                s.tr.appendChild(symbol);

                const name = document.createElement("th");
                name.innerText = s.name;
                s.tr.appendChild(name);

                const last = document.createElement("td");
                last.innerHTML =
                    s.points[s.points.length - 1].y.toFixed(1) +
                    s.options.custom.valueSuffix;
                s.tr.appendChild(last);

                const min = document.createElement("td");
                min.innerHTML = s.dataMin.toFixed(1) + s.options.custom.valueSuffix;
                s.tr.appendChild(min);

                const max = document.createElement("td");
                max.innerHTML = s.dataMax.toFixed(1) + s.options.custom.valueSuffix;
                s.tr.appendChild(max);

                if (!s.tr.refresh) {
                    table.appendChild(s.tr);

                    // Hovering the legend highlights the graph
                    addEvent(s.tr, "mouseover", () => {
                        s.setState("hover");
                        series.forEach((otherSeries: typeof Series) => {
                            if (otherSeries !== s) {
                                otherSeries.setState("inactive");
                            }
                        });
                        this.hoverSeries = s;
                        highlightRow();
                    });

                    // Reset highlight when mouse leaves the row
                    addEvent(s.tr, "mouseout", () => {
                        series.forEach((otherSeries: typeof Series) => {
                            otherSeries.setState("normal");
                        });
                        this.hoverSeries = undefined;
                        highlightRow();
                    });
                }
                delete s.tr.refresh;
            }
        });

        // Also update highlight when hovering over chart area itself
        addEvent(this.container, "mouseover", highlightRow);
        addEvent(this.container, "mouseout", highlightRow);
    });

    addEvent(Series, 'remove', function(this: typeof Series) {
        if (this.tr) {
            this.tr.remove();
            delete this.tr;
        }
    });

    addEvent(Series, 'afterUpdate', function(this: typeof Series) {
        if (this.tr) {
            this.tr.refresh = true;
        }
    });
})(Highcharts);

Highcharts.chart("container", {
    chart: {
        type: "spline",
    },
    data: {
        csv: document.getElementById("csv").innerHTML,
    },

    title: {
        text:
            "Electricity Generation by Fuel Type in New York State (GWh), " +
            "1980–2021",
    },

    subtitle: {
        text: 'Data source: <a style="color: #ddd" href="https://data.gov/">U.S. Government\'s Open Data</a>',
    },

    legend: {
        enabled: false,
    },

    tooltip: {
        enabled: false,
    },

    xAxis: {
        title: {
            text: "Year",
        },
    },

    yAxis: {
        title: {
            text: "Electricity Generation (GWh)",
        },
    },

    plotOptions: {
        series: {
            custom: {
                valueSuffix: "&nbsp;GWh",
            },
            marker: {
                enabled: false,
                symbol: "circle",
            },
            stickyTracking: false,
        },
    },
});
