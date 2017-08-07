

function getRandomData() {
    return ['Cats', 'Dogs', 'Rabbits', 'Cows', 'Sheep', 'Hens', 'Horses']
        .map(function (name) {
            var data = [],
                seriesWeight = Math.random(),
                rand;
            for (var i = 0; i < 30; i++) {
                rand = seriesWeight * i;
                data.push(Math.round(rand + Math.random() * rand));
            }
            return {
                name: name,
                data: data
            };
        });
}
Highcharts.chart('container', {

    chart: {
        type: 'streamgraph'
    },

    title: {
        text: 'Highcharts streamgraph study'
    },

    yAxis: {
        opposite: true,
        title: {
            text: 'Number of animals'
        }
    },

    plotOptions: {
        series: {
            pointStart: 1987
        }
    },

    series: getRandomData()

});