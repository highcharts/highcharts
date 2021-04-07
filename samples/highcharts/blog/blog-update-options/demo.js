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

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

let chartMargin = 0;
let chartSpacing = 0;
const chartData = [10, 20, 40, 5, 10, 15];
let axisVisible = false;

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

const pieOptions = {
    startAngle: 100,
    innerSize: '30%',
    center: ['50%', '60%'],
    size: '80%',
    dataLabels: {
        enabled: false
    }

};
const lineOptions = {
    lineWidth: 10,
    marker: {
        radius: 16
    }
};
const columnOptions = {
    pointWidth: 20,
    borderRadius: 5,
    borderWidth: 0,
    allowOverlap: true,
    dragDrop: {
        draggableY: false,
        draggableX: false,
        dragHandle: {
            lineWidth: 0
        }
    }

};

let demoChart;
const data = [10, 20, 40, 5, 10, 15, 33, 41, 21, 13, 48];
let tempData = [];

///for the range
let rmin, rmax;

const itemRanges = [[-100, 100], [-100, 100], [0, 100], [0, 200]];
const pieRanges = [[0, 100], [0, 200], [0, 10], [-25, -2]];
const columnRanges = [[0, 20], [0, 100], [1, 50], [0, 100]];
const lineRanges = [[0, 20], [0, 100], [1, 20], [1, 20]];

const ranges = [
    itemRanges,
    pieRanges,
    columnRanges,
    lineRanges
];

const seriesTypes = ['item', 'pie', 'column', 'line'];
let seriesType = 'item';

const controls = [
    ['startAngle', 'endAngle', 'innerSize', 'size'],
    ['innerSize', 'size', 'slices', 'animation'],
    ['xAxis', 'yAxis', 'width', 'radial'],
    ['xAxis', 'yAxis', 'lineWidth', 'marker']
];
const controlLabels = [
    ['start angle', 'end angle', 'inner aize', 'size'],
    ['inner size', 'size', 'slices', 'animation speed'],
    ['x axis', 'y axis', 'point width', 'radial'],
    ['x axis', 'y axis', 'line width', 'marker radius']
];
const controlText = [
    ['Adjust the start angle', 'Adjust the end angle', 'Adjust the inner size', 'Adjust the size'],
    ['Adjust the inner size', 'Adjust the size', 'Add/remove slices', 'Adjust the animation speed'],
    ['Adjust the x axis max', 'Adjust the y axis max', 'Adjus the column width', 'Adjust the y axis max'],
    ['Adjust the x axis max', 'Adjust the y axis max', 'Adjust the line width', 'Adjust the marker radius']
];

let controlIndex = 0; //the value of the selected radio button
let seriesIndex = 0;
let controlsToUse = controls[0];
let thingToChange = 'startAngle';
let controlElementActive = '.controls #controlType1';
let labelElementActive  = controlElementActive + ' ~ .form-check-label';

///for the spin animation
const animationSlider = document.getElementById('animation'),
    button = document.getElementById('play');
let t; // animation

function populateLabel(control, label) {
    let suffix = '';
    const thingText = controlText[seriesIndex][controlIndex];

    if (control === 'startAngle' || control === 'endAngle') {
        suffix = 'deg';
    }

    if (control === 'size' || control === 'innerSize') {
        suffix = '%';
    }
    if (control === 'animation') {
        suffix = 'ms';
    }
    if (control === 'width' || control === 'lineWidth' || control === 'marker') {
        suffix = 'px';
    }
    if (control === 'xAxis' || control === 'yAxis') {
        suffix = 'max';
    }
    if (control === 'radial') {
        suffix = 'max';
    }

    let valueToShow = parseFloat($('#' + controlsToUse[controlIndex]).val());
    valueToShow = Math.abs(valueToShow);

    $(label + ' span').html(valueToShow + ' ' + suffix);
    $('#thing').html(thingText);
}

function innerSizeChange(value) {
    if (seriesType === 'pie') {
        demoChart.update({
            plotOptions: {
                pie: {
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
                pie: {
                    size: value + '%'
                }
            }
        });
    }
    populateLabel(thingToChange, labelElementActive);

}

function slicesChange(value) {
    tempData = data.slice(0, value);
    demoChart.series[0].update({
        data: tempData
    });
    populateLabel(thingToChange, labelElementActive);

}

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

function lineWidthChange(value) {
    demoChart.update({
        plotOptions: {
            line: {
                lineWidth: value
            }
        }
    });
    populateLabel(thingToChange, labelElementActive);

}

function markerChange(value) {
    demoChart.update({
        plotOptions: {
            line: {
                marker: {
                    radius: value
                }
            }
        }
    });
    populateLabel(thingToChange, labelElementActive);


}

function xAxisChange(value) {
    demoChart.xAxis[0].setExtremes(0, value);
    populateLabel(thingToChange, labelElementActive);

}

function yAxisChange(value) {
    demoChart.yAxis[0].setExtremes(0, value);
    populateLabel(thingToChange, labelElementActive);

}

function radialChange(value) {
    demoChart.yAxis[0].setExtremes(0, value);
    populateLabel(thingToChange, labelElementActive);

}

function animationChange() {
    populateLabel(thingToChange, labelElementActive);

}

$('document').ready(function () {

    demoChart = Highcharts.chart('container', {
        chart: {
            margin: chartMargin,
            spacing: chartSpacing,
            animation: true
        },
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                colorByPoint: true
            },
            item: itemOptions,
            pie: pieOptions,
            line: lineOptions,
            column: columnOptions
        },
        yAxis: {
            title: ''
        },
        series: [{
            type: 'item',
            data: chartData
        }
        ]
    });

    ///change the chart scale on larger screens
    const resizeChart = () => {
        if (demoChart.chartWidth > 490 && seriesIndex === 0) {
            $('.highcharts-container svg').css({
                transform: 'scale(1.3, 1.3)'
            });
        } else {
            $('.highcharts-container svg').css({
                transform: 'scale(1, 1)'
            });
        }
        demoChart.reflow();
    };
    resizeChart();
    window.addEventListener("resize", resizeChart, false);

    ///reset the series/chart options
    const resetCharts = function () {

        ///reset the axes
        demoChart.xAxis[0].setExtremes(0, 6);
        demoChart.yAxis[0].setExtremes(0, 50);

        ///update the series with new type
        demoChart.series[0].update({
            data: chartData,
            type: seriesType
        });
        ///special cases
        if (seriesType === 'item' || seriesType === 'pie') {
            chartMargin = 0;
            chartSpacing = 0;
            axisVisible = false;
            if (seriesType === 'item') {
                demoChart.options.plotOptions.item.startAngle = -100;
                demoChart.options.plotOptions.item.endAngle = 100;
                demoChart.update({
                    plotOptions: {
                        item: {
                            startAngle: -100,
                            endAngle: 100
                        }
                    }
                });
            } else {
                demoChart.options.plotOptions.pie.startAngle = 100;
                demoChart.options.plotOptions.pie.endAngle = null;
                demoChart.update({
                    plotOptions: {
                        pie: {
                            startAngle: -100,
                            endAngle: null
                        }
                    }
                });
            }
        } else {
            chartMargin = 40;
            chartSpacing = 40;
            axisVisible = true;
        }
        demoChart.update({
            chart: {
                margin: chartMargin,
                spacing: chartSpacing
            },
            plotOptions: {
                item: itemOptions,
                pie: pieOptions,
                line: lineOptions,
                column: columnOptions
            },
            xAxis: {
                crosshair: {
                    width: 0,
                    color: 'red'
                }
            },
            yAxis: {
                crosshair: {
                    width: 0,
                    color: 'red'
                }
            }
        });

        demoChart.xAxis[0].update({
            visible: axisVisible
        });
        demoChart.yAxis[0].update({
            visible: axisVisible
        });

        //resize the chart after reset
        resizeChart();
    };

    ///initialize series controls
    const initControls = function () {

        ///single option to change
        thingToChange = controls[seriesIndex][controlIndex]; //string

        ///reset the chart stuff
        demoChart.update({
            chart: {
                animation: true,
                polar: false,
                inverted: false
            }
        });

        ///clear the timer for the spin
        clearInterval(t);
        //hide the spin button
        $('#play').addClass('d-none');

        //hide the radios, clear out the labels
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

            //populate labels
            $(labelElement).html(controlLabels[seriesIndex][ii]);

            //show the radios
            $(controlElement).parent().parent().removeClass('d-none');
            $(controlElement).parent().parent().addClass('flex-fill');
            if ($(controlElement).hasClass('d-none')) {
                $(controlElement).removeClass('d-none');
            }
            //active the chosen radio label
            if (ii === controlIndex) {
                $(controlElement).parent().addClass('active');
                $(controlElement).parent().addClass('flex-grow-1');
                const valueSpan = '<span>' + $('#' + controlsToUse[ii]).val() + '</span>';
                $(labelElement).html(
                    controlLabels[seriesIndex][ii] + ': ' + valueSpan);
                populateLabel(controlsToUse[ii], labelElement);
                controlElementActive = controlElement;
                labelElementActive = labelElement;
            }
        }

        ///apply the min, max to the range, set the range value
        rmin = ranges[seriesIndex][controlIndex][0];
        rmax = ranges[seriesIndex][controlIndex][1];

        $('#' + thingToChange).attr('min', rmin);
        $('#' + thingToChange).attr('max', rmax);

        ///show the proper slider
        $('#' + thingToChange).removeClass('d-none');

        //show the play button for the spin
        if (thingToChange === 'animation') {
            $('#play').removeClass('d-none');
        }
        /// invert, polar, and animation for radial
        if (thingToChange === 'radial') {
            demoChart.update({
                chart: {
                    polar: true,
                    inverted: true,
                    animation: false
                }
            });
        }
    };

    ///the radio buttons
    $('input[name="controlType"]').change(function () {
        ///value of the clicked radio button
        //tells what option to manipulate
        //0,1,2,or 3
        controlIndex = parseInt($(this).val(), 10);

        //set up the controls
        resetCharts();
        initControls();
    });

    ///EVENT LISTENERS
    ///innerSize
    document.getElementById('innerSize').addEventListener('input',
        function () {
            innerSizeChange(parseFloat(this.value));
        }
    );
    ///size
    document.getElementById('size').addEventListener('input',
        function () {
            sizeChange(parseFloat(this.value));
        }
    );

    ///endAngle
    document.getElementById('endAngle').addEventListener('input',
        function () {
            endAngleChange(parseFloat(this.value));
        }

    );

    //startAngle
    document.getElementById('startAngle').addEventListener('input',
        function () {
            startAngleChange(parseFloat(this.value));
        }

    );

    //slices
    document.getElementById('slices').addEventListener('input',
        function () {
            slicesChange(parseFloat(this.value));
        }
    );

    //column width
    document.getElementById('width').addEventListener('input',
        function () {
            widthChange(parseFloat(this.value));
        }
    );

    ///line width
    document.getElementById('lineWidth').addEventListener('input',
        function () {
            lineWidthChange(parseFloat(this.value));
        }
    );

    //marker radius
    document.getElementById('marker').addEventListener('input',
        function () {
            markerChange(parseFloat(this.value));
        }
    );

    //yAxis
    document.getElementById('yAxis').addEventListener('input',
        function () {
            yAxisChange(parseFloat(this.value));
        }
    );
    //xAxis
    document.getElementById('xAxis').addEventListener('input',
        function () {
            xAxisChange(parseFloat(this.value));
        }
    );
    ///radial
    document.getElementById('radial').addEventListener('input',
        function () {
            radialChange(parseFloat(this.value));
        }
    );
    ///animation
    document.getElementById('animation').addEventListener('input',
        function () {
            animationChange(Math.abs(parseFloat(this.value)));
        }
    );
    ///spin button
    button.addEventListener('click', e => {
        e.preventDefault();
        if (t) {
            clearInterval(t);
        }
        button.disabled = true;
        demoChart.update({
            chart: {
                animation: false
            }
        });

        /*
            Physics object with three customizable variables
            that change the behaviour of how the wheel behaves.
            */

        const springStrength = 0;
        const dragValue = 0;
        const springLength = 0;

        const physics = {
            force: 0,
            angleVel: 0,
            angle: 0,
            prevAngle: 0,  // only used to calculate winner
            strength: 0.003 + springStrength  / 10000, // tweakable
            drag: 0.98 + dragValue / 1000,     // tweakable
            threshold: 2 + springLength / 10,   // tweakable
            targ: 0,
            isActive: false
        };
        // How many degrees to spin for each iteration
        let diff = 25 + Math.random() * 10,
            startAngle = demoChart.options.plotOptions.item.startAngle;

        const animationSpeed = Math.abs(parseFloat(animationSlider.value));
        t = setInterval(() => { // Animation loop
            if (!physics.isActive) {
                startAngle += diff;
                if (startAngle > 360) {
                    startAngle -= 360;
                }
                diff *= 0.98;

                demoChart.update({
                    plotOptions: {
                        pie: {
                            startAngle: startAngle
                        }
                    }
                });
                // Transition to physics, and initialize the physics object.
                if (diff < physics.threshold) {
                    physics.isActive = true;
                    /*
                        Target should be the current angle.
                        The wheel will spring back and forth with
                        reference to this point.
                    */
                    physics.targ = startAngle;
                    physics.angleVel = physics.threshold * 0.98;
                    physics.angle = startAngle;

                }
            } else { // spring physics
                physics.prevAngle = physics.angle;
                physics.force = physics.targ - physics.angle;
                physics.force *= physics.strength;
                physics.angleVel *= physics.drag;
                physics.angleVel += physics.force;
                physics.angle += physics.angleVel;
                demoChart.update(
                    {
                        plotOptions: {
                            pie: {
                                startAngle: physics.angle
                            }
                        }
                    }
                );

            }
            if (physics.prevAngle <= physics.angle) {
                button.disabled = false;
            }
        }, animationSpeed);


    });

    ///series buttons
    $('.series-types button').click(function () {

        //highlight the right button
        $('.series-types button').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');

        //set the series type based on the button text
        seriesType = $(this).html();
        demoChart.series[0].update({ type: seriesType });

        //find the right items to manipulate
        seriesIndex = seriesTypes.findIndex(element => element === seriesType);

        controlsToUse = controls[seriesIndex];
        controlIndex = 0;

        //reset charts
        resetCharts();

        ///first radio checked by default.
        $('#controlType1').trigger('click');
        initControls();

    });

    ///PLUS MINUS CONTROLS FOR THE SLIDER
    let pushed;
    function move(dir) {
        //current min/max of the range slider
        const min = parseFloat($('#' + thingToChange).attr('min'));
        const max = parseInt($('#' + thingToChange).attr('max'), 10);

        let increment = 5;
        if (seriesIndex === 1 && controlIndex === 3) {
            increment = 1;
        }

        //current value of the range slider
        let value = parseFloat($('#' + thingToChange).val());


        $('.fas').each(function () {
            $(this).removeClass('disabled');
        });
        if (value > min && dir === 'min') {
            value = value - increment;
        } else if (value < max && dir === 'max') {
            value = value + increment;
        }

        $('#' + thingToChange).val(value);


        const functionName = thingToChange + 'Change';
        window[functionName](value);

        if (value === min || value === max) {
            $(pushed).addClass('disabled');
        }
    }

    $('#min i').click(function () {
        move('min');
    });
    $('#max i').click(function () {
        move('max');
    });


});
