const data = [];

for (let i = 0; i < 20; i++) {
    let randomFactor = 0;

    for (let j = 0; j < 10; j++) {
        if (randomFactor <= 0) {
            randomFactor = Math.random() * 8;
        }

        data.push({
            x: j,
            y: i,
            value: randomFactor
        });

        randomFactor--;
    }
}

Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        plotBackgroundImage: 'https://code.highcharts.com/samples/graphics/heatmap-userdata-backgroundimage/exampleScreenshot.png'
    },
    title: {
        text: 'Heatmap displaying user activity on a website'
    },
    yAxis: {
        title: {
            text: undefined
        },
        visible: false
    },
    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#FFFF00'],
            [0.9, '#D22B2B']
        ]
    },
    series: [{
        colsize: 3,
        rowsize: 3,
        data: data,
        interpolation: true,
        opacity: 0.8
    }]
});