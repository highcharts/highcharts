const origChartWidth = 360,
    origChartHeight = 300;

let chartWidth = origChartWidth,
    chartHeight = origChartHeight;

const chart = Highcharts.chart('container', {
    chart: {
        width: origChartWidth,
        height: origChartHeight
    },
    title: {
        text: 'Click buttons to resize'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});

const container = document.getElementById('container');

// create some buttons to test the resize logic
const up = document.createElement('button');
up.innerText = '+';
up.className = 'highcharts-demo-button';
up.addEventListener('click', () => {
    chartWidth *= 1.1;
    chartHeight *= 1.1;
    chart.setSize(chartWidth, chartHeight);
});
container.before(up);

const down = document.createElement('button');
down.innerText = '-';
down.className = 'highcharts-demo-button';
down.addEventListener('click', () => {
    chartWidth *= 0.9;
    chartHeight *= 0.9;
    chart.setSize(chartWidth, chartHeight);
});
container.before(down);

const orig = document.createElement('button');
orig.innerText = '1:1';
orig.className = 'highcharts-demo-button';
orig.addEventListener('click', () => {
    chartWidth = origChartWidth;
    chartHeight = origChartHeight;
    chart.setSize(origChartWidth, origChartHeight);
});
container.before(orig);
