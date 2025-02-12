// Store settings for each chart instance
const chartSettingsMap = {};

// Colors for light theme
const defaultColorsLight = ['#90D2FE', '#ffb8b8'],
    contrastColorsLight = ['#247eb3', '#dd3636'],
    borderColorsLight = contrastColorsLight,
    borderColorsWithContrastLight = ['#103042', '#561515'];

// Colors for dark theme
const defaultColorsDark = ['#015288', '#A80000'],
    contrastColorsDark = ['#16A0FD', '#FE6264'],
    borderColorsDark = contrastColorsDark,
    borderColorsWithContrastDark = ['#FFFFFF', '#FFFFFF'];

// Defining description formats for verbosity
const shortPointDescriptionFormat =
    '{point.category}, {(point.y):,.0f} (1000 MT).';
const fullPointDescriptionFormat =  'Bar {add index 1} of ' +
    '{point.series.points.length} in series {point.category}, ' +
    '{point.series.name}: {(point.y):,.0f} (1000 MT).';

// Adding descriptions to chart
const columnChartDesc = 'This bar chart compares the estimated production ' +
                'of corn and wheat for 2023 across six countries: ' +
                'the USA, China, Brazil, the EU, Argentina, and India. ' +
                'Corn production significantly exceeds wheat production ' +
                'in countries like the USA and Brazil, while wheat ' +
                'production surpasses corn in the EU. The chart uses ' +
                'metric tons (MT) as the unit and highlights data sourced ' +
                'from IndexMundi.';

const scatterChartDesc = 'This scatter plot displays the relationship ' +
            'between height and weight for a sample of 154 individuals, ' +
            'consisting of 124 males and 30 females. The x-axis represents ' +
            'height in centimeters, while the y-axis shows weight in ' +
            'kilograms. The chart provides insights into the distribution ' +
            'of body measurements across both genders, showcasing trends ' +
            'and variations within the dataset.';

const descFemale = 'This series contains the heights and weights ' +
                'of a group of 30 women with heights ranging from 147 cm ' +
                'to 183 cm and weights between 42 kg and 105 kg. ' +
                'The average height for the females are 165.8 cm, the ' +
                'average weight is 58.2 kg.';

const descMale = 'This series contains the heights and weights ' +
                'of a group of 124 men, with heights ranging from 157 cm ' +
                'to 198 cm and weights between 54 kg and 116 kg. The ' +
                'average height for the males is 174.3 cm, and the average ' +
                'weight is 80.7 kg.';

const lightTheme = {
    colors: defaultColorsLight,
    contrastColors: contrastColorsLight,
    borderColors: borderColorsLight,
    borderColorsWithContrast: borderColorsWithContrastLight,
    chart: {
        backgroundColor: '#ffffff',
        style: {
            color: '#000000'
        }
    },
    title: {
        style: {
            color: '#000000'
        }
    },
    subtitle: {
        style: {
            color: '#000000'
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#000000'
            }
        },
        title: {
            style: {
                color: '#000000'
            }
        }
    },
    xAxis: {
        labels: {
            style: {
                color: '#000000'
            }
        }
    },
    legend: {
        itemStyle: {
            color: '#000000'
        },
        backgroundColor: '#ffffff'
    },
    credits: {
        style: {
            color: '#000000'
        }
    },
    tooltip: {
        backgroundColor: '#ffffff',
        style: {
            color: '#000000'
        }
    },
    outsideChart: {
        backgroundColor: '#ffffff',
        textColor: '#000000'
    },
    button: {
        backgroundColor: 'lightgray',
        textColor: 'black'
    }
};

const darkTheme = {
    colors: defaultColorsDark,
    contrastColors: contrastColorsDark,
    borderColors: borderColorsDark,
    borderColorsWithContrast: borderColorsWithContrastDark,
    chart: {
        backgroundColor: '#333333',
        style: {
            color: '#ffffff'
        }
    },
    title: {
        style: {
            color: '#ffffff'
        }
    },
    subtitle: {
        style: {
            color: '#ffffff'
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#ffffff'
            }
        },
        title: {
            style: {
                color: '#ffffff'
            }
        }
    },
    xAxis: {
        labels: {
            style: {
                color: '#ffffff'
            }
        }
    },
    legend: {
        itemStyle: {
            color: '#ffffff'
        },
        backgroundColor: '#333333'
    },
    credits: {
        style: {
            color: '#ffffff'
        }
    },
    tooltip: {
        backgroundColor: '#333333',
        style: {
            color: '#ffffff'
        }
    },
    outsideChart: {
        backgroundColor: '#333333',
        textColor: '#ffffff'
    },
    button: {
        backgroundColor: '#444444',
        textColor: '#ffffff'
    }

};

const themeMap = {
    dark: darkTheme,
    light: lightTheme
};

function getThemeConfig(chart) {
    const settings = chartSettingsMap[chart.index];
    const themeChoice =
        (!settings.isSelectedTheme || settings.isSelectedTheme === 'default') ?
            (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches ?
                'dark' : 'light') : settings.isSelectedTheme;
    return themeMap[themeChoice];
}

function applyChartTheme(chart) {
    const theme = getThemeConfig(chart);

    chart.update({
        chart: {
            backgroundColor: theme.chart.backgroundColor,
            style: theme.chart.style
        },
        title: {
            style: theme.title.style
        },
        subtitle: {
            style: theme.title.style
        },
        yAxis: {
            labels: {
                style: theme.yAxis.labels.style
            },
            title: {
                style: theme.yAxis.title.style
            }
        },
        xAxis: {
            labels: {
                style: theme.yAxis.labels.style
            }
        },
        legend: {
            itemStyle: theme.legend.itemStyle,
            backgroundColor: theme.legend.backgroundColor
        },
        credits: {
            style: theme.chart.style
        },
        tooltip: {
            backgroundColor: theme.chart.backgroundColor,
            style: {
                color: theme.chart.style.color
            }
        },
        colors: theme.colors
    });

    // Ensure colors update when switching themes
    updateChartColorLogic(chart);

    // Set background color for the whole chart and the text color
    const highchartsFigure = document.getElementById(`chart-${chart.index}`);
    if (highchartsFigure) {
        highchartsFigure.style.backgroundColor =
            theme.outsideChart.backgroundColor;
        highchartsFigure.style.color = theme.outsideChart.textColor;
        highchartsFigure.style.margin = '0';
        highchartsFigure.style.padding = '40px';
    }

    // Buttons in dark mode
    const tableButton = document
        .getElementById(`hc-linkto-highcharts-data-table-${chart.index}`);
    tableButton.style.backgroundColor = theme.button.backgroundColor;
    tableButton.style.color = theme.button.textColor;

    // Update the dialog colors if the dialog is open
    const dialog = document.getElementById('pref-menu-dialog');
    if (dialog) {
        setDialogColors(dialog, chart);
    }

    // Update the altTextDivs whenever the theme is changed
    chart.altTextDivs.forEach(div => {
        if (theme === darkTheme) {
            div.style.backgroundColor = '#444444';
            div.style.color = '#ffffff';
            div.style.border = '1px solid #666666';
        } else {
            div.style.backgroundColor = '#ffffff';
            div.style.color = '#000000';
            div.style.border = '1px solid #000';
        }
    });
}

function setDialogColors(dialog, chart) {
    const theme = getThemeConfig(chart);
    if (!dialog) {
        console.warn('Dialog element not found');
        return;
    }
    dialog.style.backgroundColor = theme.outsideChart.backgroundColor;
    dialog.style.color = theme.outsideChart.textColor;
    dialog.style.border = theme.outsideChart.textColor;
    dialog.style.borderWidth = '2px';
    dialog.style.borderStyle = 'solid';


    const h3Buttons = dialog.querySelectorAll('.card-header h2 button');
    h3Buttons.forEach(button => {
        button.style.color = theme.outsideChart.textColor;
    });

    const icons = dialog.querySelectorAll('.card-header h2 button i');
    icons.forEach(icon => {
        icon.style.color = theme.outsideChart.textColor;
    });

    const closeButton = dialog.querySelector('.dlg-close');
    if (closeButton) {
        closeButton.style.backgroundColor = theme.button.backgroundColor;
        closeButton.style.color = theme.button.textColor;
    }
}

function initializeCharts() {
    const chart1 = Highcharts.chart('container', getColumnChartConfig());
    const chart2 = Highcharts.chart('container2', getScatterChartConfig());

    chart1.index = 1;
    chart2.index = 2;

    chart1.prefMenu = {};
    chart1.altTextDivs = [];
    chart2.prefMenu = {};
    chart2.altTextDivs = [];

    // Store settings in global settings map
    chartSettingsMap[chart1.index] = {
        selectedVerbosity: 'full',
        selectedTextSize: 'default',
        isContrastChecked: false,
        isBorderChecked: false,
        isAltPointDescChecked: false,
        isAltPointLabelChecked: false,
        isInfoChecked: false,
        isPatternChecked: false,
        fontSize: '',
        isSelectedTheme: 'default',
        isSonificationChecked: false,
        isDescribeChartChecked: false
    };

    // Copying settings to chart2
    chartSettingsMap[chart2.index] =
        JSON.parse(JSON.stringify(chartSettingsMap[chart1.index]));

    addPrefButton(chart1, 'container');
    addPrefButton(chart2, 'container2');
    addCustomA11yComponent(chart1);
    addCustomA11yComponent(chart2);
    addPrefButtonScreenReader(chart1);
    addPrefButtonScreenReader(chart2);

    // Store descriptions in chart objects
    chart1.longDesc = getScreenReaderDescription(chart1);
    chart1.shortDesc = getShortScreenReaderDescription(chart1);
    chart2.longDesc = getScreenReaderDescription(chart2);
    chart2.shortDesc = getShortScreenReaderDescription(chart2);
    chart2.femaleDesc = descFemale;
    chart2.maleDesc = descMale;
    chart2.femaleDescShort = descFemale.split('.')[0] + '.';
    chart2.maleDescShort = descMale.split('.')[0] + '.';

    return [chart1, chart2];
}

function getScreenReaderDescription(chart) {
    const screenReaderDiv = document.getElementById(
        `highcharts-screen-reader-region-before-${chart.index}`
    );
    if (!screenReaderDiv || screenReaderDiv.children.length === 0) {
        return '';
    }
    const innerDiv = screenReaderDiv.children[0];
    return innerDiv.children.length > 3 ? innerDiv.children[3].textContent : '';
}

function getShortScreenReaderDescription(chart) {
    const longDesc = getScreenReaderDescription(chart);
    return longDesc ? longDesc.split('.')[0] + '.' : '';
}

function getColumnChartConfig() {
    return {
        chart: {
            type: 'column'
        },
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [
                        'printChart',
                        'viewData',
                        'downloadPNG',
                        'downloadJPEG',
                        'downloadPDF',
                        'downloadSVG'
                    ]
                }
            }
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h2>{chartTitle}</h2>' +
                '<div>{typeDescription}</div>' +
                '<div>{chartSubtitle}</div>' +
                `<div>${columnChartDesc}</div>` +
                '<div>{playAsSoundButton}</div>' +
                '<div>{viewTableButton}</div>' +
                '<div>{xAxisDescription}</div>' +
                '<div>{yAxisDescription}</div>'
            },
            point: {
                descriptionFormat: fullPointDescriptionFormat
            },
            keyboardNavigation: {
                focusBorder: {
                    enabled: true,
                    hideBrowserFocusOutline: true,
                    margin: 2,
                    style: {
                        lineWidth: 2,
                        borderRadius: 3,
                        color: '#e22443'
                    }
                }
            }
        },
        title: {
            text: 'Corn vs wheat estimated production for 2023'
        },
        subtitle: {
            text:
                'Source: <a target="_blank" ' +
                'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
        },
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
            crosshair: true,
            accessibility: {
                description: 'Countries'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '1000 metric tons (MT)'
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)',
            stickOnContact: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        colors: defaultColorsLight,
        series: [
            {
                name: 'Corn',
                data: [387749, 280000, 129000, 64300, 54000, 34300]
            },
            {
                name: 'Wheat',
                data: [45321, 140000, 10000, 140500, 19500, 113500]
            }
        ]
    };
}

function getScatterChartConfig() {
    return {
        chart: {
            type: 'scatter',
            zooming: {
                type: 'xy'
            }
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h2>{chartTitle}</h2>' +
                '<div>{typeDescription}</div>' +
                '<div>{chartSubtitle}</div>' +
                `<div>${scatterChartDesc}</div>` +
                '<div>{playAsSoundButton}</div>' +
                '<div>{viewTableButton}</div>' +
                '<div>{xAxisDescription}</div>' +
                '<div>{yAxisDescription}</div>'
            },
            keyboardNavigation: {
                focusBorder: {
                    enabled: true,
                    hideBrowserFocusOutline: true,
                    margin: 2,
                    style: {
                        lineWidth: 2,
                        borderRadius: 3,
                        color: '#e22443'
                    }
                }
            }
        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true
                        }
                    },
                    lineWidth: 1,
                    lineColor: '#000'
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Female',
            accessibility: {
                description: descFemale
            },
            data: [
                [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0],
                [155.8, 53.6], [170.0, 59.0], [159.1, 47.6], [166.0, 69.8],
                [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2],
                [172.9, 62.5], [153.4, 42.0], [160.0, 50.0], [147.2, 49.8],
                [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8],
                [170.2, 72.8], [174.0, 54.5], [173.0, 59.8], [179.9, 67.3],
                [170.5, 67.8], [160.0, 47.0], [154.4, 46.2], [162.0, 55.0],
                [176.5, 83.0], [160.0, 54.4], [152.0, 45.8], [162.1, 53.6],
                [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2],
                [161.3, 60.3], [167.6, 58.3], [165.1, 56.2], [160.0, 50.2],
                [170.0, 72.9], [157.5, 59.8], [167.6, 61.0], [160.7, 69.1],
                [163.2, 55.9], [152.4, 46.5], [157.5, 54.3], [168.3, 54.8],
                [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1],
                [161.0, 80.0], [162.0, 54.7], [166.0, 53.2], [174.0, 75.7],
                [172.7, 61.1], [167.6, 55.7], [151.1, 48.7], [164.5, 52.3],
                [163.5, 50.0], [152.0, 59.3], [169.0, 62.5], [164.0, 55.7],
                [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6],
                [169.5, 52.8], [163.2, 59.8], [154.5, 49.0], [159.8, 50.0],
                [173.2, 69.2], [170.0, 55.9], [161.4, 63.4], [169.0, 58.2],
                [166.2, 58.6], [159.4, 45.7], [162.5, 52.2], [159.0, 48.6],
                [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0],
                [173.2, 58.4], [171.8, 56.2], [178.0, 70.6], [164.3, 59.8],
                [163.0, 72.0], [168.5, 65.2], [166.8, 56.6], [172.7, 105.2],
                [163.5, 51.8], [169.4, 63.4], [167.8, 59.0], [159.5, 47.6],
                [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8],
                [163.2, 56.4], [172.7, 62.0], [155.0, 49.2], [156.5, 67.2],
                [164.0, 53.8], [160.9, 54.4], [162.8, 58.0], [167.0, 59.8],
                [160.0, 54.8], [160.0, 43.2], [168.9, 60.5], [158.2, 46.4],
                [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7],
                [159.8, 53.2], [170.5, 64.5], [159.2, 51.8], [157.5, 56.0],
                [161.3, 63.6], [162.6, 63.2], [160.0, 59.5], [168.9, 56.8],
                [165.1, 64.1], [162.6, 50.0], [165.1, 72.3], [166.4, 55.0],
                [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4],
                [162.6, 61.4], [167.6, 65.9], [156.2, 58.6], [175.2, 66.8],
                [172.1, 56.6], [162.6, 58.6], [160.0, 55.9], [165.1, 59.1],
                [182.9, 81.8], [166.4, 70.7], [165.1, 56.8], [177.8, 60.0],
                [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0],
                [165.1, 65.5], [175.3, 65.5], [157.5, 48.6], [163.8, 58.6],
                [167.6, 63.6], [165.1, 55.2], [165.1, 62.7], [168.9, 56.6],
                [162.6, 53.9], [164.5, 63.2], [176.5, 73.6], [168.9, 62.0],
                [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9],
                [160.0, 59.0], [157.5, 63.6], [162.6, 54.5], [152.4, 47.3],
                [170.2, 67.7], [165.1, 80.9], [172.7, 70.5], [165.1, 60.9],
                [170.2, 63.6], [170.2, 54.5], [170.2, 59.1], [161.3, 70.5],
                [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3],
                [175.2, 57.7], [160.0, 55.4], [165.1, 104.1], [174.0, 55.5],
                [170.2, 77.3], [160.0, 80.5], [167.6, 64.5], [167.6, 72.3],
                [167.6, 61.4], [154.9, 58.2], [162.6, 81.8], [175.3, 63.6],
                [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6],
                [161.3, 60.9], [156.2, 60.0], [149.9, 46.8], [169.5, 57.3],
                [160.0, 64.1], [175.3, 63.6], [169.5, 67.3], [160.0, 75.5],
                [172.7, 68.2], [162.6, 61.4], [157.5, 76.8], [176.5, 71.8],
                [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
            ]
        }, {
            name: 'Male',
            accessibility: {
                description: descMale
            },
            data: [
                [174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6],
                [187.2, 78.8], [181.5, 74.8], [184.0, 86.4], [184.5, 78.4],
                [175.0, 62.0], [184.0, 81.6], [180.0, 76.6], [177.8, 83.6],
                [192.0, 90.0], [176.0, 74.6], [174.0, 71.0], [184.0, 79.6],
                [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
                [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4],
                [173.5, 81.8], [178.0, 89.6], [180.3, 82.8], [180.3, 76.4],
                [164.5, 63.2], [173.0, 60.9], [183.5, 74.8], [175.5, 70.0],
                [188.0, 72.4], [189.2, 84.1], [172.8, 69.1], [170.0, 59.5],
                [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
                [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1],
                [180.3, 82.6], [182.9, 88.7], [188.0, 84.1], [177.2, 94.1],
                [172.1, 74.9], [167.0, 59.1], [169.5, 75.6], [174.0, 86.2],
                [172.7, 75.3], [182.2, 87.1], [164.1, 55.2], [163.0, 57.0],
                [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
                [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1],
                [182.0, 72.0], [167.0, 64.6], [177.8, 74.8], [164.5, 70.0],
                [192.0, 101.6], [175.5, 63.2], [171.2, 79.1], [181.6, 78.9],
                [167.4, 67.7], [181.1, 66.0], [177.0, 68.2], [174.5, 63.9],
                [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0],
                [175.5, 70.9], [180.6, 72.5], [177.0, 72.5], [177.1, 83.4],
                [181.6, 75.5], [176.5, 73.0], [175.0, 70.2], [174.0, 73.4],
                [165.1, 70.5], [177.0, 68.9], [192.0, 102.3], [176.5, 68.4],
                [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0],
                [168.9, 55.5], [157.2, 58.4], [180.3, 83.2], [170.2, 72.7],
                [177.8, 64.1], [172.7, 72.3], [165.1, 65.0], [186.7, 86.4],
                [165.1, 65.0], [174.0, 88.6], [175.3, 84.1], [185.4, 66.8],
                [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
                [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4],
                [163.8, 72.2], [188.0, 83.6], [198.1, 85.5], [175.3, 90.9],
                [166.4, 85.9], [190.5, 89.1], [166.4, 75.0], [177.8, 77.7],
                [179.7, 86.4], [172.7, 90.9], [190.5, 73.6], [185.4, 76.4],
                [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
                [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7],
                [184.2, 94.5], [176.5, 80.2], [177.8, 72.0], [180.3, 71.4],
                [171.4, 72.7], [172.7, 84.1], [172.7, 76.8], [177.8, 63.6],
                [177.8, 80.9], [182.9, 80.9], [170.2, 85.5], [167.6, 68.6],
                [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
                [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8],
                [170.2, 65.9], [193.0, 95.9], [171.4, 91.4], [177.8, 81.8],
                [177.8, 96.8], [167.6, 69.1], [167.6, 82.7], [180.3, 75.5],
                [182.9, 79.5], [176.5, 73.6], [186.7, 91.8], [188.0, 84.1],
                [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
                [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5],
                [188.0, 91.4], [182.9, 89.1], [176.5, 85.0], [175.3, 69.1],
                [175.3, 73.6], [188.0, 80.5], [188.0, 82.7], [175.3, 86.4],
                [170.5, 67.7], [179.1, 92.7], [177.8, 93.6], [175.3, 70.9],
                [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
                [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6],
                [180.3, 85.5], [174.0, 73.9], [167.6, 66.8], [182.9, 87.3],
                [160.0, 72.3], [180.3, 88.6], [167.6, 75.5], [186.7, 101.4],
                [175.3, 91.1], [175.3, 67.3], [175.9, 77.7], [175.3, 81.8],
                [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
                [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9],
                [188.0, 94.3], [174.0, 70.9], [167.6, 64.5], [170.2, 77.3],
                [167.6, 72.3], [188.0, 87.3], [174.0, 80.0], [176.5, 82.3],
                [180.3, 73.6], [167.6, 74.1], [188.0, 85.9], [180.3, 73.2],
                [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
                [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2],
                [177.8, 84.1], [180.3, 83.2], [180.3, 83.2]
            ]
        }]
    };
}

function addPrefButton(chart) {
    const settingImgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Cog_wheel_icon.svg/1024px-Cog_wheel_icon.svg.png';
    const fallbackText = '⚙️';

    const buttonGroup = chart.renderer.g()
        .attr({
            id: 'hc-pref-button-group',
            class: 'hc-pref-button',
            cursor: 'pointer',
            role: 'button',
            tabindex: 0,
            'aria-label': 'Preferences'
        })
        .on('click', () => handlePrefButtonClick(chart))
        .add();

    // White background rectangle behind the icon
    const bgRect = chart.renderer
        .rect(705, 0, 40, 40)
        .attr({
            class: 'hc-pref-button-bg',
            rx: 8,
            fill: '#ffffff',
            stroke: 'none',
            'stroke-width': 0
        })
        .add(buttonGroup);

    // Add the image on top
    const prefButton = chart.renderer.image(
        settingImgSrc, 715, 7, 24, 24
    )
        .attr({
            id: 'hc-pref-button',
            'aria-hidden': 'false'
        })
        .add(buttonGroup);

    // Add fallback logic in case the image fails
    prefButton.element.onerror = () => {
        prefButton.destroy(); // Remove broken image

        chart.renderer
            .text(fallbackText, 720, 25) // x, y for the text
            .attr({
                class: 'hc-pref-button-text',
                'aria-hidden': 'false'
            })
            .css({
                fontSize: '20px',
                textAnchor: 'middle',
                cursor: 'pointer',
                fill: '#000000' // Ensure the text is visible
            })
            .add(buttonGroup);
    };

    // Ensure the rectangle stays behind everything
    buttonGroup.element.insertBefore(bgRect.element, prefButton.element);

    // Assign button group to chart namespace
    chart.prefMenu.prefButton = buttonGroup;
}

function addPrefButtonScreenReader(chart) {
    const settings = chartSettingsMap[chart.index];
    const screenReaderDiv = document.getElementById(
        `highcharts-screen-reader-region-before-${chart.index}`
    );
    const screenReaderDivInnerDiv = screenReaderDiv.children[0];
    const tableButton =
        document.getElementById(
            `hc-linkto-highcharts-data-table-${chart.index}`
        );
    const existingPrefButton =
        screenReaderDivInnerDiv?.querySelector('#hc-pref-button');

    const theme = getThemeConfig(chart);

    if (!existingPrefButton) {
        const prefButton = document.createElement('button');
        prefButton.textContent = 'Preferences';
        prefButton.id = 'hc-pref-button';
        prefButton.style.fontSize = settings.fontSize;
        prefButton.style.backgroundColor = theme.button.backgroundColor;
        prefButton.style.color = theme.button.textColor;
        prefButton.addEventListener('click', () =>
            handlePrefButtonClick(chart)
        );

        // Ensure screenReaderDiv and tableButton exist
        if (screenReaderDiv && tableButton) {
            screenReaderDivInnerDiv.insertBefore(
                prefButton, screenReaderDivInnerDiv.children[4]
            );
        }
    }
}

function handlePrefButtonClick(chart) {
    chart.accessibility.keyboardNavigation.blocked = true;
    const dialog = createPreferencesDialog(chart);
    document.body.appendChild(dialog);

    dialog.showModal();
    setDialogColors(dialog, chart);

    trapFocusInDialog(dialog);

    const firstFocusable = dialog.querySelector('button, select');
    if (firstFocusable) {
        firstFocusable.focus();
    }

}

function createPreferencesDialog(chart) {
    const prefContent = document.createElement('dialog');
    prefContent.setAttribute('id', `pref-menu-dialog-${chart.index}`);
    const closeID = `hc-dlg-close-btn-${chart.index}`;

    // Retrieving settings for the specific chart instance
    const settings = chartSettingsMap[chart.index];
    const i = chart.index;

    // Close button container
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('dialog-header');

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.setAttribute('id', closeID);
    closeButton.classList.add('dlg-close');
    closeButton.setAttribute('aria-label', 'Close dialog');
    closeButton.innerText = 'Close';

    // Append the close button to the header container
    headerContainer.appendChild(closeButton);

    // Create the accordion container
    const accordionContainer = document.createElement('ul');
    accordionContainer.classList.add('accordion', 'accordion-parent');
    accordionContainer.setAttribute('id', `accordion-parent-${i}`);

    const preferencesSection = document.createElement('li');
    preferencesSection.classList.add('card', 'open'); // Open by default
    preferencesSection.innerHTML = `
    <div class="card-header p-0 d-flex align-items-center mx-1"
    id="heading1-${i}">
        <h2 class="h2">
            <button class="acc-btn"
                type="button" data-target="#collapse1-${i}" 
                aria-expanded="true" aria-controls="collapse1-${i}">
                <i class="fa fa-caret-right arrow"></i> Preferences
            </button>
        </h2>
    </div>
    <div id="collapse1-${i}" class="mx-1 pl-2 collapse show"
        aria-labelledby="heading1-${i}" data-parent="#accordion-parent-${i}">
        <div class="card-body ml-1 pl-0">
            <h2>Preferences for ${chart.title.textStr} chart</h2>
            <p>Customize your chart settings to enhance your experience.</p>

            <h3>Chart theme:</h3>
            <div class="pref theme">
                <input type="radio" id="theme-default-${i}"
                name="theme-${i}" value="default"
                    ${settings.isSelectedTheme === 'default' ? 'checked' : ''}>
                <label for="theme-default-${i}">System default</label>
                <input type="radio" id="theme-dark-${i}"
                name="theme-${i}" value="dark"
                    ${settings.isSelectedTheme === 'dark' ? 'checked' : ''}>
                <label for="theme-dark-${i}">Dark</label>
                <input type="radio" id="theme-light-${i}"
                name="theme-${i}" value="light"
                    ${settings.isSelectedTheme === 'light' ? 'checked' : ''}>
                <label for="theme-light-${i}">Light</label>
            </div>

            <h3>Visible alt text:</h3>
            <div class="pref alt-text">
                <input type="checkbox" id="alt-info-${i}" name="alt-info-${i}"
                    ${settings.isInfoChecked ? 'checked' : ''}>
                <label for="alt-info-${i}">Show chart overview</label>
                <input type="checkbox" id="alt-point-label-${i}"
                name="alt-point-label-${i}"
                    ${settings.isAltPointLabelChecked ? 'checked' : ''}>
                <label for="alt-point-label-${i}">Show point labels</label>
                <input type="checkbox" id="alt-points-desc-${i}"
                name="alt-points-desc-${i}"
                    ${settings.isAltPointDescChecked ? 'checked' : ''}>
                <label for="alt-points-desc-${i}">Show point description</label>
            </div>

            <h3>Text description:</h3>
            <div class="pref verbosity">
                <input type="radio" id="short-${i}"
                name="verbosity-${i}" value="short"
                    ${settings.selectedVerbosity === 'short' ? 'checked' : ''}>
                <label for="short-${i}">Short</label>
                <input type="radio" id="ver-full-${i}"
                name="verbosity-${i}" value="full"
                    ${settings.selectedVerbosity === 'full' ? 'checked' : ''}>
                <label for="ver-full-${i}">Full</label>
            </div>

            <h3>Text size:</h3>
            <div class="pref textsize">
                <input type="radio" id="smaller-${i}"
                name="textsize-${i}" value="smaller"
                    ${settings.selectedTextSize === 'smaller' ? 'checked' : ''}>
                <label for="smaller-${i}">Smaller</label>
                <input type="radio" id="t-size-def-${i}"
                name="textsize-${i}" value="default"
                    ${settings.selectedTextSize === 'default' ? 'checked' : ''}>
                <label for="t-size-def-${i}">Default</label>
                <input type="radio" id="larger-${i}"
                name="textsize-${i}" value="larger"
                    ${settings.selectedTextSize === 'larger' ? 'checked' : ''}>
                <label for="larger-${i}">Larger</label>
            </div>

            <h3>Enhance contrast:</h3>
            <div class="pref contrast">
                <input type="checkbox" id="contrast-${i}" name="contrast-${i}"
                    ${settings.isContrastChecked ? 'checked' : ''}>
                <label for="contrast-${i}">Increase contrast</label>

                <input type="checkbox" id="border-${i}" name="border-${i}"
                    ${settings.isBorderChecked ? 'checked' : ''}>
                <label for="border-${i}">Add border</label>

                <input type="checkbox" id="pattern-${i}" name="pattern-${i}"
                    ${settings.isPatternChecked ? 'checked' : ''}>
                <label for="pattern-${i}">Pattern instead of colors</label>
            </div>
        </div>
    </div>
    `;

    // Accessibility Tools section (default closed)
    const accessibilitySection = document.createElement('li');
    accessibilitySection.classList.add('card');
    accessibilitySection.innerHTML = `
    <div class="card-header p-0 d-flex align-items-center mx-1"
    id="heading2-${i}">
    <h2 class="h2">
        <button class="acc-btn"
            type="button" data-target="#collapse2-${i}" 
            aria-expanded="false" aria-controls="collapse2-${i}">
            <i class="fa fa-caret-right arrow"></i> Accessibility Tools
        </button>
    </h2>
    </div>
    <div id="collapse2-${i}" class="mx-1 pl-2 collapse"
        aria-labelledby="heading2-${i}" data-parent="#accordion-parent-${i}">
        <div class="card-body ml-1 pl-0">
            <h2>Accessibility tools for ${chart.title.textStr} chart</h2>
            <p>Enhance the accessibility of your charts with these tools.</p>
            <div class="pref tool">
                <input type="checkbox" id="sonification-${i}"
                name="sonification-${i}"
                    ${settings.isSonificationChecked ? 'checked' : ''}>
                <label for="sonification-${i}">Enable Sonification</label>
            </div>
            <div class="pref tool">
                <button id="describe-chart-${i}" name="describe-chart-${i}">
                Describe the chart
                </button>
            </div>
        </div>
    </div>
    `;

    // Append sections to the accordion container
    accordionContainer.appendChild(preferencesSection);
    accordionContainer.appendChild(accessibilitySection);

    // Add header, close button, and accordion container to the dialog
    prefContent.appendChild(headerContainer);
    prefContent.appendChild(accordionContainer);

    // Append the dialog to the document before calling event listeners
    document.body.appendChild(prefContent);

    // Setup event listeners after adding to the DOM
    setTimeout(() => {
        setupEventListeners(prefContent, chart);
    }, 0);

    // Close button functionality
    closeButton.addEventListener('click', () => {
        closePreferencesDialog(prefContent, chart);
    });

    return prefContent;
}


function setupEventListeners(prefContent, chart) {

    const textSizeRadioButtons = prefContent
            .querySelectorAll(`input[name="textsize-${chart.index}"]`),
        verbosityRadioButtons = prefContent
            .querySelectorAll(`input[name="verbosity-${chart.index}"]`),
        themeRadioButtons =
            prefContent.querySelectorAll(`input[name="theme-${chart.index}"]`),
        contrastCheckbox =
            prefContent.querySelector(`input[name="contrast-${chart.index}"]`),
        borderCheckbox =
            prefContent.querySelector(`input[name="border-${chart.index}"]`),
        patternCheckbox =
            prefContent.querySelector(`input[name="pattern-${chart.index}"]`),
        altPointDescCheckbox = prefContent
            .querySelector(`input[name="alt-points-desc-${chart.index}"]`),
        altPointLabelCheckbox = prefContent
            .querySelector(`input[name="alt-point-label-${chart.index}"]`),
        altInfoCheckbox =
            prefContent.querySelector(`input[name="alt-info-${chart.index}"]`),
        accordionButtons = prefContent.querySelectorAll('.acc-btn'),
        sonificationCheckbox = prefContent
            .querySelector(`input[name="sonification-${chart.index}"]`),
        describeChartButton = prefContent
            .querySelector(`#describe-chart-${chart.index}`);

    const infoRegion = document.querySelector(
        `#highcharts-screen-reader-region-before-${chart.index} > ` +
        'div:first-child'
    );
    const scatterDesc = document.getElementById('scatter-description');
    const columnDesc = document.getElementById('column-description');

    // Retrieve settings for chart instance
    const settings = chartSettingsMap[chart.index];

    accordionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetID = this.getAttribute('data-target');
            if (!targetID) {
                console.warn('Missing data-target attribute on button:', this);
                return;
            }

            const target = prefContent.querySelector(targetID);
            if (!target) {
                console.warn(`Accordion target not found: ${targetID}`);
                return;
            }

            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded and collapse state
            this.setAttribute('aria-expanded', !isExpanded);
            target.classList.toggle('show', !isExpanded);

            // Update arrow icon based on the expanded state
            const arrowIcon = this.querySelector('.arrow');
            if (isExpanded) {
                arrowIcon.classList.remove('fa-caret-down');
                arrowIcon.classList.add('fa-caret-right');
            } else {
                arrowIcon.classList.remove('fa-caret-right');
                arrowIcon.classList.add('fa-caret-down');
            }
        });
    });

    themeRadioButtons.forEach(radio => {
        radio.addEventListener('change', event => {
            settings.isSelectedTheme = event.target.value;
            applyChartTheme(chart);
            setDialogColors(prefContent, chart);
            applyInfoRegion(settings.selectedVerbosity, chart);
        });
    });

    textSizeRadioButtons.forEach(radio => {
        radio.addEventListener('change', event => {
            settings.selectedTextSize = event.target.value;

            switch (settings.selectedTextSize) {
            case 'smaller':
                settings.fontSize = '10px';
                break;
            case 'normal':
                settings.fontSize = '16px';
                break;
            case 'larger':
                settings.fontSize = '22px';
                break;
            default:
                settings.fontSize = '16px';
            }

            // Update chart with font sizes
            chart.update({
                chart: {
                    style: {
                        fontSize: settings.fontSize
                    }
                }
            });

            // Only visible if info region is checked
            infoRegion.style.fontSize = settings.fontSize;
            console.log(scatterDesc);
            console.log(columnDesc);

            if (chart.series[0].type === 'scatter') {
                scatterDesc.style.fontSize = settings.fontSize;
            } else {
                columnDesc.style.fontSize = settings.fontSize;
            }

            // Only visible if alt-text for point is checked
            chart.altTextDivs.forEach(div => {
                div.style.fontSize = settings.fontSize;
            });

            // Append the button to the screen reader region
            applyInfoRegion(settings.selectedVerbosity, chart);
        });
    });
    verbosityRadioButtons.forEach(radio => {
        radio.addEventListener('change', event => {
            settings.selectedVerbosity = event.target.value;

            chart.update({
                accessibility: {
                    point: {
                        descriptionFormat:
                            settings.selectedVerbosity === 'short' ?
                                shortPointDescriptionFormat :
                                fullPointDescriptionFormat
                    }
                }
            });

            if (chart.series[0].type === 'scatter') {
                chart.update({
                    series: [{
                        accessibility: {
                            description: settings.selectedVerbosity ===
                            'short' ? chart.femaleDescShort : chart.femaleDesc
                        }
                    }, {
                        accessibility: {
                            description: settings.selectedVerbosity ===
                            'short' ? chart.maleDescShort : chart.maleDesc
                        }
                    }]
                });
            }

            applyInfoRegion(settings.selectedVerbosity, chart);
        });
    });

    contrastCheckbox.addEventListener('change', event => {
        settings.isContrastChecked = event.target.checked;
        updateChartColorLogic(chart);
        // Append button to screen reader region
        applyInfoRegion(settings.selectedVerbosity, chart);
    });

    patternCheckbox.addEventListener('change', event => {
        settings.isPatternChecked = event.target.checked;
        updateChartColorLogic(chart);
        applyInfoRegion(settings.selectedVerbosity, chart);
    });

    borderCheckbox.addEventListener('change', event => {
        settings.isBorderChecked = event.target.checked;
        updateChartColorLogic(chart);
        // Append button to screen reader region
        applyInfoRegion(settings.selectedVerbosity, chart);
    });

    altPointLabelCheckbox.addEventListener('change', event => {
        settings.isAltPointLabelChecked = event.target.checked;

        if (settings.isAltPointLabelChecked) {
            chart.update({
                series: [{
                    dataLabels: {
                        enabled: true
                    }
                }, {
                    dataLabels: {
                        enabled: true
                    }
                }]
            });
        } else {
            chart.update({
                series: [{
                    dataLabels: {
                        enabled: false
                    }
                }, {
                    dataLabels: {
                        enabled: false
                    }
                }]
            });
        }

        chart.altTextDivs.forEach(div => {
            const currentTop = parseInt(div.style.top, 10);
            div.style.top =
                settings.isAltPointLabelChecked ?
                    `${currentTop - 20}px` : `${currentTop + 20}px`;
        });

        applyInfoRegion(settings.selectedVerbosity, chart);

    });

    altPointDescCheckbox.addEventListener('change', event => {
        settings.isAltPointDescChecked = event.target.checked;

        // Clear existing altTextDivs
        chart.altTextDivs.forEach(div => div.remove());
        chart.altTextDivs = [];

        if (settings.isAltPointDescChecked) {
            const paths = document
                .querySelectorAll('path.highcharts-point[aria-label]');
            const chartRect = chart.container.getBoundingClientRect();
            const theme = getThemeConfig(chart);

            paths.forEach(path => {
                const ariaLabel = path.getAttribute('aria-label');
                const rect = path.getBoundingClientRect();
                // Create and position alt text div
                const altTextDiv = document.createElement('div');
                altTextDiv.textContent = ariaLabel;
                altTextDiv.classList.add('alt-text-div');
                altTextDiv.setAttribute('aria-hidden', 'true');
                // Apply theme-specific styles during creation
                altTextDiv.style.backgroundColor =
                    theme === darkTheme ? '#444444' : '#ffffff';
                altTextDiv.style.color =
                    theme === darkTheme ? '#ffffff' : '#000000';
                altTextDiv.style.border = theme === darkTheme ?
                    '1px solid #666666' : '1px solid #ccc';
                altTextDiv.style.opacity = '1';
                altTextDiv.style.fontSize = settings.fontSize;

                // Position label on top of the column
                altTextDiv.style.left =
                    `${rect.left + rect.width / 2 - chartRect.left}px`;
                altTextDiv.style.top = `${rect.top - chartRect.top}px`;
                // Adjust position if altPointLabel is checked
                if (settings.isAltPointLabelChecked) {
                    altTextDiv.style.top = `${rect.top - chartRect.top - 20}px`;
                }
                // Add to chart container
                chart.container.appendChild(altTextDiv);
                // Add divs to array for setting text size if applicable
                chart.altTextDivs.push(altTextDiv);
            });
            // Disable tooltips to avoid duplicate information
            chart.update({
                tooltip: {
                    enabled: false
                }
            });
        } else {
            chart.update({
                tooltip: {
                    enabled: true
                }
            });
        }

        // Append button to screen reader region
        applyInfoRegion(settings.selectedVerbosity, chart);
    });

    altInfoCheckbox.addEventListener('change', event => {
        settings.isInfoChecked = event.target.checked;
        // Refresh screen reader section
        applyInfoRegion(settings.selectedVerbosity, chart);
    });

    sonificationCheckbox.addEventListener('change', event => {
        settings.isSonificationChecked = event.target.checked;

        const playButtonId = `play-sonification-${chart.index}`;
        let playButton = document.getElementById(playButtonId);

        if (settings.isSonificationChecked) {
            if (!playButton) {
                playButton = document.createElement('button');
                playButton.id = playButtonId;
                playButton.textContent = 'Play Sonification';
                playButton.style.marginTop = '10px';
                playButton.addEventListener('click', () => {
                    chart.toggleSonify();
                });

                chart.container.parentNode
                    .insertBefore(playButton, chart.container.nextSibling);
            }
        } else {
            if (playButton) {
                playButton.remove();
            }
        }
    });

    describeChartButton.addEventListener('click', function () {
        let descriptionDiv = document.querySelector('.chart-describe');

        if (!descriptionDiv) {
            descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('chart-describe');
            descriptionDiv.style.display = 'block';
            descriptionDiv.setAttribute('aria-live', 'polite');

            // Insert the descriptionDiv after the describeChartButton
            describeChartButton
                .insertAdjacentElement('afterend', descriptionDiv);
        }

        if (chart.series[0].type === 'scatter') {
            descriptionDiv.textContent = scatterChartDesc;
        } else {
            descriptionDiv.textContent = columnChartDesc;
        }
        // Update the focus for screen readers
        descriptionDiv.setAttribute('aria-live', 'polite');
        console.log(`Chart description shown: ${descriptionDiv.textContent}`);
    });

}

function updateChartColorLogic(chart) {
    const theme = getThemeConfig(chart);
    const isDarkMode = theme === darkTheme;

    const contrastColors = isDarkMode ?
        contrastColorsDark : contrastColorsLight;
    const borderColors = isDarkMode ?
        borderColorsWithContrastDark : borderColorsWithContrastLight;
    const settings = chartSettingsMap[chart.index];

    const seriesOptions = [{
        color: settings.isPatternChecked ? {
            pattern: {
                path: 'M 0 0 L 8 8', // Diagonal stripes
                color: settings.isContrastChecked ?
                    contrastColors[0] : theme.colors[0],
                backgroundColor: isDarkMode ? '#FFFFFF' :
                    (settings.isContrastChecked ?
                        contrastColors[0] + '40' : theme.colors[0] + '40'),
                width: 8,
                height: 8
            }
        } : (settings.isContrastChecked ? contrastColors[0] : theme.colors[0]),
        borderColor: settings.isBorderChecked ? (
            settings.isContrastChecked ? borderColors[0] : theme.borderColors[0]
        ) : null,
        borderWidth: settings.isBorderChecked ? 2 : 0,
        marker: {
            lineColor: settings.isBorderChecked ? (
                settings.isContrastChecked ?
                    borderColors[0] : theme.borderColors[0]
            ) : null,
            lineWidth: settings.isBorderChecked ? 1 : 0
        }
    }, {
        color: settings.isPatternChecked ? {
            pattern: { // Dotted pattern
                path: 'M 3 3 m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0',
                color: settings.isContrastChecked ?
                    contrastColors[1] : theme.colors[1],
                backgroundColor: isDarkMode ? '#FFFFFF' :
                    (settings.isContrastChecked ?
                        contrastColors[1] + '40' : theme.colors[1] + '40'),
                width: 8,
                height: 8
            }
        } : (settings.isContrastChecked ? contrastColors[1] : theme.colors[1]),
        borderColor: settings.isBorderChecked ? (
            settings.isContrastChecked ? borderColors[1] : theme.borderColors[1]
        ) : null,
        borderWidth: settings.isBorderChecked ? 2 : 0,
        marker: {
            lineColor: settings.isBorderChecked ? (
                settings.isContrastChecked ?
                    borderColors[0] : theme.borderColors[0]
            ) : null,
            lineWidth: settings.isBorderChecked ? 1 : 0
        }
    }];

    chart.update({
        series: seriesOptions
    });

    // Update altTextDiv styles based on the theme
    chart.altTextDivs.forEach(div => {
        if (isDarkMode) {
            div.style.backgroundColor =
                'rgb(68, 68, 68)';
            div.style.color =
                'rgb(255, 255, 255)';
            div.style.border = '1px solid rgb(102, 102, 102)';
        } else {
            div.style.backgroundColor =
                'rgb(255, 255, 255)';
            div.style.color = 'rgb(0, 0, 0)';
            div.style.border = '1px solid rgb(204, 204, 204)';
        }
    });
}

function trapFocusInDialog(dialog) {

    // Trap focus within the dialog
    const focusableElements = dialog.querySelectorAll(
        'button, select, input, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    dialog.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (
                !e.shiftKey && document.activeElement === lastFocusable
            ) {
                e.preventDefault();
                firstFocusable.focus();
            }
        } else if (e.key === 'Escape') {
            dialog.close();
        }
    });
}

function closePreferencesDialog(dialog, chart) {
    dialog.close();
    chart.accessibility.keyboardNavigation.blocked = false;
    dialog.remove();
    chart.container.focus();
}

function addCustomA11yComponent(chart) {
    // Create custom component for the chart.
    const CustomComponent = function (chart) {
        this.initBase(chart);
    };
    CustomComponent.prototype = new Highcharts.AccessibilityComponent();

    Highcharts.extend(CustomComponent.prototype, {
        onChartUpdate: updateCustomComponent,
        getKeyboardNavigation: createKeyboardNavigationHandler
    });

    // Update the chart with the new component, also adding it in the keyboard
    // navigation order
    chart.update({
        accessibility: {
            customComponents: {
                customComponent: new CustomComponent(chart)
            },
            keyboardNavigation: {
                order: ['series', 'customComponent', 'chartMenu', 'legend']
            }
        }
    });
}

// Perform tasks to be done when the chart is updated
function updateCustomComponent() {
    // Get our button if it exists, and sest attributes on it
    const namespace = this.chart.prefMenu || {};
    if (namespace.prefButton) {
        namespace.prefButton.attr({
            role: 'button',
            tabindex: -1,
            ariahidden: true
        });
        Highcharts.A11yChartUtilities.unhideChartElementFromAT(
            this.chart, namespace.prefButton.element
        );
    }
}


// TODO: Refactor function to be only about applying info region and rename
function applyInfoRegion(selectedVerbosity, chart) {
    const settings = chartSettingsMap[chart.index];

    // Add preference button to screen reader section
    addPrefButtonScreenReader(chart);

    const screenReaderDiv = document.getElementById(
        `highcharts-screen-reader-region-before-${chart.index}`
    );

    const innerScreenReaderDiv = screenReaderDiv.children[0];
    // Cannot delete description until I update the logic for verbosity
    const description = innerScreenReaderDiv.children[3];
    const infoRegion = document.querySelector(
        `#highcharts-screen-reader-region-before-${chart.index} > ` +
        'div:first-child'
    );
    const prefButton = document.getElementById('hc-pref-button');
    const dataTableButton = document.getElementById(
        `hc-linkto-highcharts-data-table-${chart.index}`
    );
    const sonificationButton = document
        .getElementById(`highcharts-a11y-sonify-data-btn-${chart.index}`);

    // Only way to set font size since the info region is re-rendered often
    dataTableButton.style.fontSize = settings.fontSize;
    sonificationButton.style.fontSize = settings.fontSize;
    // Hack......needs a fix TODO
    const hideIndex = dataTableButton.getAttribute(
        'aria-expanded'
    ) === 'true' ? 6 : 7;

    // Check if info region is already displayed
    if (!infoRegion) {
        return;
    }

    // Toggle visibility based on isInfoChecked
    if (settings.isInfoChecked) {
        infoRegion.classList.add('hide-section');
        infoRegion.style.fontSize = settings.fontSize;
    } else {
        infoRegion.classList.remove('hide-section');
    }

    let globalIndex = 0;

    chart.series.forEach(series => {
        series.points.forEach(point => {
            const pointElement = point.graphic?.element;

            if (!pointElement) {
                return;
            }

            const formattedVal = point.y.toLocaleString('en-US');

            // Generate alt text based on verbosity
            const altText = selectedVerbosity === 'short' ?
                `${point.category}, ${formattedVal} (1000 MT).` :
                `Bar ${point.index + 1} of ${point.series.points.length}
                   in series ${point.category}, ${point.series.name}: 
                   ${point.category}, ${formattedVal} (1000 MT).`;

            // Update corresponding alt text div
            const altTextDiv = chart.altTextDivs[globalIndex];
            if (altTextDiv) {
                altTextDiv.textContent = altText;
            }

            globalIndex++;

        });
    });

    const chartInfoElements = Array.from(innerScreenReaderDiv.children);

    if (selectedVerbosity === 'short') {
        description.textContent = chart.shortDesc;

        // Hide specific elements
        chartInfoElements.forEach((el, index) => {
            if (index >= hideIndex) {
                el.style.display = 'none';
            }
        });
    } else if (selectedVerbosity === 'full') {
        // Restore full description
        description.textContent = chart.longDesc;

        // Show all divs
        chartInfoElements.forEach((el, index) => {
            if (index >= 4) {
                el.style.display = 'block';
            }
        });
    }

    // Re insert data table button if disappeard
    if (
        !document.getElementById(
            `hc-linkto-highcharts-data-table-${chart.index}`
        ) &&
        dataTableButton
    ) {
        prefButton.insertAdjacentElement('afterend', dataTableButton);
        dataTableButton.style.display = 'block';
        dataTableButton.style.fontSize = settings.fontSize;
    }
}

// Define keyboard navigation for this component
function createKeyboardNavigationHandler() {
    const keys = this.keyCodes,
        chart = this.chart,
        namespace = chart.prefMenu || {},
        component = this;

    return new Highcharts.KeyboardNavigationHandler(chart, {
        keyCodeMap: [
            // Ensure you're catching keydown events
            [[
                keys.tab, keys.up, keys.down, keys.left, keys.right
            ], function (keyCode, e) {
                // Check if Shift+Tab is pressed (Shift + Tab == backward tab)
                const isBackward = keyCode === keys.tab && e.shiftKey;

                // If it's backward navigation and we're leaving customComponent
                if (isBackward) {
                    // If we're on customComponent, move focus to series
                    if (this.response.prev === 'customComponent') {
                        // Focus on series when tabbing backwards
                        this.response.prev = 'series';
                    }
                }

                // Return next/prev focus based on direction
                return this.response[
                    isBackward ? 'prev' : 'next'
                ];
            }],

            // Space/enter means we click the button
            [[
                keys.space, keys.enter
            ], function () {
                // Fake a click event on the button element
                const buttonElement = namespace.prefButton &&
                        namespace.prefButton.element;
                if (buttonElement) {
                    component.fakeClickEvent(buttonElement);
                }
                return this.response.success;
            }]
        ],

        // Focus button initially
        init() {
            const buttonElement = namespace.prefButton &&
                    namespace.prefButton.element;
            if (buttonElement && buttonElement.focus) {
                buttonElement.focus();
            }
        }
    });
}

// Initialize charts
const [chart1, chart2] = initializeCharts();

applyChartTheme(chart1);
applyChartTheme(chart2);

// Listen for system changes if "System default" is selected
if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
        if (chartSettingsMap[chart1.index].isSelectedTheme === 'default') {
            applyChartTheme(chart1);
        }
        if (chartSettingsMap[chart2.index].isSelectedTheme === 'default') {
            applyChartTheme(chart2);
        }
    });
}
