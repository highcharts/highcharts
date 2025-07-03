(({ addEvent, Chart }) => {
    const table = document.getElementById("custom-legend"),
        tooltip = document.getElementById("custom-tooltip"),
        tooltipDefault = document.getElementById("tooltip-default"),
        tooltipName = document.getElementById("tooltip-name"),
        tooltipValue = document.getElementById("tooltip-value"),
        icons = {
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

    addEvent(Chart, "render", function () {
        const series = this.series;

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
            }

            this.series.forEach((s) => {
                if (!this.hoverSeries || s === this.hoverSeries) {
                    s.options.custom.tr.classList.remove("inactive");
                } else {
                    s.options.custom.tr.classList.add("inactive");
                }
            });
        };

        series.forEach((s) => {
            if (!s.options.custom.tr) {
                s.options.custom.tr = document.createElement("tr");

                const symbol = document.createElement("th");
                symbol.innerText = "\u25CF";
                symbol.style.color = s.color.toString();
                s.options.custom.tr.appendChild(symbol);

                const name = document.createElement("th");
                name.innerText = s.name;
                s.options.custom.tr.appendChild(name);

                const last = document.createElement("td");
                last.innerHTML =
                    s.points[s.points.length - 1].y.toFixed(1) +
                    s.options.custom.valueSuffix;
                s.options.custom.tr.appendChild(last);

                const min = document.createElement("td");
                min.innerHTML = s.dataMin.toFixed(1) + s.options.custom.valueSuffix;
                s.options.custom.tr.appendChild(min);

                const max = document.createElement("td");
                max.innerHTML = s.dataMax.toFixed(1) + s.options.custom.valueSuffix;
                s.options.custom.tr.appendChild(max);

                table.appendChild(s.options.custom.tr);

                // Hovering the legend highlights the graph
                addEvent(s.options.custom.tr, "mouseover", () => {
                    s.setState("hover");
                    series.forEach((otherSeries) => {
                        if (otherSeries !== s) {
                            otherSeries.setState("inactive");
                        }
                    });
                    this.hoverSeries = s;
                    highlightRow();
                });

                addEvent(s.options.custom.tr, "mouseout", () => {
                    series.forEach((otherSeries) => {
                        otherSeries.setState("normal");
                    });
                    this.hoverSeries = undefined;
                    highlightRow();
                });
            }
        });

        addEvent(this.container, "mouseover", highlightRow);
        addEvent(this.container, "mouseout", highlightRow);
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
