// Configure the chart
const chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Highcharts axis visibility'
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Oranges', 'Peaches']
    },
    yAxis: {
        allowDecimals: false,
        title: {
            text: 'Fruit'
        },
        visible: false
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        data: [1, 3, 2, 4],
        name: 'Ola'
    }, {
        data: [5, 4, 5, 2],
        name: 'Kari'
    }]
});

let yVisible = false;
let xVisible = true;

document.getElementById('toggle-y').addEventListener('click', () => {
    yVisible = !yVisible;
    chart.yAxis[0].update({
        visible: yVisible
    });
});

document.getElementById('toggle-x').addEventListener('click', () => {
    xVisible = !xVisible;
    chart.xAxis[0].update({
        visible: xVisible
    });
});
