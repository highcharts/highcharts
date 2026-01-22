function generateData(length) {
    return Array.from({ length }, () => Math.random() * 10);
}

const chart1 = Highcharts.stockChart('container', {
    chart: {
        width: 800
    },
    series: [{
        id: 'main',
        type: 'line',
        data: generateData(50),
        pointInterval: 10000
    }],
    xAxis: {
        dateTimeLabelFormats: {
            day: {
                boundary: '%e. %b - %H:%M'
            }
        }
    }
});

const chart2 = Highcharts.stockChart('container1', {
    chart: {
        width: 800
    },
    series: [{
        id: 'main',
        type: 'line',
        data: generateData(50),
        pointInterval: 2600000000
    }],
    xAxis: {
        dateTimeLabelFormats: {
            month: {
                boundary: '%Y',
                main: '%b'
            }
        }
    }
});

const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');
const pointAmount1 = document.getElementById('pointAmount1');
const pointAmount2 = document.getElementById('pointAmount2');
slider1.addEventListener('input', function () {
    chart1.series[0].update({
        pointInterval: parseInt(slider1.value, 10)
    });
});

slider2.addEventListener('input', function () {
    chart2.series[0].update({
        pointInterval: parseInt(slider2.value, 10)
    });
});

pointAmount1.addEventListener('input', function () {
    chart1.series[0].update({
        data: generateData(parseInt(pointAmount1.value, 10))
    });
});

pointAmount2.addEventListener('input', function () {
    chart2.series[0].update({
        data: generateData(parseInt(pointAmount2.value, 10))
    });
});