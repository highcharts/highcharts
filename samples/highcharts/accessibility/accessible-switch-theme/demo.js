const textBright = '#F0F0F3';

const lightTheme = {
    chart: {
        style: {
            fontFamily: 'Roboto,Arial'
        }
    },

    colors: [
        '#5f98cf',
        '#434348',
        '#49a65e',
        '#f45b5b',
        '#708090',
        '#b68c51',
        '#397550',
        '#c0493d',
        '#4f4a7a',
        '#b381b3'
    ],

    navigator: {
        series: {
            color: '#5f98cf',
            lineColor: '#5f98cf'
        }
    },

    title: {
        style: {
            color: '#333333',
            fontFamily: 'Roboto,Arial'
        }
    },

    subtitle: {
        style: {
            color: '#333333',
            fontFamily: 'Roboto,Arial'
        }
    },

    xAxis: {
        labels: {
            style: {
                color: '#333333'
            }
        },
        title: {
            style: {
                color: '#333333'
            }
        }
    },

    yAxis: {
        labels: {
            style: {
                color: '#333333'
            }
        },
        title: {
            style: {
                color: '#333333'
            }
        }
    }
};

const darkTheme = {
    colors: [
        '#a6f0ff',
        '#70d49e',
        '#e898a5',
        '#007faa',
        '#f9db72',
        '#f45b5b',
        '#1e824c',
        '#e7934c',
        '#dadfe1',
        '#a0618b'
    ],

    chart: {
        backgroundColor: '#1f1f20',
        plotBorderColor: '#606063',
        style: {
            fontFamily: 'Roboto,Arial'
        }
    },
    title: {
        style: {
            color: textBright,
            fontFamily: 'Roboto,Arial'
        }
    },

    subtitle: {
        style: {
            color: textBright,
            fontFamily: 'Roboto,Arial'
        }
    },

    xAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: textBright
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: textBright
            }
        }
    },

    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: textBright
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: textBright
            }
        }
    },

    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: textBright
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                color: textBright
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        },
        map: {
            nullColor: '#353535'
        }
    },

    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: textBright
        },
        activeDataLabelStyle: {
            color: textBright
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#eee'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: textBright
                    }
                },
                select: {
                    fill: '#303030',
                    stroke: '#101010',
                    style: {
                        color: textBright
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: textBright
        },
        labelStyle: {
            color: textBright
        }
    },
    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(180,180,255,0.2)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    }
};

function makeArray(length, populate) {
    return [...new Array(length)].map(populate);
}

function makeChart(constructor, type, series) {
    const capitalizeString = s => s.charAt(0).toUpperCase() + s.slice(1);
    return Highcharts[constructor](`container-${type}`, Highcharts.merge(({
        chart: {
            type: type
        },
        exporting: {
            enabled: false
        },
        title: {
            text: `${capitalizeString(type)} chart`
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: `${capitalizeString(type)} chart showing a 
                selected high contrast theme.`
            },
            landmarkVerbosity: 'one'
        },
        series: series
    })));
}

// Initializing the chartLayout array
let chartLayout = [];

// Setting standard options
Highcharts.setOptions(lightTheme);

// Loop over the regular charts and create them
const createChartLayout = () => {
    [
        ['column', [{
            data: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
        }, {
            colorByPoint: true,
            data: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
        }]],
        ['pie', [{
            dataLabels: {
                enabled: false
            },
            data: makeArray(10, () => 1)
        }]]
    ].forEach(c => chartLayout.push(makeChart('chart', c[0], c[1])));
    // Create map and stock charts
    chartLayout.push(makeChart('stockChart', 'spline', makeArray(10, (_, i) => ({
        data: makeArray(100, () => i + Math.random())
    }))));
    chartLayout.push(makeChart('mapChart', 'map', [{
        joinBy: null,
        mapData: Highcharts.maps['custom/europe'],
        colorByPoint: true,
        data: makeArray(30, () => 1)
    }]));
    return chartLayout;
};
createChartLayout();

const initialOptions = JSON.parse(JSON.stringify(Highcharts.getOptions()));

// Function for destroying all charts in the chartLayout array.
const destroyAllAndReset = () => {
    for (let i = 0; i < chartLayout.length; i++) {
        chartLayout[i].destroy();
    }
    chartLayout = [];
    Highcharts.setOptions(initialOptions);
};

// Adding button functionality
document.getElementById('themeDark').addEventListener('click', () => {
    destroyAllAndReset();
    Highcharts.setOptions(darkTheme);
    createChartLayout();
});
document.getElementById('themeLight').addEventListener('click', () => {
    destroyAllAndReset();
    Highcharts.setOptions(lightTheme);
    createChartLayout();
});
