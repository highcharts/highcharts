Highcharts.setOptions({
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
});

const discipline = [{
    name: 'Basketball',
    data: 'basketball'
},
{
    name: 'Triathlon',
    data: 'triathlon'
},
{
    name: 'Volleyball',
    data: 'volleyball'
}
];


async function getData() {
    const response = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@24912efc85/samples/data/olympic2012.json'
    );
    return response.json();
}


getData().then(data => {
    const getData = sportName => {
        const temp = [];
        data.forEach(elm => {
            if (elm.sport === sportName && elm.weight > 0 && elm.height > 0) {
                temp.push([elm.height, elm.weight]);
            }
        });
        return temp;
    };
    const series = [];
    discipline.forEach(e => {
        series.push({
            name: e.name,
            data: getData(e.data)
        });
    });
    const colors = Highcharts.getOptions().colors.map(
        c => Highcharts.color(c).setOpacity(0.5).get()
    );

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        colors,
        title: {
            text: 'Olympics 2012 sport by height and weight'
        },
        subtitle: {
            text:
          'Source: <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">The Guardian</a>'
        },
        xAxis: {
            title: {
                text: 'Height'
            },
            labels: {
                format: '{value} m'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight'
            },
            labels: {
                format: '{value} kg'
            }
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 2.5,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        tooltip: {
            pointFormat: 'Height: {point.x} m <br/> Weight: {point.y} kg'
        },
        series: series
    });
}
);