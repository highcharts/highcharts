const getOptions = () => ({
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'line'
    }]
});

Highcharts.chart('container', getOptions());

document.getElementById('form').addEventListener('submit', e => {

    console.clear();
    e.preventDefault();

    const options = getOptions();
    options.title = {
        text: document.getElementById('title').value,
        useHTML: document.getElementById('useHTML').checked
    };
    options.legend = {
        labelFormat: document.getElementById('title').value,
        useHTML: document.getElementById('useHTML').checked
    };

    Highcharts.chart('container', options);

});
