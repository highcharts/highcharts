Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: 'Helvetica,Arial,sans-serif'
        }
    },
    legend: {
        borderRadius: 0,
        layout: 'vertical',
        align: 'left',
        x: 30,
        y: 50,
        verticalAlign: 'top',
        floating: true,
        itemStyle: {
            color: '#000000',
            fontFamily: 'Helvetica,Arial,sans-serif'
        }
    },
    title: {
        style: {
            color: '#000000',
            fontFamily: 'Helvetica,Arial,sans-serif',
            fontSize: '20px',
            fontWeight: 'bold'
        }
    },


    xAxis: {
        labels: {
            style: {
                color: '#333333',
                fontFamily: 'Helvetica,Arial,sans-serif',
                fontSize: 8
            },
            rotation: 0
        }
    },

    yAxis: {
        labels: {
            style: {
                color: '#333333',
                fontFamily: 'Helvetica,Arial,sans-serif'
            }
        },
        min: 0,
        // max: 7000,
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],
        title: {
            style: {
                color: '#333333',
                fontFamily: 'Helvetica,Arial,sans-serif'
            },
            text: 'Total number of devices'
        }
    }

});


const years = ['', '`13', '`14', '`15', '`16'];

const optionsOne = {
    xAxis: {
        categories: [{
            name: 'Bluetooth Headset',
            categories: years
        },
        {
            name: 'Body Camera',
            categories: years
        },
        {
            name: 'Chest Strap',
            categories: years
        },
        {
            name: 'Head Mounted Display',
            categories: years
        },
        {
            name: 'Other',
            categories: years
        },
        {
            name: 'Smart Glasses',
            categories: years
        },
        {
            name: 'Smart Watch',
            categories: years
        },
        {
            name: 'Sports Watch',
            categories: years
        },
        {
            name: 'Wristband',
            categories: years
        }],
        labels: {
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent'
        }
    }
};

let chartOne = {
    chart: {
        renderTo: 'chartspace',
        type: 'area'
    },
    title: {
        text: 'IoT devices sales and shipment information'
    },

    plotOptions: {
        area: {
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


    series: []
};

const optionsTwo = {
    xAxis: {
        name: '',
        categories: ['Bluetooth Headset', 'Body Camera', 'Chest Strap', 'Head Mounted Display', 'Other', 'Smart Glasses', 'Smart Watch', 'Sports Watch', 'Wristband'],
        labels: {
            enabled: false
        }
    },
    yAxis: {
        reversed: true
    },
    legend: {
        x: 50,
        y: 100
    },
    style: {
        text: 'Number of returns'
    }
};

let chartTwo = {
    chart: {
        renderTo: 'dtschart',
        type: 'column'
    },
    title: {
        text: ''
    },

    xAxis: {
        tickWidth: 0,
        labels: {
            enabled: false
        }
    },

    yAxis: {
        gridLineWidth: 0,
        labels: {
            style: {
                color: 'transparent'
            }
        },
        title: {
            text: 'text text text',
            style: {
                color: 'transparent'
            }
        }
    },

    plotOptions: {
        area: {
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


    series: []
};

fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts/samples/data/iot-devices.csv').then(function (response) {
    return response.text();
}).then(function (result) {
    const lines = result.split('\n');
    const salesNumbers = [];
    const averageDaysToShip = [];
    const percReturned = [];

    lines.forEach(function (line, lineNo) {
        const items = line.split(',');
        if (lineNo === 0) {
            return true;
        }
        const totalReturned = parseFloat(items[1] * parseFloat(items[4]) / 100);

        if ((lineNo + 3) % 4 === 0) {
            salesNumbers.push(parseFloat(null));
            // averageDaysToShip.push(parseFloat(null));
            percReturned.push(null);
            averageDaysToShip.push(parseFloat(items[3]));
            // options.xAxis.categories.push(items[0]);
            // count += 1;
        }

        // options.xAxis.categories.push(items[0]);

        salesNumbers.push(parseFloat(items[1]));
        // averageDaysToShip.push(parseFloat(items[3]));
        percReturned.push(totalReturned);
    });


    const salesObject = {
        name: 'total devices sold',
        data: salesNumbers
    };

    const returnsObject = {
        name: 'devices returned',
        data: percReturned
    };

    const dtsObject = {
        name: 'Days to ship',
        data: averageDaysToShip,
        color: '#FED001',
        dataLabels: {
            enabled: true,
            style: {
                fontSize: 8,
                fontWeight: 1
            }
        }
    };

    chartOne.series.push(salesObject);
    chartOne.series.push(returnsObject);
    chartTwo.series.push(dtsObject);

    chartOne = Highcharts.merge(optionsOne, chartOne);
    const chartOneRendered = new Highcharts.Chart(chartOne);

    chartTwo = Highcharts.merge(optionsTwo, chartTwo);
    const chartTwoRendere = new Highcharts.Chart(chartTwo);

    console.log(chartOne);
    console.log(chartTwo);

}).catch(function (error) {
    console.log(error);
});