Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const months = ['jan', 'feb', 'mar', 'apr', 'may',
    'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const names = ['January', 'February', 'March',
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

const fjordTemps = [6, 5, 5, 6, 9, 12, 14, 15, 13, 11, 9, 7];

let index = 0;
let sunmove = false;

const fjordsFinal =  function () {
    Highcharts.chart('fjords',
        {
            chart: {
                type: 'area',
                animation: {
                    enabled: true,
                    duration: 2000,
                    easing: 'easeOutQuint'
                },
                styledMode: (true),
                margin: 0,
                spacing: 0,
                events: {
                    load: function () {
                        const chart = this;
                        const fjordDepth = document.querySelector('.depth');
                        const sun = document.querySelector('.sun');
                        const temps = document.querySelector('.temps');

                        chart.yAxis[0].setExtremes(-2, 12.2);
                        chart.series[0].update({
                            zIndex: 10,
                            data: [
                                { x: 0, low: -2, high: 4 },
                                { x: 40, low: -2, high: 4 }]
                        });

                        ///raises the fjord
                        chart.yAxis[1].setExtremes(-2, 18);

                        ///move the sun
                        sun.style.transition = 'none';
                        sun.classList.add('finalmove');
                        temps.classList.add('jan');
                        sunmove = true;
                        document.querySelector('.highcharts-zone-graph-0').style.fill = 'transparent';

                        fjordDepth.style.fill = '#2b908f';

                        setTimeout(function () {
                            ///shows the final fjord
                            fjordDepth.style.opacity = 0.7;
                        }, 500);

                        setTimeout(function () {
                            ///shows the fjord water
                            [].forEach.call(
                                document.querySelectorAll('.temps'),
                                function (b) {
                                    b.style.opacity = 1;
                                }
                            );
                            ///make the sun and fjord water the right temperature
                            sun.style.transition = 'all 1s';
                            sun.classList.add('jan');
                            temps.classList.add('jan');

                            sunmove = true;

                            //show the title
                            document.getElementById('title').classList.add('show');

                            ///show the temperature label with the correct month class
                            document.getElementById('temp-data').classList.add('show');
                            document.getElementById('temp-data').classList.add('jan');

                        }, 1000);


                    },
                    redraw: function () {
                        const sun = document.querySelector('.sun');
                        const temps = document.querySelector('.temps');
                        if (sunmove) {
                            sun.style.transition = 'all 1s';
                            sun.classList.add('finalmove');
                            sun.classList.add(months[index]);
                            temps.classList.add(months[index]);
                        }


                    }
                }
            },
            title: {
                useHTML: true,
                verticalAlign: 'middle',
                align: 'center',
                text: ``
            },
            subtitle: {
                align: 'middle',
                verticalAlign: 'bottom',
                useHTML: true,
                text: `<div id="temp-data" class="hide">
                <span style="color:#000;">6°C</span>
                <span style="color:#000;">5°C</span>
                <span style="color:#000;">5°C</span>
                <span style="color:#000;">6°C</span>
                <span style="color:#000;">9°C</span>
                <span style="color:#fff;">12°C</span>
                <span style="color:#fff;">14°C</span>
                <span style="color:#fff;">15°C</span>
                <span style="color:#fff;">13°C</span>
                <span style="color:#000;">11°C</span>
                <span style="color:#000;">9°C</span>
                <span style="color:#000;">7°C</span>
                </div>`
            },
            accessibility: {
                description: 'Average Sea water temperature in Sognefjorden, January to December',
                screenReaderSection: {
                    beforeChartFormatter: function () {
                        return `
                            <p>Average Sea water temperature in 
                            Sognefjorden, January to December</p>
                            <div>Infographic of two mountains with a fjord
                            between them. Use the drop down menu to select a 
                            month to view the average fjord temperature for
                            that month. Temperatures are in Celcius.</p>
                        `;
                    }
                }
            },
            xAxis: [{
                min: 0,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            },
            {
                min: 20,
                max: 40,
                gridLineColor: 'transparent',
                tickInterval: 1
            }],
            yAxis: [{
                min: -2,
                max: 12.1,
                gridZIndex: 20,
                gridLineColor: 'transparent',
                tickInterval: 1,
                startOnTick: false,
                endOnTick: false
            },
            {
                min: -2,
                max: 18,
                className: 'fjord-y-axis',
                gridLineColor: 'transparent',
                tickInterval: 1,
                startOnTick: false,
                endOnTick: false,
                visible: false,
                opposite: true,
                zIndex: 30,
                offset: -400
            }],
            legend: {
                enabled: false,
                floating: true,
                layout: 'vertical',
                align: 'right'
            },
            tooltip: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    opacity: 1,
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            enabled: false
                        },
                        inactive: {
                            enabled: false
                        }
                    }
                },
                pie: {
                    animation: false,
                    opacity: 0
                },
                line: {
                    animation: false,
                    opacity: 1,
                    enableMouseTracking: false
                },
                area: {
                    animation: false,
                    fillOpacity: 0
                }
            },
            series: [
                // 0 area - foreground-water - 5
                {
                    name: 'water',
                    type: 'arearange',
                    className: 'cover',
                    animation: false,
                    data: [{ x: 0, low: -2, high: 1 },
                        { x: 40, low: -2, high: 1 }],
                    zIndex: 9,
                    visible: true,
                    enableMouseTracking: false


                },
                //1 areaspline - 6
                {
                    type: 'area',
                    name: 'Sognefjorden',
                    animation: false,
                    className: 'depth',
                    lineWidth: 3,
                    yAxis: 1,
                    xAxis: 1,
                    zoneAxis: 'y',
                    zones: [{
                        value: 0

                    }],
                    marker: {
                        enabled: false
                    },
                    data: [
                        { x: 20.5, y: -2 },
                        {
                            x: 20.6,
                            y: 16
                        },
                        { x: 23, y: 10.9 },
                        {
                            x: 23.92,
                            y: 9.92
                        },
                        { x: 25.58, y: 7.31 },
                        { x: 26.88, y: 3.6 },
                        { x: 28.4, y: 0.6 },
                        { x: 29.92, y: -1.64 },

                        { x: 30.8, y: -1.6 },
                        { x: 32.2, y: 1.16 },
                        { x: 33.62, y: 2.84 },
                        { x: 34, y: 5.1 },
                        { x: 35, y: 7.5 },
                        {
                            x: 36,
                            y: 9.8
                        },
                        { x: 37, y: 11 },
                        {
                            x: 39.7,
                            y: 15
                        },
                        { x: 39.7, y: -2 }

                    ],
                    zIndex: 18,
                    visible: true

                },
                ///2 arearange temperatures
                {
                    type: 'arearange',
                    zIndex: 30,
                    yAxis: 1,
                    className: 'temps',
                    dataLabels: {
                        enabled: false,
                        allowOverlap: true

                    },
                    enableMouseTracking: false,
                    data: [
                        { x: 4.4, low: 6.36, high: 6.47 },
                        { x: 5.2, low: 4.18, high: 6.47 },
                        { x: 6.2, low: 2.56,  high: 6.47 },
                        {
                            x: 8,
                            low: -2,
                            high: 6.47,
                            accessibility: {
                                enabled: true
                            },
                            dataLabels: {
                                enabled: false,
                                useHTML: true,
                                formatter: function () {
                                    return `
                                    <div id="temp-data" class="hide">
                                    <span style="color:#000;">6°C</span>
                                    <span style="color:#000;">5°C</span>
                                    <span style="color:#000;">5°C</span>
                                    <span style="color:#000;">6°C</span>
                                    <span style="color:#000;">9°C</span>
                                    <span style="color:#fff;">12°C</span>
                                    <span style="color:#fff;">14°C</span>
                                    <span style="color:#fff;">15°C</span>
                                    <span style="color:#fff;">13°C</span>
                                    <span style="color:#fff;">11°C</span>
                                    <span style="color:#000;">9°C</span>
                                    <span style="color:#000;">7°C</span>
                                    </div>
                                    `;
                                }
                            }

                        },
                        { x: 13.2, low: -2, high: 6.47 },
                        { x: 13.8, low: -0.2, high: 6.47 },
                        { x: 15.2, low: 3.5, high: 6.47 },

                        { x: 16, low: 6.42,  high: 6.47 }
                    ]
                },
                ///5 - sun/pie - none
                {
                    name: 'sun',
                    type: 'pie',
                    className: 'sun',
                    borderColor: 'white',
                    borderWidth: 0,
                    center: ['50%', '64%'],
                    data: [{
                        y: 100,

                        fillColor: '#8087E8',
                        color: '#8087E8'
                    }
                    ],
                    size: '40%',
                    visible: true
                }
            ]
        }
    );

    const monthContainer = document.querySelector('.month-container');
    const dropDown = document.getElementById('dropdownMenuButton');
    const button = document.querySelector('.btn-secondary');
    const sun = document.querySelector('.sun');
    const temps = document.querySelector('.temps');
    const tempData = document.getElementById('temp-data');

    const monthInfo = document.getElementById('month');
    const avgTemp = document.getElementById('avgTemp');


    document.getElementById('dropdownMenuButton').addEventListener('click', function () {
        console.log('click');
        monthContainer.classList.remove('d-none');
        monthContainer.focus();
    });

    [].forEach.call(
        document.querySelectorAll('.month'),
        function (element) {
            element.onclick = function (e) {
                e.preventDefault();
                const id = this.id;
                button.classList.remove(months[index]);
                sun.classList.remove(months[index]);
                tempData.classList.remove(months[index]);

                [].forEach.call(
                    document.querySelectorAll('.temps'),
                    function (b) {
                        b.classList.remove(months[index]);
                    }
                );

                index = months.findIndex(element => element === id);

                [].forEach.call(
                    document.querySelectorAll('.month'),
                    function (b, i) {
                        b.classList.remove('active');
                        if (b.id === id) {
                            button.classList.add(months[i]);
                            sun.classList.add(months[i]);
                            tempData.classList.add(months[i]);
                            temps.classList.add(months[i]);
                            dropDown.innerHTML = names[i];
                            monthInfo.innerHTML = names[i];
                            avgTemp.innerHTML = fjordTemps[i] + ' degrees celcius';
                            monthContainer.classList.add('d-none');

                        }
                    }
                );
            };
        }
    );
};

const fjordsAbout =  function () {
    Highcharts.chart('fjords',
        {
            chart: {
                type: 'area',
                animation: {
                    enabled: true,
                    duration: 2000,
                    easing: 'easeOutQuint'
                },
                styledMode: (true),
                margin: 0,
                spacing: 0,
                events: {
                    load: function () {
                        const chart = this;
                        let sunCount = 80;
                        const fjordDepth = document.querySelector('.depth');
                        const sun = document.querySelector('.sun');
                        const cover = document.querySelector('.cover');
                        const temps = document.querySelector('.temps');

                        let delay = 0;
                        if (!reduced) {
                            delay = 2000;
                        }

                        ///fjord moving functions
                        //front left fjord

                        const fjord1 = function () {
                            chart.series[10].data[0].update({
                                y: 6
                            });
                        };
                        //front right fjord
                        const fjord2 = function () {
                            chart.series[9].data[1].update({
                                y: 8
                            });
                        };
                        //middle left fjord
                        const fjord3 = function () {
                            chart.series[8].data[0].update({
                                y: 11
                            });
                            chart.series[8].data[1].update({
                                y: 5
                            });
                        };
                        //back left fjord
                        const fjord4 = function () {
                            chart.series[6].data[0].update({
                                x: 0, y: 17
                            });
                            chart.series[6].data[1].update({
                                x: 4, y: 13
                            });
                            chart.series[6].data[2].update({
                                x: 7, y: 7
                            });
                            chart.series[6].data[3].update({
                                x: 10, y: 4
                            });
                        };
                        //back right fjord
                        const fjord5 = function () {
                            chart.series[7].data[1].update({
                                x: 14, y: 6
                            });
                            chart.series[7].data[2].update({
                                x: 17, y: 12
                            });
                            chart.series[7].data[3].update({
                                x: 20, y: 16
                            });
                        };

                        if (reduced) {
                            chart.update({
                                chart: {
                                    animation: {
                                        duration: 0
                                    }
                                }
                            });
                            fjord1();
                            fjord2();
                            fjord3();
                            fjord4();
                            fjord5();
                            chart.series[5].update({
                                center: ['50%', '60%']
                            });

                        } else {
                            ///rising sun
                            setTimeout(function () {
                                const rise = setInterval(function () {
                                    sunCount = sunCount - 1;
                                    if (sunCount > 64) {
                                        chart.series[5].update({
                                            center: ['50%', sunCount + '%']
                                        });
                                    } else {
                                        clearInterval(rise);
                                    }
                                }, 200);
                            }, 300);

                            //shimmer on the water with the lines
                            setTimeout(function () {
                                [].forEach.call(
                                    document.querySelectorAll('.transparent'),
                                    function (b) {
                                        b.style.opacity = 0;
                                    }
                                );
                                [].forEach.call(
                                    document.querySelectorAll('.thick'),
                                    function (b) {
                                        b.style.transform = 'translate(0px, -1px)';
                                    }
                                );
                                [].forEach.call(
                                    document.querySelectorAll('.thin'),
                                    function (b) {
                                        b.style.opacity = '0.5';
                                        b.style.translate = 'translate(0px, 1px)';
                                    }
                                );
                            }, 600);

                            //grow fjords
                            setTimeout(function () {
                                fjord1();
                                fjord2();
                            }, 800);
                            setTimeout(function () {
                                fjord3();
                            }, 1500);
                            setTimeout(function () {
                                fjord5();
                            }, 2000);
                            setTimeout(function () {
                                fjord4();
                                chart.series[14].update({
                                    data: [{ x: 0, y: 3 }, { x: 20, y: 3 }]
                                });
                            }, 2200);
                        }
                        setTimeout(function () {
                            ///lowers the water
                            if (!reduced) {
                                chart.yAxis[0].setExtremes(-2, 40);
                            }

                            //move the fjords
                            [].forEach.call(
                                document.querySelectorAll('.fjord-left'),
                                function (b) {
                                    if (reduced) {
                                        b.style.opacity = 0;
                                    } else {
                                        b.style.transform = 'translate(-500px, 0px)';
                                    }
                                }
                            );
                            [].forEach.call(
                                document.querySelectorAll('.fjord-right'),
                                function (b) {
                                    if (reduced) {
                                        b.style.opacity = 0;
                                    } else {
                                        b.style.transform = 'translate(1000px, 0px)';
                                    }
                                }
                            );
                            ///make sure the lines are off
                            [].forEach.call(
                                document.querySelectorAll('.line'),
                                function (b) {
                                    b.style.stroke = 'transparent';
                                }
                            );
                            //hide the line series
                            chart.series[0].hide();
                            chart.series[1].hide();
                            chart.series[2].hide();
                            chart.series[3].hide();
                            chart.series[4].hide();
                            ///expand the width of the water
                            chart.series[14].data[1].update({ x: 40 });
                            ///fjord water
                            fjordDepth.style.fill = '#2b908f';
                        }, 3000 + delay);

                        setTimeout(function () {

                            ///puts the final fjord in front
                            chart.series[18].update({ zIndex: 18 });

                            ///move the sun
                            sun.classList.add('move');
                            sunmove = true;

                            ///hide to show the bottom of the fjord
                            cover.style.opacity = 0;
                        }, 4000 + delay);

                        ///raises the water
                        setTimeout(function () {
                            chart.update({
                                chart: {
                                    animation: {
                                        duration: 1000
                                    }
                                }
                            });
                            chart.yAxis[0].setExtremes(-2, 12.2);
                            chart.series[15].update({
                                zIndex: 10,
                                data: [
                                    { x: 0.4, low: -1.37, high: 0 },
                                    { x: 21.5, low: -1.37, high: 0 }]
                            });
                            cover.style.transform = 'translateY(-2px)';
                            chart.series[12].update({
                                data: [{ x: 0, y: -2 }, { x: 40, y: -2 }]
                            });

                            ///raises the fjord
                            chart.yAxis[1].setExtremes(-2, 18);
                        }, 5000 + delay);

                        setTimeout(function () {
                            ///shows the fjord water
                            [].forEach.call(
                                document.querySelectorAll('.temps'),
                                function (b) {
                                    b.style.opacity = 1;
                                }
                            );
                            ///hides a bunch series no longer needed
                            ///make the sun and fjord water the right temperature
                            // sun.classList.add('jan');
                            temps.classList.add('jan');

                            //show the title
                            document.getElementById('title').classList.add('show');

                            ///show the temperature label with the correct month class
                            // document.getElementById('temp-data').classList.add('show');
                            // document.getElementById('temp-data').classList.add('jan');

                        }, 5700 + delay);

                        setTimeout(function () {
                            fjordsFinal();
                        }, 7000);


                    },
                    redraw: function () {
                        const sun = document.querySelector('.sun');
                        if (sunmove) {
                            sun.classList.add('move');
                        }

                    }
                }
            },
            title: {
                useHTML: true,
                verticalAlign: 'middle',
                align: 'center',
                text: `<div id="title">
                <p class="subtitle">Sea water temperature in</p>
                <h3 class="title"> Sognefjorden </h3>
                <p class="small-in">-in-</p>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle jan" 
                    type="button" id="dropdownMenuButton" 
                    aria-haspopup="true" aria-expanded="false">
                    January
                    </button>
                    <div class="month-container d-none ">
                        <a class="month active"  
                        href="#" data-index=0 id="jan">Jan</a>
                        <a class="month" href="#" data-index=1 id="feb">Feb</a>
                        <a class="month" href="#" data-index=2 id="mar">Mar</a>
                        <a class="month" href="#" data-index=3 id="apr">Apr</a>
                        <a class="month" href="#" data-index=4 id="may">May</a>
                        <a class="month" href="#" data-index=5 id="jun">Jun</a>
                        <a class="month" href="#" data-index=6 id="jul">Jul</a>
                        <a class="month" href="#" data-index=7 id="aug">Aug</a>
                        <a class="month" href="#" data-index=8 id="sep">Sep</a>
                        <a class="month" href="#" data-index=9 id="oct">Oct</a>
                        <a class="month" href="#" data-index=10 id="nov">Nov</a>
                        <a class="month" href="#" data-index=11 id="dec">Dec</a>
                    </div>
                </div>`
            },
            subtitle: {
                align: 'middle',
                verticalAlign: 'bottom',
                useHTML: true,
                text: `<div id="temp-data" class="hide">
                <span style="color:#000;">6°C</span>
                <span style="color:#000;">5°C</span>
                <span style="color:#000;">5°C</span>
                <span style="color:#000;">6°C</span>
                <span style="color:#000;">9°C</span>
                <span style="color:#fff;">12°C</span>
                <span style="color:#fff;">14°C</span>
                <span style="color:#fff;">15°C</span>
                <span style="color:#fff;">13°C</span>
                <span style="color:#000;">11°C</span>
                <span style="color:#000;">9°C</span>
                <span style="color:#000;">7°C</span>
                </div>`
            },
            xAxis: [{
                min: 0,
                max: 20,
                gridLineColor: 'transparent',
                tickInterval: 1
            },
            {
                min: 20,
                max: 40,
                gridLineColor: 'transparent',
                tickInterval: 1
            }],
            yAxis: [{
                min: -2,
                max: 18,
                gridZIndex: 20,
                gridLineColor: 'transparent',
                tickInterval: 1,
                startOnTick: false,
                endOnTick: false

            },
            {
                min: -2,
                max: 18,
                className: 'fjord-y-axis',
                gridLineColor: 'transparent',
                tickInterval: 1,
                startOnTick: false,
                endOnTick: false,
                visible: false,
                opposite: true,
                zIndex: 30,
                offset: -400
            }],
            legend: {
                enabled: false,
                floating: true,
                layout: 'vertical',
                align: 'right'
            },
            tooltip: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    opacity: 1,
                    accessibility: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            enabled: false
                        },
                        inactive: {
                            enabled: false
                        }
                    }
                },
                pie: {
                    animation: false,
                    opacity: 0
                },
                line: {
                    animation: false,
                    opacity: 1,
                    enableMouseTracking: false
                },
                area: {
                    animation: false,
                    fillOpacity: 0
                }
            },
            series: [
                //0 - bottom line -10
                {
                    type: 'line',
                    className: 'line',
                    data: [
                        { x: 0, y: -1 },
                        { x: 20, y: -1 }
                    ],
                    zIndex: 10
                },
                //1 - line -10
                {
                    type: 'line',
                    lineWidth: 1,
                    className: 'line',
                    data: [
                        { x: 0, y: 0.1 },
                        { x: 20, y: 0.1 }
                    ],
                    zIndex: 10,
                    zoneAxis: 'x',
                    zones: [
                        {
                            value: 7,
                            className: 'thin'
                        },

                        {
                            value: 20,
                            className: 'thick'
                        }]
                },
                //2 - line - 8
                {
                    type: 'line',
                    lineWidth: 1,
                    className: 'line',
                    data: [
                        { x: 0, y: 1.1 },
                        { x: 20, y: 1.1 }
                    ],
                    zIndex: 8,
                    marker: {
                        enabled: false
                    },
                    zoneAxis: 'x',
                    zones: [
                        {
                            value: 5.7,
                            className: 'transparent'
                        },
                        {
                            value: 12,
                            className: 'thick'
                        },
                        {
                            value: 20,
                            className: 'thin'
                        }]
                },
                //3 - line - 6
                {
                    type: 'line',
                    lineColor: 'white',
                    className: 'line',
                    lineWidth: 1,
                    data: [
                        { x: 0, y: 2 },
                        { x: 20, y: 2 }
                    ],
                    zIndex: 6,
                    zoneAxis: 'x',
                    zones: [
                        {
                            value: 7.5,
                            className: 'thin'
                        },
                        {
                            value: 13.5,
                            className: 'thick'
                        },
                        {
                            value: 20,
                            className: 'thick'
                        }]
                },
                //4 - top line - 4
                {
                    type: 'line',
                    lineColor: 'white',
                    className: 'line',
                    lineWidth: 1,
                    data: [
                        { x: 0, y: 3.1 },
                        { x: 20, y: 3.1 }
                    ],
                    zIndex: 4
                },
                ///5 - sun/pie - none
                {
                    name: 'sun',
                    type: 'pie',
                    className: 'sun',
                    borderColor: 'white',
                    borderWidth: 0,
                    center: ['50%', '82%'],
                    data: [{
                        y: 100,

                        fillColor: '#8087E8',
                        color: '#8087E8'
                    }
                    ],
                    size: '40%',
                    visible: true
                },
                //6 - area back-left-fjord - 2
                {
                    name: 'fjord',
                    className: 'fjord-left',
                    enableMouseTracking: false,
                    data: [
                        { x: 0, y: 4 },
                        { x: 4, y: 4 },
                        { x: 7, y: 4 },
                        { x: 10, y: 4 }
                    ],
                    zIndex: 2,
                    visible: true
                },
                //7 area -back-right-fjord - 4
                {
                    name: 'fjord',
                    className: 'fjord-right',
                    data: [
                        { x: 10, y: 3 },
                        { x: 14, y: 3 },
                        { x: 17, y: 3 },
                        { x: 20, y: 3 }
                    ],
                    zIndex: 4,
                    visible: true,
                    enableMouseTracking: false
                },
                //8 area - middle-left-fjord - 4
                {
                    name: 'fjord',
                    data: [{ y: 0, x: 0 }, { y: 0, x: 6 }, { y: 0, x: 9 }],
                    zIndex: 4,
                    visible: true,
                    className: 'fjord-left',
                    enableMouseTracking: false

                },
                //9 area - right-front-fjord - 7
                {
                    name: 'fjord',
                    data: [{ x: 12, y: 1 }, { x: 20, y: 0 }],
                    zIndex: 7,
                    visible: true,
                    className: 'fjord-right'
                },
                //10 area - left-front-fjord - 6
                {
                    name: 'fjord',
                    className: 'fjord-left',
                    data: [
                        {
                            x: 0,
                            y: 0
                        },
                        {
                            x: 7,
                            y: 0
                        }

                    ],
                    zIndex: 6,
                    visible: true
                },
                // 11 area - cover-back - 3
                {
                    name: 'water',
                    animation: false,
                    className: 'cover-back',
                    //data: [{x:6, y:4},{x:12, y:4}],
                    data: [{ x: 0, y: 4 }, { x: 40, y: 4 }],
                    zIndex: 3,
                    visible: true
                },
                // 12 area - cover-bottom-right - 8
                {
                    name: 'water',
                    className: 'cover-bottom-right',
                    animation: false,
                    data: [{ x: 11, y: 1 }, { x: 40, y: 1 }],
                    zIndex: 8,
                    visible: true,
                    enableMouseTracking: false
                },
                // 13 area - cover-middle - 5
                {
                    name: 'water',
                    type: 'arearange',
                    className: 'cover-middle',
                    animation: false,
                    data: [
                        { x: 0, low: -2, high: 2 },
                        { x: 11, low: -2, high: 2 },
                        { x: 40, low: -2, high: 2 }],
                    zIndex: 5,
                    visible: true,
                    enableMouseTracking: false
                },
                // 14 area - cover-middle-right - 5
                {
                    name: 'water',
                    className: 'cover-middle-right',
                    animation: false,
                    data: [{ x: 10, y: 3 }, { x: 40, y: 3 }],
                    zIndex: 5,
                    visible: true,
                    enableMouseTracking: false
                },
                // 15 area - foreground-water - 5
                {
                    name: 'water',
                    type: 'arearange',
                    className: 'cover',
                    animation: false,
                    data: [{ x: 0, low: -2, high: 1 },
                        { x: 40, low: -2, high: 1 }],
                    zIndex: 9,
                    visible: true,
                    enableMouseTracking: false


                },
                //16 spline - bird small - 18
                {
                    type: 'spline',
                    color: 'red',
                    lineColor: 'transparent',
                    lineWidth: 3,
                    name: 'bird-small',
                    data: [
                        { x: 0,   y: 13.9 }
                    ],
                    zIndex: 18,
                    visible: false

                },
                //17 spline - bird larger - 18
                {
                    type: 'spline',
                    color: 'blue',
                    lineColor: 'transparent',
                    lineWidth: 3,
                    name: 'bird-large',
                    data: [
                        { x: 0, y: 13.9 }
                    ],
                    zIndex: 18,
                    visible: false

                },
                //18 areaspline - 6
                {
                    type: 'area',
                    name: 'Sognefjorden',
                    animation: false,
                    className: 'depth',
                    lineWidth: 3,
                    yAxis: 1,
                    xAxis: 1,
                    zoneAxis: 'y',
                    zones: [{
                        value: 0

                    }],
                    marker: {
                        enabled: false
                    },
                    data: [
                        { x: 20.5, y: -2 },
                        {
                            x: 20.6,
                            y: 16,
                            dataLabels: {
                                enabled: false,
                                useHTML: true,
                                formatter: function () {
                                    return `<p style="margin-left:-20px;
                                    font-weight:400">Storehaugen</p>`;
                                }
                            }
                        },
                        { x: 23, y: 10.9 },
                        {
                            x: 23.92,
                            y: 9.92,
                            dataLabels: {
                                enabled: false,
                                useHTML: true,
                                formatter: function () {
                                    return `<p style="padding-left:100px;
                                    font-weight:400">Sogndal Airport</p>`;
                                }
                            }
                        },
                        { x: 25.58, y: 7.31 },
                        { x: 26.88, y: 3.6 },
                        { x: 28.4, y: 0.6 },
                        { x: 29.92, y: -1.64 },

                        { x: 30.8, y: -1.6 },
                        { x: 32.2, y: 1.16 },
                        { x: 33.62, y: 2.84 },
                        { x: 34, y: 5.1 },
                        { x: 35, y: 7.5 },
                        {
                            x: 36,
                            y: 9.8,
                            dataLabels: {
                                enabled: true,
                                useHTML: true,
                                formatter: function () {
                                    // return `<p style="padding-bottom:20px">Åsen</p>`
                                }
                            }
                        },
                        { x: 37, y: 11 },
                        {
                            x: 39.7,
                            y: 15,
                            dataLabels: {
                                enabled: true,
                                useHTML: true,
                                formatter: function () {
                                    // return `<p style="">Middagsnosi</p>`
                                }
                            }
                        },
                        { x: 39.7, y: -2 }

                    ],
                    zIndex: 1,
                    visible: true

                },
                ///19 arearange temperatures
                {
                    type: 'arearange',
                    zIndex: 30,
                    yAxis: 1,
                    className: 'temps',
                    dataLabels: {
                        enabled: false,
                        allowOverlap: true

                    },
                    enableMouseTracking: false,
                    data: [
                        { x: 4.4, low: 6.36, high: 6.47 },
                        { x: 5.2, low: 4.18, high: 6.47 },
                        { x: 6.2, low: 2.56,  high: 6.47 },
                        {
                            x: 8,
                            low: -2,
                            high: 6.47,
                            dataLabels: {
                                enabled: false,
                                useHTML: true,
                                formatter: function () {
                                    return `
                                    <div id="temp-data" class="hide">
                                    <span style="color:#000;">6°C</span>
                                    <span style="color:#000;">5°C</span>
                                    <span style="color:#000;">5°C</span>
                                    <span style="color:#000;">6°C</span>
                                    <span style="color:#000;">9°C</span>
                                    <span style="color:#fff;">12°C</span>
                                    <span style="color:#fff;">14°C</span>
                                    <span style="color:#fff;">15°C</span>
                                    <span style="color:#fff;">13°C</span>
                                    <span style="color:#fff;">11°C</span>
                                    <span style="color:#000;">9°C</span>
                                    <span style="color:#000;">7°C</span>
                                    </div>
                                    `;
                                }
                            }

                        },
                        { x: 13.2, low: -2, high: 6.47 },
                        { x: 13.8, low: -0.2, high: 6.47 },
                        { x: 15.2, low: 3.5, high: 6.47 },

                        { x: 16, low: 6.42,  high: 6.47 }
                    ]
                }
            ]
        }
    );

    const monthContainer = document.querySelector('.month-container');
    const dropDown = document.getElementById('dropdownMenuButton');
    const button = document.querySelector('.btn-secondary');
    const sun = document.querySelector('.sun');
    const temps = document.querySelector('.temps');
    const tempData = document.getElementById('temp-data');


    document.getElementById('dropdownMenuButton').addEventListener('click', function () {
        console.log('click');
        monthContainer.classList.remove('d-none');
    });

    [].forEach.call(
        document.querySelectorAll('.month'),
        function (element) {
            element.onclick = function (e) {
                e.preventDefault();
                const id = this.id;
                button.classList.remove(months[index]);
                sun.classList.remove(months[index]);
                tempData.classList.remove(months[index]);

                [].forEach.call(
                    document.querySelectorAll('.temps'),
                    function (b) {
                        b.classList.remove(months[index]);
                    }
                );

                index = months.findIndex(element => element === id);

                [].forEach.call(
                    document.querySelectorAll('.month'),
                    function (b, i) {
                        b.classList.remove('active');
                        if (b.id === id) {
                            button.classList.add(months[i]);
                            sun.classList.add(months[i]);
                            tempData.classList.add(months[i]);
                            temps.classList.add(months[i]);
                            dropDown.innerHTML = names[i];
                            monthContainer.classList.add('d-none');

                        }
                    }
                );
            };
        }
    );
};

fjordsAbout();