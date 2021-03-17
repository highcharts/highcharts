Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
        '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {

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

let demoChart;

$('document').ready(function () {
    demoChart = Highcharts.chart('container3', {
        title: {
            text: ''
        },
        series: [{
            type: 'item',
            borderColor: 'transparent',
            marker: {
                radius: 6
            },
            borderRadius: 3,
            colorByPoint: true,
            borderWidth: 1,
            data: [
                10, 20, 40, 5, 10, 15
            ],
            dataLabels: {
                enabled: false
            },
            // Circular options
            startAngle: -100,
            endAngle: 100,
            innerSize: '30%',
            center: ['50%', '64%'],
            size: '55%'
        }
        ]
    });

    const seriesTypes = ['item', 'pie', 'column', 'line'];
    let seriesType = 'item';
    const controls = [
        ['start angle', 'end angle', 'inner size', 'size'],
        ['inner size', 'size', 'add/remove slices'],
        ['x axis', 'y axis', 'point width', 'border radius'],
        ['x axis', 'y axis', 'line width', 'marker size']
    ];
    const initialValues = [
        [-100, 100, '30%', '55%'],
        ['30%', '50%', 6],
        [6, 50, 30, 3],
        [6, 50, 2, 5]

    ];


    let controlIndex = 0; //the value of the selected radio button
    let seriesIndex = 0;
    let controlsToUse = controls[0];
    let thingToChange = 'start angle';
    let thingToChangeValue = -100;

    const initControls = function () {

        ///globals: controlsToUse, thingToChange, thingToChangeValue,
        //controlIndex set by radio button click

        ///single option to change
        thingToChange = controlsToUse[controlIndex];

        ///for the range
        let min, max;

        $('.form-check').each(function () {
            $(this).addClass('d-none');
        });

        ///populate the radio button text and show right amount of radios
        for (let ii = 0; ii < controlsToUse.length; ++ii) {
            const element = '.controls #controlType' + (ii + 1);
            $(element + ' ~ .form-check-label').html(controlsToUse[ii]);
            $(element).parent().removeClass('d-none');
        }

        //show the right amount of values under the slider
        $('.val').each(function () {
            $(this).addClass('d-none');
            $(this).removeClass('active');
        });

        $('#val' + controlIndex).addClass('active');

        for (let ii = 0; ii < controlsToUse.length; ++ii) {
            $('#val' + ii).removeClass('d-none');
            //set the min, max, value to be used with the slider
            switch (thingToChange) {
            case 'start angle':
                min = -100;
                max = 100;
                thingToChangeValue = demoChart.series[0].options.startAngle;
                break;

            case 'end angle':
                min = -100;
                max = 100;
                thingToChangeValue = demoChart.series[0].options.endAngle;
                break;

            case 'inner size':
                min = 0;
                max = 100;
                thingToChangeValue = demoChart.series[0].options.innerSize;
                break;

            case 'size':
                min = 0;
                max = 100;
                thingToChangeValue = demoChart.series[0].options.size;
                break;

            case 'point width':
                min = 0;
                max = 100;
                thingToChangeValue = demoChart.series[0].options.pointWidth;
                break;

            case 'border radius':
                min = 0;
                max = 100;
                thingToChangeValue = demoChart.series[0].options.borderRadius;
                break;

            case 'x axis':
                min = 0;
                max = 20;
                thingToChangeValue = 0;
                break;

            case 'y axis':
                min = 0;
                max = 100;
                thingToChangeValue = 0;
                break;

            case 'add/remove slices':
                min = 0;
                max = 10;
                thingToChangeValue = 6;
                break;

            case 'marker size':
                min = 0;
                max = 20;
                thingToChangeValue = 6;
                break;

            default:
            }
        }
        ///highlight the proper value box (under the slider)
        $('.val').each(function () {
            $(this).addClass('font-weight-lighter');
        });
        $('#val' + controlIndex).removeClass('font-weight-lighter');

        $('.val').each(function (index) {
            $('#val' + index).html(initialValues[seriesIndex][index]);
        });


        ///apply the min, max to the range, set the range value
        //show the proper min/max labels

        $('#control').attr('min', min);
        $('#control').attr('max', max);
        $('.min').html(min);
        $('.max').html(max);

        $('#control').val(thingToChangeValue);


    };


    ///the radio buttons
    $('input[name="controlType"]').change(function () {

        $('.form-check-label').each(function () {
            $(this).html('');
        });

        ///value of the clicked radio button
        //tells what option to manipulate
        //0,1,2,or 3
        controlIndex = $(this).val();
        initControls();

    });

    ///slider
    $('#control').change(function () {
        const value = $(this).val();
        let suffix = '';

        const data = [10, 20, 40, 5, 10, 15, 33, 41, 21, 13, 48];
        const tempData = data.slice(0, value);

        switch (thingToChange) {
        case 'start angle':
            demoChart.series[0].update({
                startAngle: value
            });
            suffix = '';
            break;

        case 'end angle':
            demoChart.series[0].update({
                endAngle: value
            });
            suffix = '';
            break;

        case 'inner size':
            demoChart.series[0].update({
                innerSize: value + '%'
            });
            suffix = '%';
            break;

        case 'size':
            demoChart.series[0].update({
                size: value + '%'
            });
            suffix = '%';
            break;

        case 'border radius':
            demoChart.series[0].update({
                borderRadius: value
            });
            suffix = '';
            break;

        case 'point width':
            demoChart.series[0].update({
                pointWidth: value
            });
            suffix = '';
            break;

        case 'line width':
            demoChart.series[0].update({
                lineWidth: value
            });
            suffix = '';
            break;

        case 'marker size':
            demoChart.series[0].update({
                marker: {
                    radius: value
                }
            });
            suffix = '';
            break;

        case 'x axis':
            demoChart.xAxis[0].setExtremes(0, value);
            suffix = '';
            break;

        case 'y axis':
            demoChart.yAxis[0].setExtremes(0, value);
            suffix = '';
            break;

        case 'add/remove slices':
            demoChart.series[0].update({
                data: tempData
            });

            suffix = '';
            break;

        default:
            suffix = '';

        }
        $('#val' + controlIndex).html($(this).val() + suffix);
    });


    ///series buttons
    $('.series-types button').click(function () {

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

        demoChart.xAxis[0].update({
            visible: false
        });
        demoChart.yAxis[0].update({
            visible: false
        });

        if (seriesType === 'item') {
            demoChart.series[0].update({
                data: [
                    10, 20, 40, 5, 10, 15
                ],
                marker: {
                    radius: 6
                },
                startAngle: -100,
                endAngle: 100,
                innerSize: '30%',
                center: ['50%', '64%'],
                size: '55%'
            });
        }
        if (seriesType === 'pie') {
            demoChart.series[0].update({
                data: [
                    10, 20, 40, 5, 10, 15
                ],
                startAngle: 100,
                endAngle: 100,
                innerSize: '30%',
                center: ['50%', '64%'],
                size: '55%'
            });
        }
        if (seriesType === 'line') {
            demoChart.series[0].update({
                data: [
                    10, 20, 40, 5, 10, 15
                ],
                lineWidth: 2,
                marker: {
                    radius: 6
                }
            });
            demoChart.xAxis[0].update({
                visible: true
            });
            demoChart.yAxis[0].update({
                visible: true
            });
        }
        if (seriesType === 'column') {
            demoChart.series[0].update({
                data: [
                    10, 20, 40, 5, 10, 15
                ],
                pointWidth: 30,
                borderRadius: 3
            });
            demoChart.xAxis[0].update({
                visible: true
            });
            demoChart.yAxis[0].update({
                visible: true
            });
        }

        ///first radio checked by default.
        $('#controlType1').trigger('click');
        initControls();


    });

});
