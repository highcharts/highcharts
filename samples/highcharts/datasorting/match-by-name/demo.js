function getYear1800() {
    return [
        ['Asia', 635],
        ['Europe', 203],
        ['Africa', 107],
        ['America', 31],
        ['Oceania', 2]
    ];
}

function getYear1900() {
    return [
        ['Asia', 947],
        ['Europe', 408],
        ['America', 156],
        ['Africa', 133],
        ['Oceania', 6]
    ];
}

function getYear2000() {
    return [
        ['Asia', 3714],
        ['America', 841],
        ['Africa', 814],
        ['Europe', 727],
        ['Oceania', 31]
    ];
}

var chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Historic World Population by Region'
    },
    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
    },
    xAxis: {
        type: 'category',
        labels: {
            animate: true
        },
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' millions'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        dataSorting: {
            enabled: true,
            matchByName: true
        },
        name: 'Year 1800',
        data: getYear1800()
    }]
});

setTimeout(function () {
    chart.series[0].update({
        name: 'Year 1900',
        data: getYear1900()
    });
}, 2000);

setTimeout(function () {
    chart.series[0].update({
        name: 'Year 2000',
        data: getYear2000()
    });
}, 4000);
