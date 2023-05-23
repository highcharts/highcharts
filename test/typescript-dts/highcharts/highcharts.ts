/* *
 *
 *  Test cases for highcharts.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from "highcharts";

test_legend();
test_seriesArea();
test_seriesBar();
test_seriesColumn();
test_seriesDependencyWheel();
test_seriesLine();
test_seriesPie();
test_tooltip();
test_yAxis();

/**
 * Tests legend options.
 */
function test_legend() {
    Highcharts.chart('container', {
        legend: {
            enabled: true,
            labelFormatter: function (): string {
                const series = this as Highcharts.Series;
                if (series.legendItem) {
                    return JSON.stringify(series.legendItem as Record<string, SVGElement>);
                }
                return '';
            }
        }
    });
}

/**
 * Tests Highcharts.seriesTypes.area in a common use case.
 */
function test_seriesArea() {
    Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        accessibility: {
            description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
        },
        title: {
            text: 'US and USSR nuclear stockpiles'
        },
        subtitle: {
            text: 'Sources: <a href="https://thebulletin.org/2006/july/global-nuclear-stockpiles-1945-2006">' +
                'thebulletin.org</a> &amp; <a href="https://www.armscontrol.org/factsheets/Nuclearweaponswhohaswhat">' +
                'armscontrol.org</a>'
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function (): string {
                    return this.value.toString(); // clean, unformatted number for year
                }
            },
            accessibility: {
                rangeDescription: 'Range: 1940 to 2017.'
            }
        },
        yAxis: {
            title: {
                text: 'Nuclear weapon states'
            },
            labels: {
                formatter: function () {
                    if (typeof this.value === 'number') {
                        return this.value / 1000 + 'k';
                    }
                    return '';
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                threshold: null as any,
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            type: 'area',
            name: 'USA',
            data: [
                null, null, null, null, null, 6, 11, 32, 110, 235,
                369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
                20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
                26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
                21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
                10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
                5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
            ]
        }, {
            type: 'area',
            name: 'USSR/Russia',
            data: [null, null, null, null, null, null, null, null, null, null,
                5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
                1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
                11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
                30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
                37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
                12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
            ]
        }]
    });
}

/**
 * Tests Highcharts.seriesTypes.bar in a common use case.
 */
function test_seriesBar() {
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Historic World Population by Region'
        },
        subtitle: {
            text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
        },
        xAxis: {
            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)',
                align: 'high'
            },
            labels: {
                overflow: 'justify' as any
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'bar',
            name: 'Year 1800',
            data: [107, 31, 635, 203, 2]
        }, {
            type: 'bar',
            name: 'Year 1900',
            data: [133, 156, 947, 408, 6]
        }, {
            type: 'bar',
            name: 'Year 2000',
            data: [814, 841, 3714, 727, 31]
        }, {
            type: 'bar',
            name: 'Year 2016',
            data: [1216, 1001, 4436, 738, 40]
        }]
    });
}

/**
 * Tests Highcharts.seriesTypes.column in a common use case.
 */
function test_seriesColumn() {
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            type: 'column',
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        }, {
            type: 'column',
            name: 'New York',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
        }, {
            type: 'column',
            name: 'London',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
        }, {
            type: 'column',
            name: 'Berlin',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        }]
    });
}

/**
 * Tests Highcharts.seriesTypes.line in a common use case.
 */
function test_seriesLine() {
    Highcharts.chart('container', {
        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },
        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },
        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },
        series: [{
            type: 'line',
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            type: 'line',
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            type: 'line',
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            type: 'line',
            name: 'Project Development',
            data: [null, [1, null], { y: null }, 12169, 15112, 22452, 34400, 34227]
        }, {
            type: 'line',
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

function test_seriesDependencyWheel() {
    Highcharts.chart('container', {
        title: {
            text: 'Highcharts Dependency Wheel'
        },

        accessibility: {
            point: {
                valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
            }
        },

        series: [{
            type: 'dependencywheel',
            keys: ['from', 'to', 'weight'],
            data: [
                ['Brazil', 'Portugal', 5],
                ['Brazil', 'France', 1],
                ['Brazil', 'Spain', 1],
                ['Brazil', 'England', 1],
                ['Canada', 'Portugal', 1],
                ['Canada', 'France', 5],
                ['Canada', 'England', 1],
                ['Mexico', 'Portugal', 1],
                ['Mexico', 'France', 1],
                ['Mexico', 'Spain', 5],
                ['Mexico', 'England', 1],
                ['USA', 'Portugal', 1],
                ['USA', 'France', 1],
                ['USA', 'Spain', 1],
                ['USA', 'England', 5],
                ['Portugal', 'Angola', 2],
                ['Portugal', 'Senegal', 1],
                ['Portugal', 'Morocco', 1],
                ['Portugal', 'South Africa', 3],
                ['France', 'Angola', 1],
                ['France', 'Senegal', 3],
                ['France', 'Mali', 3],
                ['France', 'Morocco', 3],
                ['France', 'South Africa', 1],
                ['Spain', 'Senegal', 1],
                ['Spain', 'Morocco', 3],
                ['Spain', 'South Africa', 1],
                ['England', 'Angola', 1],
                ['England', 'Senegal', 1],
                ['England', 'Morocco', 2],
                ['England', 'South Africa', 7],
                ['South Africa', 'China', 5],
                ['South Africa', 'India', 1],
                ['South Africa', 'Japan', 3],
                ['Angola', 'China', 5],
                ['Angola', 'India', 1],
                ['Angola', 'Japan', 3],
                ['Senegal', 'China', 5],
                ['Senegal', 'India', 1],
                ['Senegal', 'Japan', 3],
                ['Mali', 'China', 5],
                ['Mali', 'India', 1],
                ['Mali', 'Japan', 3],
                ['Morocco', 'China', 5],
                ['Morocco', 'India', 1],
                ['Morocco', 'Japan', 3],
                ['Japan', 'Brazil', 1]
            ],
            name: 'Dependency wheel series',
            dataLabels: {
                color: '#333',
                textPath: {
                    enabled: true,
                    attributes: {
                        dy: 5
                    }
                },
                distance: 10
            },
            size: '95%'
        }]
    });
}

/**
 * Tests Highcharts.seriesTypes.pie in a common use case.
 */
function test_seriesPie() {
    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: undefined, // null
            plotBorderWidth: undefined, // null
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Browser market shares in January, 2018'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Brands',
            // colorByPoint: true,
            data: [{
                name: 'Chrome',
                y: 61.41,
                sliced: true,
                selected: true
            }, {
                name: 'Internet Explorer',
                y: 11.84
            }, {
                name: 'Firefox',
                y: 10.85
            }, {
                name: 'Edge',
                y: 4.67
            }, {
                name: 'Safari',
                y: 4.18
            }, {
                name: 'Sogou Explorer',
                y: 1.64
            }, {
                name: 'Opera',
                y: 1.6
            }, {
                name: 'QQ',
                y: 1.2
            }, {
                name: 'Other',
                y: 2.61
            }]
        }]
    });
}

/**
 * Tests TooltipOptions in a common use cases.
 */
function test_tooltip() {
    Highcharts.chart('container', {
        tooltip: {
            borderWidth: 10 // #18977
        }
    });
}

/**
 * Tests YAxisLabelsOptions in a common use cases.
 */
function test_yAxis() {
    Highcharts.chart('container', {
        chart: {
            polar: true
        },
        yAxis: {
            labels: {
                distance: "10%" // #18977
            }
        }
    })
}
