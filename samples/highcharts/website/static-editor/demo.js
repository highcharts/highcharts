Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

const months = ['jan', 'feb', 'mar', 'apr', 'may',
    'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const names = ['January', 'February', 'March',
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

const fjordTemps = [6, 5, 5, 6, 9, 12, 14, 15, 13, 11, 9, 7];

let index = 0;

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

                        ///move the sun
                        sun.classList.add('finalmove');
                        temps.classList.add('jan');

                        chart.series[3].show();
                        document.querySelector('.highcharts-zone-graph-0').style.fill = 'transparent';

                        fjordDepth.style.fill = '#2b908f';
                        ///raises the water
                        setTimeout(function () {
                            chart.yAxis[0].setExtremes(-2, 12.2);
                            chart.series[0].update({
                                zIndex: 10,
                                data: [
                                    { x: 0, low: -2, high: 4 },
                                    { x: 40, low: -2, high: 4 }]
                            });

                            ///raises the fjord
                            chart.yAxis[1].setExtremes(-2, 18);
                        }, 200);

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
                            sun.style.transition = 'all 1s';
                            ///make the sun and fjord water the right temperature
                            sun.classList.add('jan');
                            temps.classList.add('jan');

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
                        sun.classList.add('finalmove');
                        sun.classList.add(months[index]);
                        temps.classList.add(months[index]);

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
            lang: {
                accessibility: {
                    chartContainerLabel: '',
                    screenReaderSection: {
                        beforeRegionLabel: '',
                        endOfChartMarker: ''
                    }
                }
            },
            accessibility: {
                landmarkVerbosity: 'disabled',
                screenReaderSection: {
                    beforeChartFormatter: function () {
                        return `
                            <h1>Sea water temperature chart</h1>
                            <p>Average Sea water temperature in 
                            Sognefjorden, January to December</p>
                            <p>Infographic of two mountains with a fjord
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
                    accessibility: {
                        enabled: false
                    },
                    enableMouseTracking: false,
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
                    opacity: 1
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
                ///3 - sun/pie - none
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
                    visible: false
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
        this.setAttribute('aria-expanded', 'true');
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

                document.getElementById('dropdownMenuButton').setAttribute('aria-expanded', 'false');

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


fjordsFinal();