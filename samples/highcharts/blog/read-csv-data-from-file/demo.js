Highcharts.chart("container", {
    chart: {
        type: "spline"
    },
    title: {
        text: "Google searches for vitamin D 2004 - 2022"
    },
    legend: {
        enabled: false
    },
    subtitle: {
        text: "Source:Google trends"
    },
    data: {
        csvURL:
      "https://cdn.jsdelivr.net/gh/highcharts/highcharts@12fb8dea0e/samples/data/google-trends-vitamin-d.csv"
    },

    tooltip: {
        xDateFormat: '%Y-%m'
    },

    xAxis: {
        type: "datetime"
    },
    yAxis: {
        max: 100,
        min: 0,
        title: { text: null }
    }
});
