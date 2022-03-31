Highcharts.chart("container", {
    chart: {
        type: "spline"
    },
    title: {
        text: "Operating Systems Trends"
    },
    subtitle: {
        text:
        'Source: <a href="https://trends.google.com/trends/explore?date=all&q=%2Fm%2F02wxtgw,%2Fm%2F03wbl14,%2Fm%2F04r_8,%2Fm%2F0fpzzp,%2Fm%2F055yr">Google Trends </a>'
    },

    yAxis: {
        max: 100,
        title: {
            enabled: false
        }
    },
    tooltip: {
        shared: true,
        xDateFormat: "%Y-%m",
        crosshairs: true,
        useHTML: true,
        headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
        pointFormat:
        "<tr><td>{series.name} </td>" +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
        footerFormat: "</table>"
    },

    data: {
        csvURL:
        "https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/operatingSystemsTrends.csv"
    }
});
