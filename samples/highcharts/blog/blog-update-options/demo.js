Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
        '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: 'transparent'
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Arial"'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Arial"'
        }
    },
    legend: {
        itemStyle: {
            font: '9pt Arial"',
            color: 'black'
        },
        itemHoverStyle: {
            color: 'gray'
        }
    }
};
// Apply the theme
Highcharts.setOptions(Highcharts.theme);

//easing functions
Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
Math.easeOutElastic = x => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ?
        0 :
        x === 1 ?
            1 :
            Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

let demoChart, areaChart;
let chartMargin = [0, 0, 0, 0];
let chartSpacing = 0;
const initialChartData = [
    { y: 10 },
    { y: 20 },
    { y: 40 },
    { y: 5 },
    { y: 10 },
    { y: 15 }
];
//for the sliders
const initialValues = [
    [-100, 100, 30, 100],
    [0, 30, 100, 6],
    [50, 0, 0, 30],
    [15, 30, 25, 200]
];

///options for each series
const itemOptions = {
    marker: {
        radius: 8
    },
    startAngle: -100,
    endAngle: 100,
    innerSize: '30%',
    center: ['50%', '70%'],
    size: '100%',
    dataLabels: {
        enabled: false
    }
};

const variablePieOptions = {
    startAngle: 0,
    innerSize: '30%',
    center: ['50%', '60%'],
    size: '110%',
    dataLabels: {
        enabled: true
    }
};

const columnOptions = {
    pointWidth: 30,
    borderRadius: 5,
    borderWidth: 0,
    pointPadding: 0,
    groupPadding: 0
};

//chart options
const animationOptions = {
    enabled: true,
    duration: 500,
    easing: 'easeOutQuint'
};
let axisVisible = false;

const data = [
    { y: 10 },
    { y: 20 },
    { y: 40 },
    { y: 5 },
    { y: 10 },
    { y: 15 },
    { y: 40 },
    { y: 5 },
    { y: 10 },
    { y: 15 }
];

let tempData = [];

///for the ranges
let rmin, rmax;

const itemRanges = [[-100, 100], [-100, 100], [0, 100], [0, 200]];
const variablePieRanges = [[0, 6], [0, 100], [0, 200], [0, 10]];
const columnRanges = [[1, 100], [0, 6], [0, 4], [0, 100]];
const areaRanges = [[0, 100], [-100, 100], [1, 25], [80, 500]];

const ranges = [
    itemRanges,
    variablePieRanges,
    columnRanges,
    areaRanges
];

///series controls
const seriesTypes = ['item', 'variablepie', 'column', 'area'];
let seriesType = 'item';

const controls = [
    ['startAngle', 'endAngle', 'innerSize', 'size'],
    ['variwide', 'innerSize', 'size', 'slices'],
    ['width', 'plotBands', 'zones',  'radial'],
    ['alpha', 'beta', 'viewDistance', 'depth']
];
const controlLabels = [
    ['start angle', 'end angle', 'inner size', 'size'],
    ['variable radius', 'inner size', 'size', 'slices'],
    ['width', 'axis plot bands', 'axis zones', 'radial'],
    ['alpha', 'beta', 'view distance', 'depth']
];
const controlText = [
    ['Adjust the start angle',
        'Adjust the end angle',
        'Adjust the inner size',
        'Adjust the size'],
    ['Use the slider to adjust the slices',
        'Adjust the inner size',
        'Adjust the size',
        'Add/remove slices'],
    ['Adjust the point width',
        'Slide to +/- plot bands on the x axis',
        'Slide to move the columns through the zones',
        'Adjust the y axis max'],
    ['Adjust the alpha angle',
        'Adjust the beta angle',
        'Adjust the view distance',
        'Adjust the fill opacity']
];

let controlIndex = 0;
let seriesIndex = 0;
let controlsToUse = controls[0];
let thingToChange = 'startAngle';
let controlElementActive = '.controls #controlType1';
let labelElementActive  = controlElementActive + ' ~ .form-check-label';

///stand-alone 3d area chart
const areaChartOptions = {
    chart: {
        type: 'area',
        animation: {
            duration: 500,
            easing: 'easeOutQuint'
        },
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 1,
            depth: 200,
            viewDistance: 25
        },
        events: {
            load: function () {
                const chart = this;
                setTimeout(function () {
                    chart.update({
                        chart: {
                            options3d: {
                                beta: 45
                            }
                        }
                    });
                }, 1000);

            }
        }
    },
    legend: {
        enabled: false
    },
    title: {
        text: ''
    },
    yAxis: {
        title: {
            text: 'Height Above Sea Level',
            x: -40
        },
        labels: {
            format: '{value:,.0f} MAMSL'
        },
        gridLineDashStyle: 'Dash',
        gridLineColor: '#999'
    },
    xAxis: [{
        visible: false
    }, {
        visible: false
    }, {
        visible: false
    }],
    plotOptions: {
        area: {
            depth: 70,
            lineWidth: 5,
            marker: {
                enabled: false
            },
            states: {
                inactive: {
                    enabled: false
                }
            },
            fillOpacity: 0.7
        }
    },
    tooltip: {
        valueSuffix: ' MAMSL'
    },
    series: [{
        name: "Tatra Mountains visible from Rusinowa polana",
        data: [
            ['Murań', 1890],
            ['Nowy Wierch', 2009],
            ['Hawrań', 2152],
            ['Płaczliwa Skała', 2142],
            ['Szalony Wierch', 2061],
            ['Karczmarski Wierch', 1438],
            ['Jagnięcy Szczyt', 2230],
            ['Czerwona Turnia', 2284],
            ['Kołowy Szczyt', 2418],
            ['Czarny Szczyt', 2429],
            ['Baranie Rogi', 2526],
            ['Śnieżny Szczyt', 2465],
            ['Lodowy Szczyt', 2627],
            ['Lodowa Kopa', 2602],
            ['Szeroka Jaworzyńska', 2210],
            ['Horwacki Wierch', 1902],
            ['Spismichałowa Czuba', 2012],
            ['Zielona Czuba', 2130],
            ['Wielicki Szczyt', 2318],
            ['Gerlach', 2655],
            ['Batyżowiecki Szczyt', 2448],
            ['Kaczy Szczyt', 2395],
            ['Zmarzły Szczyt', 2390],
            ['Kończysta', 2538],
            ['Młynarz', 2170],
            ['Ganek', 2462],
            ['Wysoka', 2547],
            ['Ciężki Szczyt', 2520],
            ['Rysy', 2503],
            ['Żabi Mnich', 2146],
            ['Żabi Koń', 2291],
            ['Żabia Turnia Mięguszowiecka', 2335],
            ['Wołowa Turnia', 2373]
        ]
    }, {
        xAxis: 1,
        name: "Dachstein panorama seen from Krippenstein",
        data: [
            ['Kufstein', 2049],
            ['Hohe Wildstelle', 2746],
            ['Kleiner Miesberg', 2173],
            ['Großer Miesberg', 2202],
            ['Hochstein', 2543],
            ['Lackner Miesberg', 2232],
            ['Wasenspitze', 2257],
            ['Sinabell', 2349],
            ['Feister Scharte', 2198],
            ['Eselstein', 2556],
            ['Landfriedstein', 2536],
            ['Scheichenspitz', 2667],
            ['Schmiedstock', 2634],
            ['Gamsfeldspitze', 2611],
            ['Edelgriess', 2305],
            ['Koppenkarstein', 2863],
            ['Niederer Gjaidstein', 2483],
            ['Hoher Gjaidstein', 2794],
            ['Hoher Dachstein', 2995],
            ['Niederer Dachstein', 2934],
            ['Hohes Kreuz', 2837],
            ['Hoher Ochsenkogel', 2513]
        ]
    }, {
        xAxis: 2,
        name: "Panorama from Col Des Mines",
        data: [
            ['Combin de la Tsessette', 4141],
            ['Grand Combin de Grafeneire', 4314],
            ['Combin de Corbassière', 3716],
            ['Petit Combin', 3672],
            ['Pointe de Boveire', 3212],
            ['Grand Aget', 3133],
            ['Mont Rogneux', 3084],
            ['Dents du Grand Lé', 2884],
            ['Monts Telliers', 2951],
            ['Grand Golliat', 3238],
            ['Mont Grande Rochère', 3326],
            ['Mont de la Fouly', 2871],
            ['Tête de la Payanne', 2452],
            ['Pointe Allobrogia', 3172],
            ['Six Blanc', 2334],
            ['Mont Dolent', 3820],
            ['Aiguille de Triolet', 3870],
            ['Le Tour Noir', 3836],
            ["Aiguille de l'A Neuve", 3753],
            ["Aiguille d'Argentière", 3900],
            ["Aiguille du Chardonnet", 3824],
            ["Aiguille du Tour", 3540],
            ["Aiguille du Pissoir", 3440],
            ["Le Catogne", 2598],
            ["Pointe de Prosom", 2762],
            ["Pointe Ronde", 2700],
            ["Mont Buet", 3096],
            ["Le Cheval Blanc", 2831],
            ["Pointe de la Finive", 2838],
            ["Pic de Tenneverge", 2985],
            ["Pointe d'Aboillon", 2819],
            ["Tour Sallière", 3220],
            ["Le Dôme", 3138],
            ["Haute Cime", 3257],
            ["Pierre Avoi", 2473],
            ["Cime de l'Est", 3178]
        ]
    }]
};

//chart for the other demos
const demoChartOptions = {
    chart: {
        margin: chartMargin,
        spacing: chartSpacing,
        animation: animationOptions
    },
    title: {
        text: ''
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            colorByPoint: true,
            pointPadding: 0,
            zoneAxis: 'y'
        },
        item: itemOptions,
        column: columnOptions,
        variablepie: variablePieOptions
    },
    xAxis: [
        {
            visible: false
        },
        {
            visible: false
        },
        {
            visible: true
        },
        {
            visible: true
        }
    ],
    yAxis: [{
        title: '',
        visible: false
    }
    ],
    series: [
        {
            type: 'item',
            data: initialChartData,
            zones: []
        }
    ]
};

///populates the labels
function populateLabel(control, label) {
    let suffix = '';
    const thingText = controlText[seriesIndex][controlIndex];

    if (control === 'startAngle' || control === 'endAngle') {
        suffix = 'deg';
    }
    if (control === 'size' || control === 'innerSize') {
        suffix = '%';
    }
    if (control === 'width') {
        suffix = 'px';
    }
    if (control === 'zones' || control === 'yAxis') {
        suffix = 'max';
    }
    if (control === 'radial') {
        suffix = 'max';
    }
    let valueToShow = parseFloat($('#' + controlsToUse[controlIndex]).val());
    if (control !== 'beta') {
        valueToShow = Math.abs(valueToShow);
    }
    if (control === 'opacity' || control === 'pointPadding') {
        valueToShow = parseFloat((valueToShow * 0.1), 10).toFixed(1);
    }
    if (control === 'zones' || control === 'plotBands' || control === 'variwide') {
        $(label + ' span').html('');
        $(label).addClass('font-weight-bold');
    } else {
        $(label + ' span').html(valueToShow + ' ' + suffix);
        $(label).removeClass('font-weight-bold');
    }
    $('#thing').html(thingText);
}

//CHANGE FUNCTIONS triggered by the sliders
//for item and pie
function innerSizeChange(value) {
    if (seriesType === 'variablepie') {
        demoChart.update({
            plotOptions: {
                variablepie: {
                    innerSize: value + '%'
                }
            }
        });
    } else {
        demoChart.update({
            plotOptions: {
                item: {
                    innerSize: value + '%'
                }
            }
        });
    }
    populateLabel(thingToChange, labelElementActive);

}
//for item
function startAngleChange(value) {
    demoChart.update({
        plotOptions: {
            item: {
                startAngle: value
            }
        }
    });
    populateLabel(thingToChange, labelElementActive);

}
//for item
function endAngleChange(value) {
    demoChart.update({
        plotOptions: {
            item: {
                endAngle: value
            }
        }
    });
    populateLabel(thingToChange, labelElementActive);

}
//for item and pie
function sizeChange(value) {
    if (seriesType === 'item') {
        demoChart.update({
            plotOptions: {
                item: {
                    size: value + '%'
                }
            }
        });
    } else {
        demoChart.update({
            plotOptions: {
                variablepie: {
                    size: value + '%'
                }
            }
        });
    }
    populateLabel(thingToChange, labelElementActive);

}
//for pie
function slicesChange(value) {
    tempData = data.slice(0, value);
    demoChart.series[0].update({
        data: tempData
    });
    populateLabel(thingToChange, labelElementActive);
}
//for pie
let variCount = 0;
let variDir = 'up';
function variwideChange(value) {
    const yzVals = [
        [115, 5100, 10, null],
        [95, 4600, 20, null],
        [75, 4100, 40, null],
        [55, 3600, 5, null],
        [35, 3100, 10, null],
        [15, 2600, 15, null]
    ];
    if (variDir === 'up') {
        demoChart.update({
            plotOptions: {
                variablepie: {
                    innerSize: '5%'
                }
            }
        });
        demoChart.series[0].data[variCount].update({
            y: yzVals[variCount][0],
            z: yzVals[variCount][1]
        });
        if (value === 6) {
            variDir = 'down';
        } else {
            variCount = value;
        }
    } else {
        demoChart.series[0].data[variCount].update({
            y: yzVals[variCount][2],
            z: null
        });
        variCount = value;
        if (value === 0) {
            demoChart.series[0].data.forEach(function (p) {
                p.update({
                    z: null
                });
            });
            demoChart.update({
                plotOptions: {
                    variablepie: {
                        innerSize: '30%'
                    }
                }
            });
            variDir = 'up';
        }
    }
    populateLabel(thingToChange, labelElementActive);
}
//for column
function widthChange(value) {
    demoChart.update({
        plotOptions: {
            column: {
                pointWidth: value
            }
        }
    });
    populateLabel(thingToChange, labelElementActive);
}
//for column
function radialChange(value) {
    demoChart.yAxis[0].setExtremes(0, value);
    populateLabel(thingToChange, labelElementActive);
}
//for column
let pbStart = 0;
function plotBandsChange(value) {
    const color = Highcharts.getOptions().colors[value];
    if (value > pbStart) {
        demoChart.xAxis[0].addPlotBand({
            id: '' + value,
            color: Highcharts.color(color).brighten(0.5).get(),
            from: value - 1.5,
            to: value - 0.5,
            dashStyle: 'solid',
            borderWidth: 2,
            borderColor: '#fff',
            zIndex: 2,
            label: {
                text: 'Band ' + value
            }
        });
    } else {
        demoChart.xAxis[0].removePlotBand('' + pbStart);
    }
    pbStart = value;
    populateLabel(thingToChange, labelElementActive);
}
//for column
function zonesChange(value) {
    const yVals = [
        [10, 20, 30, 40, 50],
        [20, 30, 40, 50, 50],
        [40, 50, 50, 50, 50],
        [5, 15, 25, 35, 45],
        [10, 20, 30, 40, 50],
        [15, 25, 35, 45, 45]
    ];
    demoChart.series[0].data.forEach(function (p) {
        p.update({
            y: yVals[p.index][value]
        });
    });
    populateLabel(thingToChange, labelElementActive);
}
//for area
function alphaChange(value) {
    areaChart.options.chart.options3d.alpha = parseFloat(value);
    areaChart.redraw(false);
    populateLabel(thingToChange, labelElementActive);
}
//for area
function betaChange(value) {
    console.log(areaChart.options.chart.options3d.beta);
    areaChart.options.chart.options3d.beta = parseFloat(value);
    areaChart.redraw(false);
    populateLabel(thingToChange, labelElementActive);
}
//for area
function viewDistanceChange(value) {
    areaChart.options.chart.options3d.viewDistance = parseFloat(value);
    areaChart.redraw(false);
    populateLabel(thingToChange, labelElementActive);
}
//for area
function depthChange(value) {
    areaChart.options.chart.options3d.depth = parseFloat(value);
    areaChart.update({
        plotOptions: {
            area: {
                depth: parseFloat(value) * 0.4
            }
        }
    });
    areaChart.redraw(false);
    populateLabel(thingToChange, labelElementActive);
}

$('document').ready(function () {

    ///build the charts, the area is hidden
    demoChart = Highcharts.chart('container', demoChartOptions);
    areaChart = Highcharts.chart('container-area', areaChartOptions);

    ///reset the series/chart options
    const resetCharts = function () {
        ///destroy the chart
        demoChart.destroy();

        ///special cases
        if (seriesType === 'item' || seriesType === 'pie') {
            chartMargin = 0;
            chartSpacing = 0;
            axisVisible = false;
        } else {
            chartMargin = 40;
            chartSpacing = 40;
            axisVisible = true;
        }

        ///make the chart again
        demoChart = Highcharts.chart('container', {
            chart: {
                margin: chartMargin,
                spacing: chartSpacing,
                animation: animationOptions
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    pointPadding: 0,
                    zoneAxis: 'y'
                },
                item: itemOptions,
                column: columnOptions,
                variablepie: variablePieOptions
            },
            xAxis: [
                {
                    visible: axisVisible,
                    plotBands: []
                },
                {
                    visible: false
                },
                {
                    visible: true
                },
                {
                    visible: true
                }
            ],
            yAxis: [{
                title: '',
                visible: axisVisible,
                gridLineDashStyle: 'dash',
                plotLines: [],
                min: 0,
                max: 50
            }],
            series: [
                {
                    type: seriesType,
                    data: [
                        { y: 10 },
                        { y: 20 },
                        { y: 40 },
                        { y: 5 },
                        { y: 10 },
                        { y: 15 }
                    ],
                    zones: []
                }
            ]
        });

        if (seriesType !== 'area') {
            ///show the area chart, hide the demo chart
            $('#container-area').removeClass('d-flex');
            $('#container-area').addClass('d-none');
            $('#container').removeClass('d-none');

        } else {
            $('#container-area').addClass('d-flex');
            $('#container-area').removeClass('d-none');
            $('#container').addClass('d-none');
        }
    };

    ///initialize series controls
    const initControls = function () {

        ///single option to change
        thingToChange = controls[seriesIndex][controlIndex]; //string

        //hide the radios, clear out the labels, hide sliders
        $('.form-check').each(function () {
            $(this).parent().parent().removeClass('flex-fill');
            $(this).parent().parent().removeClass('flex-grow-1');
            $(this).parent().addClass('d-none');
            $(this).removeClass('active');
        });
        $('.form-check-label').each(function () {
            $(this).html('');
        });
        $('.slider').each(function () {
            $(this).addClass('d-none');
        });

        //build the radios
        let controlElement, labelElement;
        for (let ii = 0; ii < controlsToUse.length; ++ii) {
            //the radio
            controlElement = '.controls #controlType' + (ii + 1);
            labelElement  = controlElement + ' ~ .form-check-label';
            $(labelElement).css({ textAlign: 'center', marginLeft: '0px' });

            ///apply the min, max to the range, set the range value
            rmin = ranges[seriesIndex][controlIndex][0];
            rmax = ranges[seriesIndex][controlIndex][1];
            const  initialValue = initialValues[seriesIndex][controlIndex];
            $('#' + thingToChange).attr('min', rmin);
            $('#' + thingToChange).attr('max', rmax);
            $('#' + thingToChange).val(initialValue);

            //populate labels with text
            $(labelElement).html(controlLabels[seriesIndex][ii]);

            //show the radios
            $(controlElement).parent().parent().removeClass('d-none');
            $(controlElement).parent().parent().addClass('flex-fill');
            if ($(controlElement).hasClass('d-none')) {
                $(controlElement).removeClass('d-none');
            }
            //active the chosen radio label and show the value
            if (ii === controlIndex) {
                $(controlElement).parent().addClass('active');
                $(controlElement).parent().addClass('flex-grow-1');
                const valueSpan = '<span>' +  initialValues[seriesIndex][ii] + '</span>';
                $(labelElement).html(
                    controlLabels[seriesIndex][ii] + ': ' + valueSpan);
                populateLabel(controlsToUse[ii], labelElement);
                controlElementActive = controlElement;
                labelElementActive = labelElement;
            }
        }
        ///show the proper slider
        $('#' + thingToChange).removeClass('d-none');

        ///configure chart for individual cases

        ///FOR COLUMN: disable polar, inverted, enabled animation
        if (thingToChange === 'width' || thingToChange === 'plotBands' || thingToChange === 'zones') {
            demoChart.update({
                chart: {
                    polar: false,
                    inverted: false,
                    animation: {
                        enabled: true
                    }
                },
                plotOptions: {
                    column: {
                        pointWidth: 30
                    }
                }
            });
        }

        ///FOR COLUMN: invert, polar, disable animation for radial
        if (thingToChange === 'radial') {
            demoChart.update({
                chart: {
                    inverted: true,
                    polar: true,
                    animation: {
                        enabled: false
                    }
                }
            });
            demoChart.yAxis[0].setExtremes(0, 20);
        }

        //FOR COLUMN: build the zones/plotLines arrays
        if (thingToChange === 'zones') {
            const zonesArray = [];
            const plotLines = [];
            demoChart.xAxis[0].setExtremes(-1, 5);
            for (let ii = 0; ii <= 6; ++ii) {
                const zoneValue = ii * 10; //create a zone every 10
                zonesArray.push({
                    value: zoneValue,
                    color: { patternIndex: ii },
                    fillColor: { patternIndex: ii }
                });
                plotLines.push({
                    value: zoneValue,
                    color: 'transparent',
                    label: {
                        useHTML: true,
                        formatter: function () {
                            return '<div><img height=15 style="border:1px solid #ccc" src="https://cdn.rawgit.com/highcharts/highcharts/b87bb2d3714aadff87ec6e128c9a4ee814222d13/samples/graphics/homepage-hero/p' + (ii + 1) + '.png"> Zone' + (ii) + '</div>';
                        }
                    },
                    align: 'left'

                });
            }
            demoChart.series[0].update({
                zones: zonesArray
            });
            demoChart.yAxis[0].update({
                plotLines: plotLines
            });
        }
    };

    ///series buttons (item, pie, column, area)
    $('.series-types button').click(function () {

        //deactivate all buttons
        $('.series-types button').each(function () {
            $(this).removeClass('active');
        });
        //highlight the right button
        $(this).addClass('active');

        //set the series type based on the button id
        seriesType = this.id;

        //find the right items to manipulate
        seriesIndex = seriesTypes.findIndex(element => element === seriesType);
        controlsToUse = controls[seriesIndex];
        controlIndex = 0;

        //reset charts
        resetCharts();

        ///check first radio for the series
        $('#controlType1').trigger('click');

        initControls();

    });

    ///the radio buttons
    $('input[name="controlType"]').change(function (e) {
        ///value of the clicked radio button
        //0,1,2,or 3
        e.preventDefault();
        $('label').each(function () {
            $(this).removeClass('font-weight-bold');
        });
        controlIndex = parseInt($(this).val(), 10);

        //reset the charts each radio click
        //keeps things orderly
        resetCharts();
        //initilize controls for the series
        initControls();
    });

    ///EVENT LISTENERS for the sliders
    ///innerSize - item and pie
    document.getElementById('innerSize').addEventListener('input',
        function (e) {
            e.preventDefault();
            innerSizeChange(parseFloat(this.value));
        }
    );
    ///size - item and pie
    document.getElementById('size').addEventListener('input',
        function () {
            sizeChange(parseFloat(this.value));
        }
    );
    ///endAngle - item
    document.getElementById('endAngle').addEventListener('input',
        function () {
            endAngleChange(parseFloat(this.value));
        }

    );
    //startAngle - item
    document.getElementById('startAngle').addEventListener('input',
        function () {
            startAngleChange(parseFloat(this.value));
        }
    );
    //slices - pie
    document.getElementById('slices').addEventListener('input',
        function () {
            slicesChange(parseFloat(this.value));
        }
    );
    ///variwide - pie
    document.getElementById('variwide').addEventListener('input',
        function () {
            variwideChange(parseFloat(this.value));
        }
    );
    //column width - column
    document.getElementById('width').addEventListener('input',
        function () {
            widthChange(parseFloat(this.value));
        }
    );
    ///radial - for column
    document.getElementById('radial').addEventListener('input',
        function () {
            radialChange(parseFloat(this.value));
        }
    );
    ///plotBands - column
    document.getElementById('plotBands').addEventListener('input',
        function () {
            plotBandsChange(parseFloat(this.value));
        }
    );
    ///zones - column
    document.getElementById('zones').addEventListener('input',
        function () {
            zonesChange(parseFloat(this.value));
        }
    );
    ///alpha - 3d area
    document.getElementById('alpha').addEventListener('input',
        function () {
            alphaChange(parseFloat(this.value));
        });

    ///beta - 3d area
    document.getElementById('beta').addEventListener('input',
        function () {
            betaChange(parseFloat(this.value));
        });

    //viewDistance - 3d area
    document.getElementById('viewDistance').addEventListener('input',
        function () {
            viewDistanceChange(parseFloat(this.value));
        });
    //depth - 3d area
    document.getElementById('depth').addEventListener('input',
        function () {
            depthChange(parseFloat(this.value));
        });


    ///PLUS MINUS CONTROLS FOR THE SLIDER
    let pushed;
    function move(dir) {
        let increment = 5;
        const min = ranges[seriesIndex][controlIndex][0];
        const max = ranges[seriesIndex][controlIndex][1];

        if (thingToChange === 'variwide' || thingToChange === 'slices') {
            increment = 1;
        }
        //current value of the range slider
        let value = parseFloat($('#' + thingToChange).val());

        $('.fas').each(function () {
            $(this).removeClass('disabled');
        });
        console.log(dir, value, max);
        if ((dir === 'min' && value <= min) || (dir === 'max' && value >= max)) {
            $(pushed).addClass('disabled');
            return;
        }
        if (dir === 'min') {
            value = value - increment;
        } else {
            value = value + increment;
        }
        $('#' + thingToChange).val(value);
        const functionName = thingToChange + 'Change';
        window[functionName](value);
    }

    $('#min i').click(function () {
        pushed = this;
        move('min');
    });
    $('#max i').click(function () {
        pushed = this;
        move('max');
    });


});
