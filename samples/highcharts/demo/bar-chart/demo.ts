Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Historic World Population by Region'
    },
    subtitle: {
        text: 'Source: <a ' +
            'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
            'target="_blank">Wikipedia.org</a>'
    },
    xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe'],
        title: {
            text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        gridLineWidth: 0
    },
    tooltip: {
        headerFormat: `<svg width="10" height="30" style="position: absolute;">
              <path d="M 1.5 1.5 L 1.5 28.5" stroke="{series.color}"
                stroke-width="3" stroke-linecap="round" />
            </svg>
            <span class="highcharts-header" style="margin-left: 10px;">
                {point.key}
            </span>
            <br>`,
        pointFormat: `<span style="margin: 0 10px;opacity: 0.7;">
                {series.name}
            </span>
            <b>{point.y}</b>`,
        useHTML: true,
        valueSuffix: ' million'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderColor: 'var(--highcharts-neutral-color-10, #e6e6e6)',
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: 'var(--highcharts-background-color, #ffffff)'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
    series: [{
        name: 'Year 1990',
        data: [632, 727, 3202, 721]
    }, {
        name: 'Year 2000',
        data: [814, 841, 3714, 726]
    }, {
        name: 'Year 2021',
        data: [1393, 1031, 4695, 745]
    }]
});
