Highcharts.chart('container', {
    chart: {
        type: 'pie',
        description: "Respondents' current level of employment. The results clearly reflect the significant unemployment and underemployment of individuals with disabilities, with only 40.7% of respondents being employed full time."
    },

    accessibility: {
        keyboardNavigation: {
            focusBorder: {
                style: {
                    lineWidth: 3,
                    color: '#aa1111',
                    borderRadius: 5
                },
                margin: 4
            }
        }
    },

    title: {
        text: 'WEBAIM survey'
    },

    subtitle: {
        text: 'Level of employment'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },

    series: [{
        name: 'Percentage usage',
        showInLegend: true,
        depth: 40,
        data: [{
            name: 'Full time employment',
            y: 40.7
        }, {
            name: 'Part time employment',
            y: 13.9
        }, {
            name: 'Unemployed',
            y: 45.4
        }]
    }]
});
