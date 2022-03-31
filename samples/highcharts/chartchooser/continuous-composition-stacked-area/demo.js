Highcharts.setOptions({
    colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#FF9655', '#FFF263', '#6AF9C4']
});

Highcharts.chart("container", {
    chart: {
        type: "areaspline"
    },
    title: {
        text: "Msis atmospheric composition by height"
    },
    subtitle: {
        text:
          'Source: <a href="https://en.wikipedia.org/wiki/Atmosphere_of_Earth" target="_blank">Wikipedia.org</a>'
    },
    xAxis: {
        tickmarkPlacement: "on",
        title: {
            text: "Height (km)"
        },
        labels: {
            formatter: function () {
                return this.value * 100;
            }
        }
    },
    yAxis: {
        title: {
            text: "Volume fraction"
        }
    },
    tooltip: {
        shared: true,
        headerFormat: null,
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y}<br/>'
    },
    plotOptions: {
        areaspline: {
            stacking: "normal",
            lineColor: "#666666",
            lineWidth: 1,
            marker: {
                enabled: false
            }
        }
    },
    series: [
        {
            name: "N2",
            data: [78, 78, 48, 10, 2, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "O2",
            data: [21, 21, 2, 1, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Ar",
            data: [0, 1, 60, 84, 71, 43, 8, 2, 0, 0, 0]
        },
        {
            name: "H2",
            data: [0, 0, 1, 5, 25, 62, 82, 82, 82, 71, 64]
        },
        {
            name: "H",
            data: [0, 0, 0, 1, 2, 5, 10, 15, 21, 29, 48]
        }
    ]
});
