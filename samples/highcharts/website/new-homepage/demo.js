Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

let heroChart;

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const bubbleData = [
    { x: 0, y: 3, z: 200, className: 'transparent', dataLabels: { enabled: false } },
    { x: 0.5, y: 16, z: 120000, className: 'bubble-black', zIndex: 1  },
    { x: 0.5, y: 18, z: 12000, className: 'bubble-green' },
    { x: 0.5, y: 12.9, z: 80000, className: 'bubble-brown', zIndex: 1 },
    { x: 0.5, y: 14.2, z: 2000, className: 'bubble-gray', zIndex: 10 },
    { x: 0.5, y: 8.97, z: 28000, className: 'bubble-gray' },
    { x: 0.5, y: 7.65, z: 50, className: 'bubble-orange' },
    { x: 0.5, y: 5.32, z: 40000, className: 'bubble-dpurple' },
    { x: 0.5, y: 2.6, z: 3000, className: 'bubble-gray' },
    { x: 0.5, y: 3.7, z: 9000, className: 'bubble-purple' },

    { x: 1.6, y: 19, z: 100, className: 'bubble-orange' },
    { x: 1.6, y: 17, z: 24000, className: 'bubble-black' },
    { x: 1.6, y: 15.32, z: 3000, className: 'bubble-black' },
    { x: 1.6, y: 14.32, z: 2000, className: 'bubble-black' },
    { x: 1.6, y: 12.67, z: 22000, className: 'bubble-brown' },
    { x: 1.6, y: 11.32, z: 9000, className: 'bubble-purple' },
    { x: 1.6, y: 8.32, z: 9000, className: 'bubble-green' },
    { x: 1.6, y: 7.32, z: 3000, className: 'bubble-green' },

    { x: 2.6, y: 18.5, z: 10, className: 'bubble-orange' },
    { x: 2.6, y: 17, z: 2000, className: 'bubble-gray' },
    { x: 2.6, y: 13.5, z: 50, className: 'bubble-orange' },
    { x: 2.6, y: 10.75, z: 40000, className: 'bubble-green' },
    { x: 2.6, y: 7, z: 80000, className: 'bubble-purple' },
    { x: 2.6, y: 5.8, z: 2000, className: 'bubble-purple' },
    { x: 2.6, y: 4.5, z: 9000, className: 'bubble-purple' },
    { x: 2.6, y: 3, z: 9000, className: 'bubble-green' },

    { x: 3.84, y: 18, z: 9000, className: 'bubble-green' },
    { x: 3.84, y: 15.6, z: 6000, className: 'bubble-green' },
    { x: 3.84, y: 14.78, z: 40000, className: 'bubble-green' },
    { x: 3.84, y: 12.75, z: 80000, className: 'bubble-green' },
    { x: 3.84, y: 6.7, z: 130000, className: 'bubble-gray' },
    { x: 3.84, y: 8.9, z: 9000, className: 'bubble-orange' },
    { x: 3.84, y: 3.8, z: 9000, className: 'bubble-black' },
    { x: 3.84, y: 2.6, z: 3000, className: 'bubble-green' },

    { x: 4.75, y: 17, z: 2000, className: 'bubble-black' },
    { x: 4.75, y: 11.5, z: 12000, className: 'bubble-brown' },
    { x: 4.75, y: 10.38, z: 3000, className: 'bubble-black' },
    { x: 4.75, y: 8.7, z: 10000, className: 'bubble-purple' },
    { x: 4.75, y: 7.2, z: 22000, className: 'bubble-black' },
    { x: 4.75, y: 6, z: 9000, className: 'bubble-green' },
    { x: 4.75, y: 4.9, z: 200, className: 'bubble-orange' },
    { x: 4.75, y: 3.8, z: 2000, className: 'bubble-green' },

    { x: 5.64, y: 18.25, z: 10000, className: 'bubble-purple' },
    { x: 5.64, y: 16.2, z: 40000, className: 'bubble-green' },
    { x: 5.64, y: 14.3, z: 10000, className: 'bubble-green' },
    { x: 5.64, y: 13.45, z: 3000, className: 'bubble-gray' },
    { x: 5.64, y: 11.54, z: 80000, className: 'bubble-brown' },
    { x: 5.64, y: 9.3, z: 6000, className: 'bubble-gray' },
    { x: 5.64, y: 8.2, z: 24000, className: 'bubble-gray' },
    { x: 5.64, y: 5, z: 120000, className: 'bubble-black' },
    { x: 5.64, y: 7.25, z: 200, className: 'bubble-orange' },

    { x: 6.58, y: 17.9, z: 200, className: 'bubble-orange' },
    { x: 6.58, y: 15.9, z: 2000, className: 'bubble-gray' },
    { x: 6.58, y: 14.75, z: 5, className: 'bubble-orange' },
    { x: 6.58, y: 11.24, z: 22000, className: 'bubble-green' },
    { x: 6.58, y: 9.8, z: 10000, className: 'bubble-green' },
    { x: 6.58, y: 4.53, z: 12000, className: 'bubble-purple' },
    { x: 6.58, y: 3.2, z: 3000, className: 'bubble-purple' }

];

const bubble = {
    chart: {
        type: 'bubble',
        height: 430,
        styledMode: (true),
        margin: [0, 0, 0, 0],
        spacing: 0,
        animation: {
            duration: 1000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                $('.highcharts-bubble-series').css({ opacity: 0 });
                if (reduced) {
                    setTimeout(function () {
                        chart.series[0].update({
                            visible: false,
                            data: bubbleData
                        });
                        chart.series[0].update({ visible: true });
                        //$('.highcharts-title').css({opacity:0});
                        $('.highcharts-bubble-series').animate({ opacity: 1 }, 1000);
                        //show the plot lines
                        $('.highcharts-plot-line').animate({ opacity: 1 }, 1000);
                    }, 100);
                    setTimeout(function () {
                        ///moves all the bubbles down, fades them out
                        chart.yAxis[0].setExtremes(-2, 1000);
                        const bubbleClasses = ['green', 'brown', 'purple', 'dpurple', 'gray', 'orange', 'black'];
                        $('.highcharts-data-labels').animate({ opacity: 0 }, 1000);
                        $('.highcharts-plot-line').animate({ opacity: 0 }, 1000);
                        for (let ii = 0; ii < bubbleClasses.length; ++ii) {
                            $('.highcharts-point.bubble-' + bubbleClasses[ii]).css({
                                opacity: 0
                            });
                        }
                    }, 4500);

                } else {
                    chart.series[0].update({
                        visible: false,
                        data: [
                            //0-9
                            { x: 0, y: 18, z: 200, className: 'transparent', dataLabels: { enabled: false } },
                            { x: 0.5, y: 18, z: 120000, className: 'bubble-black', zIndex: 1  },
                            { x: 0.5, y: 18, z: 12000, className: 'bubble-green' },
                            { x: 0.5, y: 18, z: 80000, className: 'bubble-brown', zIndex: 1 },
                            { x: 0.5, y: 18, z: 2000, className: 'bubble-gray', zIndex: 10 },
                            { x: 0.5, y: 18, z: 28000, className: 'bubble-gray' },
                            { x: 0.5, y: 18, z: 50, className: 'bubble-orange' },
                            { x: 0.5, y: 18, z: 40000, className: 'bubble-dpurple' },
                            { x: 0.5, y: 18, z: 3000, className: 'bubble-gray' },
                            { x: 0.5, y: 18, z: 9000, className: 'bubble-purple' },
                            //10-17
                            { x: 1.6, y: 11.32, z: 100, className: 'bubble-orange' },
                            { x: 1.6, y: 11.32, z: 24000, className: 'bubble-black' },
                            { x: 1.6, y: 11.32, z: 3000, className: 'bubble-black' },
                            { x: 1.6, y: 11.32, z: 2000, className: 'bubble-black' },
                            { x: 1.6, y: 11.32, z: 22000, className: 'bubble-brown' },
                            { x: 1.6, y: 11.32, z: 9000, className: 'bubble-purple' },
                            { x: 1.6, y: 11.32, z: 9000, className: 'bubble-green' },
                            { x: 1.6, y: 11.32, z: 3000, className: 'bubble-green' },

                            //18-25
                            { x: 2.6, y: 3, z: 10, className: 'bubble-orange' },
                            { x: 2.6, y: 3, z: 2000, className: 'bubble-gray' },
                            { x: 2.6, y: 3, z: 50, className: 'bubble-orange' },
                            { x: 2.6, y: 3, z: 40000, className: 'bubble-green' },
                            { x: 2.6, y: 3, z: 80000, className: 'bubble-purple' },
                            { x: 2.6, y: 3, z: 2000, className: 'bubble-purple' },
                            { x: 2.6, y: 3, z: 9000, className: 'bubble-purple' },
                            { x: 2.6, y: 3, z: 9000, className: 'bubble-green' },

                            //26-33
                            { x: 3.84, y: 8.9, z: 9000, className: 'bubble-green' },
                            { x: 3.84, y: 8.9, z: 6000, className: 'bubble-green' },
                            { x: 3.84, y: 8.9, z: 40000, className: 'bubble-green' },
                            { x: 3.84, y: 8.9, z: 80000, className: 'bubble-green' },
                            { x: 3.84, y: 8.9, z: 130000, className: 'bubble-gray' },
                            { x: 3.84, y: 8.9, z: 9000, className: 'bubble-orange' },
                            { x: 3.84, y: 8.9, z: 9000, className: 'bubble-black' },
                            { x: 3.84, y: 8.9, z: 3000, className: 'bubble-green' },

                            //34-41
                            { x: 4.75, y: 17, z: 2000, className: 'bubble-black' },
                            { x: 4.75, y: 17, z: 12000, className: 'bubble-brown' },
                            { x: 4.75, y: 17, z: 3000, className: 'bubble-black' },
                            { x: 4.75, y: 17, z: 10000, className: 'bubble-purple' },
                            { x: 4.75, y: 17, z: 22000, className: 'bubble-black' },
                            { x: 4.75, y: 17, z: 9000, className: 'bubble-green' },
                            { x: 4.75, y: 17, z: 200, className: 'bubble-orange' },
                            { x: 4.75, y: 17, z: 2000, className: 'bubble-green' },

                            //42-50
                            { x: 5.64, y: 9.3, z: 10000, className: 'bubble-purple' },
                            { x: 5.64, y: 9.3, z: 40000, className: 'bubble-green' },
                            { x: 5.64, y: 9.3, z: 10000, className: 'bubble-green' },
                            { x: 5.64, y: 9.3, z: 3000, className: 'bubble-gray' },
                            { x: 5.64, y: 9.3, z: 80000, className: 'bubble-brown' },
                            { x: 5.64, y: 9.3, z: 6000, className: 'bubble-gray' },
                            { x: 5.64, y: 9.3, z: 24000, className: 'bubble-gray' },
                            { x: 5.64, y: 9.3, z: 120000, className: 'bubble-black' },
                            { x: 5.64, y: 9.3, z: 200, className: 'bubble-orange' },

                            //51-57
                            { x: 6.58, y: 3.2, z: 200, className: 'bubble-orange' },
                            { x: 6.58, y: 3.2, z: 2000, className: 'bubble-gray' },
                            { x: 6.58, y: 3.2, z: 5, className: 'bubble-orange' },
                            { x: 6.58, y: 3.2, z: 22000, className: 'bubble-green' },
                            { x: 6.58, y: 3.2, z: 10000, className: 'bubble-green' },
                            { x: 6.58, y: 3.2, z: 12000, className: 'bubble-purple' },
                            { x: 6.58, y: 3.2, z: 3000, className: 'bubble-purple' }

                        ]
                    });
                    setTimeout(function () {
                        chart.series[0].update({ visible: true });
                        //$('.highcharts-title').css({opacity:0});
                        $('.highcharts-bubble-series').animate({ opacity: 1 }, 1000);
                    }, 100);

                    setTimeout(function () {
                        //show the plot lines
                        $('.highcharts-plot-line').animate({ opacity: 1 }, 1000);
                        //the first bubble point in each column
                        let count1 = 0;
                        const count2 = 10;
                        let count3 = 18;
                        const count4 = 26;
                        let count5 = 34;
                        const count6 = 42;
                        let count7 = 51;
                        const count8 = 58;

                        //raises/lowers the bubbles in the ODD columns
                        const drop = setInterval(function () {
                            if (count1 < count2) {
                                chart.series[0].data[count1].update({
                                    y: bubbleData[count1].y
                                });
                                count1 = count1 + 1;
                            } else if (count3 < count4) {
                                chart.series[0].data[count3].update({
                                    y: bubbleData[count3].y
                                });
                                count3 = count3 + 1;
                            } else if (count5 < count6) {
                                chart.series[0].data[count5].update({
                                    y: bubbleData[count5].y
                                });
                                count5 = count5 + 1;
                            } else if (count7 < count8) {
                                chart.series[0].data[count7].update({
                                    y: bubbleData[count7].y
                                });
                                count7 = count7 + 1;
                            } else {
                                clearInterval(drop);
                            }
                        }, 50);
                    }, 500);

                    setTimeout(function () {
                        let count2 = 10;
                        const count3 = 18;
                        let count4 = 26;
                        const count5 = 34;
                        let count6 = 42;
                        const count7 = 51;

                        //raises/lowers the bubbles in the EVEN columns
                        const drop = setInterval(function () {
                            if (count2 < count3) {
                                chart.series[0].data[count2].update({
                                    y: bubbleData[count2].y
                                });
                                count2 = count2 + 1;
                            } else if (count4 < count5) {
                                chart.series[0].data[count4].update({
                                    y: bubbleData[count4].y
                                });
                                count4 = count4 + 1;
                            } else if (count6 < count7) {
                                chart.series[0].data[count6].update({
                                    y: bubbleData[count6].y
                                });
                                count6 = count6 + 1;
                            } else {
                                clearInterval(drop);
                            }
                        }, 50);
                    }, 1500);

                    setTimeout(function () {
                        ///moves all the bubbles down, fades them out
                        chart.yAxis[0].setExtremes(-2, 1000);
                        const bubbleClasses = ['green', 'brown', 'purple', 'dpurple', 'gray', 'orange', 'black'];
                        $('.highcharts-data-labels').animate({ opacity: 0 }, 1000);
                        $('.highcharts-plot-line').animate({ opacity: 0 }, 1000);
                        for (let ii = 0; ii < bubbleClasses.length; ++ii) {
                            $('.highcharts-point.bubble-' + bubbleClasses[ii]).css({
                                opacity: 0
                            });
                        }
                        $('highcharts-bubble-series').animate({ opacity: 0 }, 1000);
                    }, 4500);

                }
            }
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    tooltip: {
        animation: {
            duration: 1000
        }
    },
    title: {
        text: '',
        y: 100
    },
    xAxis: [
        {
            offset: 0,
            tickInterval: 1,
            labels: {
                style: {
                    color: '#fff'
                }
            },
            plotLines: [
                {
                    value: 0.5
                },
                {
                    value: 1.6
                },
                {
                    value: 2.6
                },
                {
                    value: 3.84
                },
                {
                    value: 4.75
                },
                {
                    value: 5.64
                },
                {
                    value: 6.58
                }
            ]
        }],

    yAxis: [{
        tickInterval: 1,
        visible: false,
        offest: 0,
        min: -2,
        max: 24,
        labels: {
            style: {
                color: '#fff'
            }
        }
    }],
    legend: {
        enabled: false,
        itemMarginTop: 10,
        bubbleLegend: {
            enabled: true,
            borderWidth: 1,
            maxSize: 60,
            minSize: 10,
            connectorDistance: 40,
            ranges: [
                { value: 1 },
                { value: 50 },
                { value: 100 },
                { value: 177 }
            ]
        }
    },
    plotOptions: {
        series: {
            animation: false,
            dragDrop: {
                draggableX: true,
                draggableY: true,
                dragMaxX: 7,
                dragMinX: 0,
                dragMaxY: 21,
                dragMinY: 0
            }
        }
    },
    series: [{
        maxSize: 160,
        name: 'Highcharts Bubble Chart',
        minSize: 20,
        allowOverlap: true,
        dataLabels: {
            enabled: true
        },
        data: []
    }]
};

const sankeyData = [
    ['  ', '29,265', 90],
    ['94,236', '29,265', 80],
    ['86,811', '29,265', 70],
    ['72,638', '29,265', 60],
    ['70,770', '29,265', 50],
    [' ', '29,265', 0],
    ['30,903', '29,265', 30],
    ['26,253', '29,265', 20],
    ['', '29,265', 0],

    ['', '21,546', 0],
    ['94,236', '21,546', 40],
    ['86,811', '21,546', 10],
    ['72,638', '21,546', 40],
    ['70,770', '21,546', 10],
    [' ', '21,546', 0],
    ['30,903', '21,546', 10],
    ['26,253', '21,546', 40],
    [' ', '21,546', 20],

    ['', '15,447', 10],
    ['94,236', '15,447', 10],
    ['86,811', '15,447', 10],
    ['72,638', '15,447', 0],
    ['70,770', '15,447', 10],
    [' ', '15,447', 5],
    ['30,903', '15,447', 0],
    ['26,253', '15,447', 10],
    ['', '15,447', 10],

    ['', '8,123', 0],
    ['94,236', '8,123', 0],
    ['86,811', '8,123', 10],
    ['72,638', '8,123', 40],
    ['70,770', '8,123', 10],
    [' ', '8,123', 0],
    ['30,903', '8,123', 50],
    ['26,253', '8,123', 10],
    ['', '8,123', 0],


    ['', '3,959', 0],
    ['94,236', '3,959', 10],
    ['86,811', '3,959', 0],
    ['72,638', '3,959', 0],
    ['70,770', '3,959', 10],
    ['', '3,959', 0],
    ['30,903', '3,959', 40],
    ['26,253', '3,959', 10],
    ['', '3,959', 20]
];
const sankey = {
    chart: {
        styledMode: (true),
        height: 430,
        marginRight: 0,
        animation: {
            duration: 1000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                $('.highcharts-title').css({ opacity: 0 });
                $('.highcharts-data-labels').css({ opacity: 0 });
                $('.highcharts-data-labels').animate({ opacity: 1 }, 400);
                chart.series[0].update({
                    data: []
                });
                const p1 = function () {
                    let count = 0;
                    //adds nodes to the sankey
                    const sankey = setInterval(function () {
                        if (count < sankeyData.length) {
                            chart.series[0].addPoint({
                                from: sankeyData[count][0],
                                to: sankeyData[count][1],
                                weight: sankeyData[count][2]
                            });
                            count = count + 1;
                        } else {
                            clearInterval(sankey);
                            //$('.highcharts-title').animate({opacity:1},500);

                            chart.series[0].update({
                                curveFactor: 0.33
                            });
                        }
                    }, 10);
                };
                setTimeout(p1, 0);

                const p2 = function () {
                    //makes the node connections very thin
                    //makes the nodes super curvy
                    $('.highcharts-data-labels').animate({ opacity: 0 }, 1000);
                    chart.series[0].update({
                        nodePadding: 130
                    });
                    chart.series[0].update({
                        curveFactor: 2
                    });
                };
                ///if it's not reduced motion, execute p2
                if (!reduced) {
                    setTimeout(p2, 3500);
                }
                const p22 = function () {
                    //$('.highcharts-title').animate({opacity:0},500);

                    $('.highcharts-sankey-series').css({
                        transformOrigin: 'bottom',
                        opacity: 0,
                        transition: 'all 1500ms'
                    });
                };
                setTimeout(p22, 4500);

            }
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        verticalAlign: 'middle',
        floating: true
    },
    xAxis: [
        {
            min: 0,
            max: 10,
            visible: false
        }
    ],
    yAxis: [
        {
            min: 0,
            max: 10,
            visible: false
        }
    ],
    plotOptions: {
        area: {
            marker: {
                enabled: false
            }
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        centerInCategory: true,
        linkOpacity: 1,
        data: [],
        curveFactor: 1,
        nodes: [{
            id: '',
            colorIndex: 0
        }, {
            id: '94,236',
            colorIndex: 1
        }, {
            id: '86,811',
            colorIndex: 2
        }, {
            id: '72,638',
            colorIndex: 3
        }, {
            id: '70,770',
            colorIndex: 4
        }, {
            id: ''
        },
        {
            id: '30,903'
        },
        {
            id: '26,253'
        },
        {
            id: ''
        }],
        type: 'sankey',
        name: 'Highcharts Sankey Diagram'
    },
    {
        type: 'area',
        className: 'cover',
        data: [
            {
                x: -1,
                y: 10
            },
            {
                x: 2.5,
                y: 10
            }
        ]
    },
    {
        type: 'area',
        className: 'cover',
        data: [
            {
                x: 7.5,
                y: 10
            },
            {
                x: 11,
                y: 10
            }
        ]

    }]

};

const bubble2 = {
    chart: {
        type: 'bubble',
        height: 430,
        styledMode: (true),
        margin: [0, 0, 0, 0],
        spacing: 0,
        animation: {
            duration: 2000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                $('.bubble2-purple').css({ transform: 'none' });
                $('.highcharts-title').css({ opacity: 0 });
                $('.highcharts-data-labels').css({ opacity: 0 });

                if (reduced) {
                    setTimeout(function () {
                        chart.xAxis[0].setExtremes(0, 10);
                        $('.highcharts-data-labels').animate({ opacity: 1 }, 1000);
                    }, 200);
                    setTimeout(function () {
                        $('.highcharts-bubble-series').animate({ opacity: 0 }, 1000);
                    }, 5000);
                } else {
                    setTimeout(function () {
                        chart.xAxis[0].setExtremes(-1000, 10);
                    }, 1000);
                    setTimeout(function () {
                        chart.xAxis[0].setExtremes(0, 10);
                        $('.highcharts-data-labels').animate({ opacity: 1 }, 1000);
                    }, 2600);
                    setTimeout(function () {
                        $('.highcharts-bubble-series').animate({ opacity: 0 }, 1000);
                        chart.yAxis[0].setExtremes(-2000, 2000);
                    }, 5000);
                }
            }
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
        y: 160
    },
    xAxis: [
        {
            offset: -40,
            min: -1000,
            max: 1000,
            visible: false,
            tickInterval: 1,
            labels: {
                style: {
                    color: '#fff'
                }
            }

        }],
    yAxis: [{
        tickInterval: 1,
        max: 24,
        min: -2,
        plotLines: [{
            value: 21
        }, {
            value: 17.6
        },
        {
            value: 15.4
        },
        {
            value: 12.5
        },
        {
            value: 10.3
        },
        {
            value: 7.2
        },
        {
            value: 5.2
        },
        {
            value: 2
        }],
        offset: 0
    }],
    plotOptions: {
        series: {
            name: 'Highcharts Bubble Chart'
        }
    },
    legend: {
        enabled: false
    },
    series: [
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            data: [
                { x: 0, y: 16.85, z: 20, className: 'transparent' },
                { x: 1.14, y: 19.125, z: 3, className: 'bubble2-gray', zIndex: 1  },
                { x: 1.57, y: 13.95, z: 5, className: 'bubble2-yellow', zIndex: 1  },
                { x: 2.46, y: 19.21, z: 10, className: 'bubble2-green', zIndex: 1  },
                { x: 2.76, y: 8.74, z: 12, className: 'bubble2-purple', zIndex: 1  },
                { x: 2.82, y: 3.57, z: 8, className: 'bubble2-green', zIndex: 1  },
                { x: 6.5, y: 3.43, z: 12, className: 'bubble2-orange', zIndex: 1  },
                { x: 8.63, y: 0.94, z: 3, className: 'bubble2-white', zIndex: 1  },
                { x: 9, y: 0.94, z: 3, className: 'bubble2-white', zIndex: 1  },
                { x: 10, y: 16.35, z: 20, className: 'transparent' }
            ],
            visible: true,
            zIndex: 100
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 1,
                    y: 19.125,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -40
                    }
                },
                { x: 1.21, y: 19.125, z: 3 },
                { x: 1.27, y: 19.125, z: 3 },
                { x: 1.7, y: 19.125, z: 3 },
                { x: 1.75, y: 19.125, z: 3 },
                { x: 1.78, y: 19.125, z: 3 },
                { x: 1.83, y: 19.125, z: 3 },
                { x: 2.35, y: 19.125, z: 3 },
                { x: 3.3, y: 19.125, z: 3 },
                { x: 3.46, y: 19.125, z: 3 },
                { x: 4.13, y: 19.125, z: 3 },
                { x: 4.4, y: 19.125, z: 3 },
                {
                    x: 4.97,
                    y: 19.125,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },

                { x: 10, y: 20, z: 30, className: 'transparent' }

            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 1.66,
                    y: 16.52,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 2.2, y: 16.52, z: 3 },
                { x: 2.38, y: 16.52, z: 3 },
                { x: 2.47, y: 16.52, z: 3 },
                { x: 2.59, y: 16.52, z: 3 },
                {
                    x: 2.86,
                    y: 16.52,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 0.95,
                    y: 13.9,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 1.47, y: 13.9, z: 3 },
                { x: 1.6, y: 13.9, z: 3 },
                { x: 1.7, y: 13.9, z: 3 },
                { x: 1.9, y: 13.9, z: 3 },
                { x: 2.33, y: 13.9, z: 3 },
                { x: 2.41, y: 13.9, z: 3 },
                {
                    x: 2.49,
                    y: 13.9,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 1.75,
                    y: 11.34,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 1.82, y: 11.34, z: 3 },
                { x: 1.89, y: 11.34, z: 3 },
                { x: 2, y: 11.34, z: 3 },
                { x: 2.2, y: 11.34, z: 3 },
                { x: 2.53, y: 11.34, z: 3 },
                { x: 2.7, y: 11.34, z: 3 },
                {
                    x: 3.57,
                    y: 11.34,
                    z: 3,

                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 2.58,
                    y: 8.74,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 3.3, y: 8.74, z: 3 },
                {
                    x: 3.57,
                    y: 8.74,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 3,
                    y: 6.14,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 3.16, y: 6.14, z: 3 },
                { x: 3.37, y: 6.14, z: 3 },
                { x: 3.7, y: 6.14, z: 3 },
                { x: 3.84, y: 6.14, z: 3 },
                { x: 4.16, y: 6.14, z: 3 },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-gray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 2.42,
                    y: 3.5,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 2.71, y: 3.5, z: 3 },
                { x: 3.31, y: 3.5, z: 3 },
                { x: 3.43, y: 3.5, z: 3 },
                { x: 3.57, y: 3.5, z: 3 },
                { x: 3.69, y: 3.5, z: 3 },
                { x: 3.85, y: 3.5, z: 3 },
                { x: 4.13, y: 3.5, z: 3 },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-dgray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                { x: 4.3, y: 6.14, z: 3 },
                { x: 4.4, y: 6.14, z: 3 },
                { x: 4.5, y: 6.14, z: 3 },
                { x: 4.95, y: 6.14, z: 3 },
                {
                    x: 5.9,
                    y: 6.14,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-dgray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                { x: 4.3, y: 3.5, z: 3 },
                { x: 4.63, y: 3.5, z: 3 },
                { x: 5.28, y: 3.5, z: 3 },
                { x: 5.47, y: 3.5, z: 3 },
                { x: 6.01, y: 3.5, z: 3 },
                { x: 6.36, y: 3.5, z: 8 },
                { x: 7, y: 3.5, z: 3 },
                { x: 7.32, y: 3.5, z: 3 },
                { x: 7.44, y: 3.5, z: 3 },
                {
                    x: 8.09,
                    y: 3.5,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        },
        {
            maxSize: 80,
            minSize: 30,
            allowOverlap: true,
            dataLabels: {
                enabled: false
            },
            className: 'bubble2-dgray',
            data: [
                { x: 0, y: 0, z: 30, className: 'transparent' },
                {
                    x: 5.9,
                    y: 0.94,
                    z: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: -60
                    }
                },
                { x: 6.53, y: 0.94, z: 3 },
                { x: 7.22, y: 0.94, z: 3 },
                { x: 7.34, y: 0.94, z: 3 },
                { x: 7.47, y: 0.94, z: 3 },
                { x: 7.84, y: 0.94, z: 3 },
                { x: 8.03, y: 0.94, z: 3 },
                { x: 8.53, y: 0.94, z: 3 },
                { x: 8.56, y: 0.94, z: 3 },
                { x: 8.58, y: 0.94, z: 3 },
                {
                    x: 8.85,
                    y: 0.94,
                    z: 12,
                    className: 'bubble2-blue',
                    dataLabels: {
                        enabled: true,
                        format: '{point.x}',
                        x: 60
                    }
                },
                { x: 10, y: 20, z: 30, className: 'transparent' }
            ]
        }
    ]
};

const candlestick = function () {
    Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {
    // create the chart
        heroChart = Highcharts.stockChart('hero', {
            chart: {
                styledMode: (true),
                margin: [0, 0, 0, 0],
                height: 430,
                animation: {
                    enabled: true,
                    duration: 1000,
                    easing: 'easeOutQuint'
                },
                events: {
                    load: function () {
                        const chart = this;
                        $('.highcharts-title').css({ opacity: 0 });
                        $('.highcharts-candlestick-series.candlestick').css({ opacity: 0 });
                        $('.highcharts-yaxis-labels').css({ opacity: 0 });

                        ///pre-rotate it for reduced motion so the spin isn't visible
                        if (reduced) {
                            $(' .highcharts-candlestick-series.candlestick').css({ transform: 'rotate(0deg)' });
                            $('.highcharts-yaxis-labels').css({ opacity: 0 });
                        }
                        const p1 = function () {
                            if (!reduced) {
                                $('.highcharts-candlestick-series.candlestick').animate({ opacity: 1 }, 800);
                                $(' .highcharts-candlestick-series .highcharts-point-up').css({ fillOpacity: 1 });
                                $(' .highcharts-candlestick-series .highcharts-point-down').css({ fillOpacity: 1 });
                            }
                        };
                        setTimeout(p1, 10);

                        const p2 = function () {
                            chart.xAxis[0].update({ visible: true });
                            chart.rangeSelector.clickButton(1);
                            $('.highcharts-yaxis-labels').css({ opacity: 0 });
                            if (!reduced) {
                                $('.highcharts-candlestick-series.candlestick').animate({ opacity: 1 }, 800);
                                $(' .highcharts-candlestick-series .highcharts-point-up').css({ fillOpacity: 1 });
                                $(' .highcharts-candlestick-series .highcharts-point-down').css({ fillOpacity: 1 });
                                $(' .highcharts-candlestick-series.candlestick').css({ transform: 'rotate(0deg)' });
                            }
                            //$('.highcharts-title').animate({opacity:1},1000);
                            $('.highcharts-range-selector-buttons').animate({ opacity: 1 }, 1000);
                        };
                        setTimeout(p2, 500);

                        const p21 = function () {
                            $('.highcharts-yaxis-labels').animate({ opacity: 1 }, 800);
                            if (reduced) {
                                $('.highcharts-candlestick-series.candlestick').animate({ opacity: 1 }, 800);

                                $(' .highcharts-candlestick-series .highcharts-point-up').css({ fillOpacity: 1 });
                                $(' .highcharts-candlestick-series .highcharts-point-down').css({ fillOpacity: 1 });
                            }
                        };
                        setTimeout(p21, 1000);

                        const p3 = function () {
                            chart.rangeSelector.clickButton(2);
                        };
                        setTimeout(p3, 2300);

                        const p4 = function () {
                            $('.highcharts-range-selector-buttons').animate({ opacity: 0 }, 1000);
                            $('.highcharts-title').animate({ opacity: 0 }, 1000);
                            $('.highcharts-candlestick-series.candlestick').animate({ opacity: 0 }, 1000);
                            $('.highcharts-axis-labels').animate({ opacity: 0 }, 800);
                            chart.yAxis[0].update({ visible: false });
                            chart.xAxis[0].update({ visible: false });
                        };
                        setTimeout(p4, 5500);
                    }
                }
            },
            title: {
                text: '',
                y: 110

            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                enabled: true,
                selected: 1,
                inputEnabled: false,
                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '1w',
                    title: 'View 1 week'
                },
                {
                    type: 'week',
                    count: 4,
                    text: '1m',
                    title: 'View 1 month'
                }, {
                    type: 'month',
                    count: 2,
                    text: '2m',
                    title: 'View 2 months'
                },
                {
                    type: 'month',
                    count: 3,
                    text: '3m',
                    title: 'View 3 months'
                },

                {
                    type: 'month',
                    count: 4,
                    text: '4m',
                    title: 'View 4 months'
                }],
                floating: true,
                verticalAlign: 'middle',
                y: -130,
                buttonPosition: {
                    align: 'center'
                }
            },
            xAxis: [{
                visible: false,
                offset: -30,
                events: {
                    afterSetExtremes: function () {
                        $('.highcharts-candlestick-series.candlestick').addClass('h');
                        $(' .highcharts-candlestick-series .highcharts-point-up').css({ fillOpacity: 1 });
                        $(' .highcharts-candlestick-series .highcharts-point-down').css({ fillOpacity: 1 });
                    }
                }
            }],
            yAxis: [{
                visible: true
            }],
            series: [{
                name: 'AAPL',
                animation: {
                    enabled: true
                },
                type: 'candlestick',
                className: 'candlestick',
                dataGrouping: {
                    units: [
                        [
                            'week',
                            [1, 2, 3, 4, 6, 52]
                        ],
                        [
                            'month',
                            [12]
                        ]
                    ]
                },
                data: data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });
};

//bubble, sankey, candlestick, bubble2, clear intervals
const loops = [0, 5500, 10500, 18000, 23010];

///bubble chart
const createBubble = function () {
    console.log(heroChart);
    if (heroChart) {
        heroChart.destroy();
    }
    heroChart = Highcharts.chart('hero', bubble);
};

///sankey chart
const createSankey = function () {
    heroChart.destroy();
    heroChart = Highcharts.chart('hero', sankey); //5500
};

///candlestick
const createStick = function () {
    heroChart.destroy();
    candlestick();
};

///bubble2
const createBubble2 = function () {
    heroChart.destroy();
    heroChart = Highcharts.chart('hero', bubble2); //5000
};

const loopCharts = function () {
    setTimeout(createBubble, loops[0]);
    setTimeout(createSankey, loops[1]);
    setTimeout(createStick, loops[2]);
    setTimeout(createBubble2, loops[3]);
};

///initial run
loopCharts();

//loop
window.setInterval(loopCharts, 25000);