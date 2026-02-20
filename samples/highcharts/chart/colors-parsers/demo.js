const colorParserCanvas = document.createElement('canvas');
const colorParserContext = colorParserCanvas.getContext('2d');

colorParserCanvas.width = 1;
colorParserCanvas.height = 1;

Highcharts.Color.parsers.push({
    regex: /^[a-z]+$/u,
    parse: result => {
        if (
            !colorParserContext ||
            typeof CSS === 'undefined' ||
            !CSS.supports('color', result[0])
        ) {
            return;
        }

        colorParserContext.clearRect(0, 0, 1, 1);
        colorParserContext.fillStyle = result[0];
        colorParserContext.fillRect(0, 0, 1, 1);

        const [r, g, b, a] = colorParserContext.getImageData(0, 0, 1, 1).data;

        return [r, g, b, a / 255];
    }
});

Highcharts.chart('container', {
    title: {
        text: 'Named colors'
    },
    colors: ['red', 'orange', 'green', 'blue', 'purple', 'brown'],
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },
    series: [{
        data: [4, 3, 5, 4, 6, 1],
        type: 'column',
        colorByPoint: true
    }]
});
