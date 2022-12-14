Highcharts.chart('container', {
    title: {
        text: 'Average height and weight for men by country',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.worlddata.info/average-bodyheight.php"' +
            'target="_blank">WorldData</a>',
        align: 'left'
    },
    xAxis: {
        gridLineWidth: 1,
        title: {
            enabled: true,
            text: 'Height (cm)'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Weight (kg)'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Target',
        type: 'polygon',
        data: [[163, 42], [162, 46], [162, 55], [163, 64], [164, 70], [170, 90],
            [181, 100], [182, 90], [173, 52], [166, 45]],
        color: Highcharts.color(Highcharts.getOptions()
            .colors[0]).setOpacity(0.5).get(),
        enableMouseTracking: false,
        accessibility: {
            exposeAsGroupOnly: true,
            description: 'Target ranges in an upwards trending diagonal from 161 to 182 on the x axis, and 42 to 100 on the y axis.'
        }
    }, {
        name: 'Observations',
        type: 'scatter',
        color: Highcharts.getOptions().colors[1],
        data: [
            { x: 184, y: 87.9, name: 'Netherlands' },
            { x: 183, y: 90.4, name: 'Montenegro' },
            { x: 182, y: 89.9, name: 'Estonia' },
            { x: 182, y: 86.8, name: 'Denmark' },
            { x: 181, y: 89.2, name: 'Iceland' },
            { x: 181, y: 89.9, name: 'Czechia' },
            { x: 180, y: 89.9, name: 'Serbia' },
            { x: 180, y: 89.9, name: 'Sweden' },
            { x: 180, y: 89.1, name: 'Norway' },
            { x: 180, y: 80.7, name: 'Dominica' },
            { x: 180, y: 86.3, name: 'Finland' },
            { x: 179, y: 88.4, name: 'Bermuda' },
            { x: 179, y: 90.7, name: 'Puerto Rico' },
            { x: 178, y: 84.1, name: 'Belarus' },
            { x: 178, y: 103.7, name: 'Cook Islands' },
            { x: 177, y: 98.8, name: 'Niue' },
            { x: 177, y: 103.2, name: 'American Samoa' },
            { x: 176, y: 80.3, name: 'Russia' },
            { x: 176, y: 91.1, name: 'Saint Lucia' },
            { x: 175, y: 67.0, name: 'Senegal' },
            { x: 175, y: 93.7, name: 'Tonga' },
            { x: 174, y: 74.6, name: 'Algeria' },
            { x: 174, y: 84.7, name: 'Argentina' },
            { x: 174, y: 79.5, name: 'Portugal' },
            { x: 173, y: 73.6, name: 'Mauritius' },
            { x: 173, y: 91.8, name: 'Samoa' },
            { x: 172, y: 69.5, name: 'Japan' },
            { x: 172, y: 74.0, name: 'Bahrain' },
            { x: 171, y: 64.1, name: 'Chad' },
            { x: 171, y: 88.0, name: 'Tuvalu' },
            { x: 171, y: 67.8, name: 'Sudan' },
            { x: 170, y: 58.8, name: 'Eritrea' },
            { x: 170, y: 63.9, name: 'Kenya' },
            { x: 170, y: 74.7, name: 'Mongolia' },
            { x: 170, y: 65.1, name: 'Nigeria' },
            { x: 169, y: 93.0, name: 'Nauru' },
            { x: 169, y: 81.1, name: 'Micronesia' },
            { x: 169, y: 64.9, name: 'Ghana' },
            { x: 169, y: 71.9, name: 'South Africa' },
            { x: 168, y: 61.2, name: 'Vietnam' },
            { x: 168, y: 65.9, name: 'Ivory Coast' },
            { x: 168, y: 69.2, name: 'Maldives' },
            { x: 168, y: 56.5, name: 'Ethiopia' },
            { x: 167, y: 74.2, name: 'Ecuador' },
            { x: 167, y: 60.5, name: 'Burundi' },
            { x: 166, y: 69.6, name: 'India' },
            { x: 166, y: 74.7, name: 'Brunei' },
            { x: 165, y: 57.7, name: 'Bangladesh' },
            { x: 165, y: 58.4, name: 'Madagascar' },
            { x: 165, y: 61.8, name: 'Philippines' },
            { x: 164, y: 60.5, name: 'Nepal' },
            { x: 164, y: 69.1, name: 'Guatemala' },
            { x: 163, y: 62.5, name: 'Yemen' },
            { x: 162, y: 59.5, name: 'Laos' },
            { x: 159, y: 53.9, name: 'Timor-Leste' }
        ]

    }],
    tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '{point.x} cm, {point.y} kg'
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    layout: 'horizontal',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
});
