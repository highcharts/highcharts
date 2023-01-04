// theme for planets
const themeColors = ['#31dcff', '#88e276', '#fe874c', '#c1e160', '#53f7fc', '#64E572', '#ff81ce', '#ffe372', '#d5b5e7'];

Highcharts.theme = {
    colors: themeColors,
    chart: {
        backgroundColor: 'transparent'
    }
};


// Apply the theme
Highcharts.setOptions(Highcharts.theme);
const animate = true;

// planet data/info
const gasLabels = ['C0<sub>2</sub>', 'N', 'CH<sub>4</sub>', 'Ar', 'O', 'Na', 'H', 'He', 'Other'];
const gases = ['Carbon<br>Dioxide', 'Nitrogen', 'Methane', 'Argon', 'Oxygen',  'Sodium', 'Hydrogen', 'Helium', 'Other'];
const gasStyles = ['carbon-dioxide', 'nitrogen', 'methane', 'argon', 'oxygen', 'sodium', 'hydrogen', 'helium', 'other'];
const srcURL = 'https://www.highcharts.com/samples/graphics/homepage/';
const planetImages = [
    'sun',
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune'
];
const planets = [
    'The Sun',
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune'];
// /these correspond to the gases
const atmosphereData = [
    [0, 0, 96, 0, 95, 0, 0, 0, 0],
    [0, 0, 3, 78, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2.5, 0.5],
    [0, 0, 0, 1, 1.5, 0, 0, 0, 0],
    [0, 42, 0, 20, 0, 0, 0, 0, 0],
    [0, 29, 0, 0, 0, 0, 0, 0, 0],
    [91, 22, 0, 0, 0, 90, 96, 83, 80],
    [9, 0, 0, 0, 0, 9, 3, 14.5, 19],
    [0, 7, 1, 1, 0.5, 1, 1, 0, 0.5]
];
// /which legend labels to highlight
// based on series index
const planetSeries = [
    [6, 7],
    [4, 5, 6, 8],
    [0, 1, 8],
    [1, 3, 4, 8],
    [0, 1, 3, 8],
    [6, 7, 8],
    [6, 7, 8],
    [2, 6, 7, 8],
    [2, 6, 7, 8]
];
// which planet to start with
const startIndex = 6;

// /build the planet data
function buildData(chart, planet) {
    const planetIndex = planets.findIndex(function (p) {
        return p === planet;
    });

    setTimeout(function () {
        // /pick the correct gas data point from each
        // /from each atmosphere array
        for (let ii = 0; ii < chart.series.length; ++ii) {
            const dataPoint = atmosphereData[ii][planetIndex];
            chart.series[ii].update({
                data: [dataPoint]
            });
        }
    }, 300);

    setTimeout(function () {
        const seriesToShow = planetSeries[planetIndex];
        chart.series.forEach(function (s) {
            for (let jj = 0; jj < seriesToShow.length; ++jj) {
                if (s.index === seriesToShow[jj]) {
                    const series = seriesToShow[jj];
                    const planet = planetImages[planetIndex];
                    const gas = gasStyles[series];
                    const label = $('#gas' + series);
                    const dataLabel = $('.highcharts-data-label-color-' + seriesToShow[jj] + ' .gas-label');
                    $(dataLabel).addClass('on');
                    const color = '#000';// Highcharts.color(themeColors[seriesToShow[jj]]).brighten(-0.7).get('rgb');
                    // chart.series[series].show();
                    $(label).addClass(gas);
                    $(label).addClass('on');
                    $(label).find('.planets-element-value').css({ color: color });
                    $(label).find('.planets-element-symbol').css({ color: color });
                    $(label).find('.planets-element-name').css({ color: color });
                    $(dataLabel).addClass(planet);
                    $(dataLabel).addClass(gas);


                }

            }
        });
    }, 700);
}

// /function for styling the title
// /and series properties based on chart size
const planetStyles = function (index, chart) {
    const title = planets[index];
    let titleHTML = '<div class="planets-chart-title">Atmospheric composition of</div>';
    titleHTML += '<div class="planets-title-container" style="display:none">';
    titleHTML += ' <h3 class="planets">' + title + '</h3></div>';
    chart.update({
        title: {
            text: titleHTML
        }
    });
    // /set the background image to the right planet and show it
    $('.planets-title-container').css({ backgroundImage: 'url(' + srcURL + planetImages[index] + '.png)' });
    $('.planets-title-container').fadeIn(1000);

};

Highcharts.chart('container', {
    chart: {
        type: 'column',
        polar: true,
        inverted: true,
        backgroundColor: 'transparent'
    },
    title: {
        useHTML: true,
        text: '',
        style: {
            fontFamily: 'Arial',
            fontSize: '14px'
        },
        align: 'center',
        x: -115,
        y: 75
    },
    legend: {
        enabled: true,
        symbolRadius: 0,
        symbolHeight: 0,
        symbolWidth: 0,
        symbolPadding: 0,
        padding: 0,
        align: 'center',
        floating: true,
        x: 22,
        itemWidth: 55,
        itemDistance: 5,
        zIndex: 20,
        useHTML: true,
        labelFormatter: function () {
            let data = this.yData[0] + '%';
            const index = this.index;
            if (data === 'undefined%') {
                data = '--';
            }
            let htmlString = '<div id="gas' + index + '" class="planets-element-box">';
            htmlString += '<div class="planets-element-symbol">' + gasLabels[index] + '</div>';
            htmlString += '<div class="planets-element-value">' + data + '</div>';
            htmlString += '<div class="planets-element-name">'  + gases[index] + '</div></div>';
            return htmlString;
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    xAxis: [{
        type: 'category',
        categories: ['The Sun'],
        labels: {
            style: {
                color: 'transparent'
            }
        }
    }],
    yAxis: {
        lineWidth: 0,
        tickInterval: 5,
        reversedStacks: true,
        endOnTick: true,
        showLastLabel: true,
        max: 100
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function () {
                    return false;
                }
            },
            stacking: 'normal',
            zIndex: 10,
            pointWidth: 30,
            size: '100%',
            dataLabels: {
                enabled: true,
                allowOverlap: true,
                style: {
                    color: '#000'
                },
                useHTML: true,
                formatter: function () {
                    const index = this.colorIndex;
                    let htmlString = '<div class="gas-label" style="position:absolute;';
                    htmlString += 'border-radius:4px;padding:4px;';
                    htmlString += ';background-color:#fff;">' + gases[index] + ': ' + this.y + '% </div>';
                    if (this.y > 0) {
                        return htmlString;
                    }
                }
            }
        }
    },
    series: [{
        name: 'Carbon Dioxide',
        data: [],
        visible: true
    },
    {
        name: 'Nitrogen',
        data: [],
        visible: true
    },
    {
        name: 'Methane',
        data: [],
        visible: true
    },
    {
        name: 'Argon',
        data: [],
        visible: true
    },
    {
        name: 'Oxygen',
        data: [],
        visible: true
    },
    {
        name: 'Sodium',
        data: [],
        visible: true
    },
    {
        name: 'Hydrogen',
        data: [],
        visible: true
    },
    {
        name: 'Helium',
        data: [],
        visible: true
    },
    {
        name: 'Other',
        data: [],
        visible: true
    }
    ],
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    pane: {
                        size: '80%',
                        innerSize: '70%',
                        center: ['50%', '40%'],
                        startAngle: -90,
                        endAngle: 90
                    },
                    legend: {
                        width: 200,
                        y: -80
                    }
                }
            },
            {
                condition: {
                    minWidth: 399
                },
                chartOptions: {
                    pane: {
                        size: '70%',
                        innerSize: '65%',
                        center: ['50%', '47%'],
                        startAngle: -90,
                        endAngle: 90
                    },
                    legend: {
                        width: 280,
                        y: -125
                    }
                }
            }
        ]
    }

},
function () {
    const chart = this;
    let name = planets[startIndex];
    buildData(chart, name);
    planetStyles(startIndex, chart);
    let count = 0;
    if (animate === true) {
        setInterval(function () {
            $('.planets-title-container').fadeOut(1000);
            setTimeout(function () {
                // /build the chart data
                name = planets[count];
                buildData(chart, name);
            }, 1000);
            setTimeout(function () {
                // /style the chart
                planetStyles(count, chart);
            }, 1500);
            count = count + 1;
            if (count === planets.length) {
                count = 0;
            }
        }, 3500);
    }
});
$('.planets-element-box').click(function () {
    console.log('clicked');
});
