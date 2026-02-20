Highcharts.Color.parsers.push({
    regex: /^hsl\s+(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/u,
    parse: result => {
        const hue = ((Number.parseFloat(result[1]) % 360) + 360) % 360;
        const saturation = Math.max(
            0,
            Math.min(100, Number.parseFloat(result[2]))
        ) / 100;
        const lightness = Math.max(
            0,
            Math.min(100, Number.parseFloat(result[3]))
        ) / 100;
        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const huePrime = hue / 60;
        const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

        let red = 0;
        let green = 0;
        let blue = 0;

        if (huePrime < 1) {
            red = chroma;
            green = x;
        } else if (huePrime < 2) {
            red = x;
            green = chroma;
        } else if (huePrime < 3) {
            green = chroma;
            blue = x;
        } else if (huePrime < 4) {
            green = x;
            blue = chroma;
        } else if (huePrime < 5) {
            red = x;
            blue = chroma;
        } else {
            red = chroma;
            blue = x;
        }

        const match = lightness - (chroma / 2);

        return [
            Math.round((red + match) * 255),
            Math.round((green + match) * 255),
            Math.round((blue + match) * 255),
            1
        ];
    }
});

const colors = [
    'hsl 0 100 50',
    'hsl 30 100 50',
    'hsl 120 60 45',
    'hsl 210 70 50',
    'hsl 275 55 45',
    'hsl 15 45 35'
].map(color => Highcharts.color(color).get());

Highcharts.chart('container', {
    title: {
        text: 'HSL colors'
    },
    colors,
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
