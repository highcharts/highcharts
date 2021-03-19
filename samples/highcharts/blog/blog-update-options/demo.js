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
    endAngle: 100,
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
    pointWidth: 30,
    borderRadius: 20,
    borderWidth: 0
};

$('document').ready(function () {

    const demoChart = Highcharts.chart('container3', {
        chart: {
            margin: chartMargin,
            spacing: chartSpacing
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

    const seriesTypes = ['item', 'pie', 'column', 'line'];
    let seriesType = 'item';
    const controls = [
        ['start angle', 'end angle', 'inner size', 'size'],
        ['inner size', 'size', '+/- slices', 'slice'],
        ['x axis', 'y axis', 'width', 'border'],
        ['x axis', 'y axis', 'line width', 'marker']
    ];

    let controlIndex = 0; //the value of the selected radio button
    let seriesIndex = 0;
    let controlsToUse = controls[0];
    let thingToChange = 'start angle';
    let thingToChangeValue = -100;

    //for the pie
    let pieSlices = 6;
    let sliced = 0;

    ///for the range
    let rmin, rmax;
    let element;
    const itemRanges = [[-100, 100], [-100, 100], [0, 100], [0, 200]];
    const pieRanges = [[0, 100], [0, 200], [0, 10], [0, 6]];
    const columnRanges = [[0, 20], [0, 100], [1, 50], [0, 30]];
    const lineRanges = [[0, 20], [0, 100], [1, 20], [1, 20]];
    const initialValues = [
        [-100, 100, '30%', '100%'],
        ['30%', '100%', 6, 0],
        [6, 50, 30, 20],
        [6, 50, 10, 16]
    ];
    const ranges = [
        itemRanges,
        pieRanges,
        columnRanges,
        lineRanges
    ];

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
        demoChart.xAxis[0].setExtremes(0, 6);
        demoChart.yAxis[0].setExtremes(0, 50);
        if (seriesType === 'item' || seriesType === 'pie') {
            chartMargin = 0;
            chartSpacing = 0;
            axisVisible = false;
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
            }
        });
        demoChart.series[0].update({
            data: chartData
        });
        for (let ii = 0; ii < chartData.length; ++ii) {
            demoChart.series[0].points[ii].update({
                selected: false,
                sliced: false
            });
        }
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
        thingToChange = controlsToUse[controlIndex];

        //hide the radios, clear out the labels
        $('.form-check').each(function () {
            $(this).parent().addClass('d-none');
            $(this).removeClass('active');
        });
        $('.form-check-label').each(function () {
            $(this).html('');
        });
        //build the radios
        for (let ii = 0; ii < controlsToUse.length; ++ii) {
            //the radio
            element = '.controls #controlType' + (ii + 1);
            //populate labels
            $(element + ' ~ .form-check-label').html(controlsToUse[ii]);
            //show the radios
            $(element).parent().parent().removeClass('d-none');
            //active the chosen radio label
            if (ii === controlIndex) {
                $(element).parent().addClass('active');
            }
        }

        //show the right amount of values under the slider
        ///these are hidden in the HTML right now
        $('.val').each(function () {
            $(this).addClass('d-none');
            $(this).removeClass('active');
        });
        $('#val' + controlIndex).addClass('active');

        //set the min, max, values to be used with the slider
        const optionPath = demoChart.userOptions.plotOptions;
        for (let ii = 0; ii < controlsToUse.length; ++ii) {
            $('#val' + ii).removeClass('d-none');
            switch (thingToChange) {
            case 'start angle':
                thingToChangeValue = optionPath.item.startAngle;
                break;

            case 'end angle':
                thingToChangeValue = optionPath.item.endAngle;
                break;

            case 'inner size':
                if (seriesType === 'pie') {
                    thingToChangeValue = optionPath.pie.innerSize;
                } else {
                    thingToChangeValue = optionPath.item.innerSize;
                }
                break;

            case 'size':
                if (seriesType === 'pie') {
                    thingToChangeValue = optionPath.pie.size;
                } else {
                    thingToChangeValue = optionPath.item.size;
                }
                break;

            case 'width':
                thingToChangeValue = optionPath.column.pointWidth;
                break;

            case 'border':
                thingToChangeValue = optionPath.column.borderRadius;
                break;

            case 'x axis':
                thingToChangeValue = 0;
                break;

            case 'y axis':
                thingToChangeValue = 0;
                break;

            case '+/- slices':
                thingToChangeValue = 6;
                break;

            case 'marker':
                thingToChangeValue = 6;
                break;

            case 'slice':
                thingToChangeValue = 0;
                break;

            default:
            }
        }
        ///highlight the proper value box (under the slider)
        ///these are hidden right now
        $('.val').each(function () {
            $(this).addClass('font-weight-lighter');
        });
        $('#val' + controlIndex).removeClass('font-weight-lighter');
        $('.val').each(function (index) {
            $('#val' + index).html(initialValues[seriesIndex][index]);
        });

        ///apply the min, max to the range, set the range value
        //show the proper min/max labels
        rmin = ranges[seriesIndex][controlIndex][0];
        rmax = ranges[seriesIndex][controlIndex][1];
        $('#control').attr('min', rmin);
        $('#control').attr('max', rmax);

        ///set the slider value
        $('#control').val(parseInt(thingToChangeValue, 10));
    };

    ///the radio buttons
    $('input[name="controlType"]').change(function () {
        ///value of the clicked radio button
        //tells what option to manipulate
        //0,1,2,or 3
        controlIndex = parseInt($(this).val(), 10);
        //set up the controls
        initControls();
    });

    ///slider
    $('#control').change(function () {
        const data = [10, 20, 40, 5, 10, 15, 33, 41, 21, 13, 48];
        const tempData = data.slice(0, pieSlices);
        const value = parseInt($(this).val(), 10);

        ///for the pie
        let slice;

        ///change the series/chart option
        switch (thingToChange) {
        case 'start angle':
            demoChart.update({
                plotOptions: {
                    item: {
                        startAngle: value
                    }
                }
            });
            break;

        case 'end angle':
            demoChart.update({
                plotOptions: {
                    item: {
                        endAngle: value
                    }
                }
            });
            break;

        case 'inner size':
            demoChart.update({
                plotOptions: {
                    item: {
                        innerSize: value + '%'
                    },
                    pie: {
                        innerSize: value + '%'
                    }
                }
            });
            break;

        case 'size':
            demoChart.update({
                plotOptions: {
                    item: {
                        size: value + '%'
                    },
                    pie: {
                        size: value + '%'
                    }
                }
            });
            break;

        case 'border':
            demoChart.update({
                plotOptions: {
                    column: {
                        borderRadius: value
                    }
                }
            });
            break;

        case 'width':
            demoChart.update({
                plotOptions: {
                    column: {
                        pointWidth: value
                    }
                }
            });
            break;

        case 'line width':
            demoChart.update({
                plotOptions: {
                    line: {
                        lineWidth: value
                    }
                }
            });
            break;

        case 'marker':
            demoChart.update({
                plotOptions: {
                    line: {
                        marker: {
                            enabled: true,
                            radius: value
                        }
                    }
                }
            });
            break;

        case 'x axis':
            demoChart.xAxis[0].setExtremes(0, value);
            break;

        case 'y axis':
            demoChart.yAxis[0].setExtremes(0, value);
            break;

        case '+/- slices':
            demoChart.series[0].update({
                data: tempData
            });
            pieRanges[3][1] = tempData.length;
            $('#control').val(pieRanges[3][1]);
            pieSlices = value;
            break;

        case 'slice':
            if (value < sliced) {
                ///going down
                for (let dd = sliced; dd > value; --dd) {
                    slice = demoChart.series[0].points[dd - 1];
                    slice.update({
                        selected: false,
                        sliced: false
                    });
                }
                sliced = value;
            } else {
                //going up
                sliced = value;
                for (let uu = 0;  uu < sliced; ++uu) {
                    slice = demoChart.series[0].points[uu];
                    slice.update({
                        selected: true,
                        sliced: true
                    });
                }
            }
            break;

        default:

        }
        ///set the right value in the value box (hidden right now)
        $('#val' + controlIndex).html($(this).val());
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
        resizeChart();

        ///first radio checked by default.
        $('#controlType1').trigger('click');
        initControls();


    });

    ///PLUS MINUS CONTROLS FOR THE SLIDER

    // The plus or minus button
    const minBtn = document.querySelector('#min');
    const maxBtn = document.querySelector('#max');

    let timerID;
    let counter = 0;
    let direction = 'max';

    const pressHoldEvent = new CustomEvent("pressHold");

    // Increase or decreae value to adjust how long
    // one should keep pressing down before the pressHold
    // event fires
    let pressHoldDuration = 15;

    //the plus and minus buttons
    const elementsArray = document.querySelectorAll(".fas");

    function move(dir) {
        //current min/max of the range slider
        const min = parseInt($('#control').attr('min'), 10);
        const max = parseInt($('#control').attr('max'), 10);

        let increment = 5;
        if (seriesIndex === 1 && controlIndex === 3) {
            increment = 1;
        }

        //current value of the range slider
        let value = parseInt($('#control').val(), 10);

        if (value > min && dir === 'min') {
            value = value - increment;
            $('#control').val(value);
            $('#control').trigger('change');
        } else if (value < max && dir === 'max') {
            value = value + increment;
            $('#control').val(value);
            $('#control').trigger('change');
        } else {
            $(this).addClass('disabled');
        }
    }

    function timer() {
        if (seriesIndex === 1) {
            pressHoldDuration = 100;
        } else {
            pressHoldDuration = 15;
        }
        if (counter < pressHoldDuration) {
            timerID = requestAnimationFrame(timer);
            counter++;
            move(direction);

        } else {
            for (let ii = 0; ii < elementsArray.length; ++ii) {
                elementsArray[ii].dispatchEvent(pressHoldEvent);
            }
        }
    }
    function doSomething() {
        move(direction);
    }

    // Listening for our custom pressHold event
    minBtn.addEventListener("pressHold", doSomething, false);
    maxBtn.addEventListener("pressHold", doSomething, false);

    function pressingDown(e) {
        e.preventDefault();
        ///plus or minus button
        const button = e.target;
        direction = 'max';
        if ($(button).hasClass('fa-minus')) {
            direction = 'min';
        }
        ///start the timer
        requestAnimationFrame(timer);
    }

    function notPressingDown() {
        // Stop the timer
        cancelAnimationFrame(timerID);
        counter = 0;
    }

    //attach events to plus/minus buttons
    elementsArray.forEach(function (elem) {
        elem.addEventListener("mousedown", pressingDown, false);
        elem.addEventListener("mouseup", notPressingDown, false);
        elem.addEventListener("mouseleave", notPressingDown, false);
    });

});
