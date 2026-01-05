const getPane = () => {
    const endAngle = parseInt(
            document.querySelector<HTMLInputElement>('#end-angle').value,
            10
        ),
        startAngle = endAngle * -1;
    return { startAngle, endAngle };
};

const chart = Highcharts.chart('container', {

    chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: '#fff'
    },

    title: {
        text: 'Responsive pane size'
    },

    subtitle: {
        text: `startAngle: ${getPane().startAngle},
            endAngle: ${getPane().endAngle}`
    },
    pane: {
        ...getPane(),
        background: [{
            outerRadius: '100%',
            innerRadius: '60%',
            shape: 'arc'
        }],
        size: undefined,
        center: ['50%', undefined]
    },

    yAxis: {
        min: 0,
        max: 200,
        labels: {
            distance: 15
        }
    },

    plotOptions: {
        gauge: {
            dataLabels: {
                y: 25
            }
        },
        solidgauge: {
            dataLabels: {
                verticalAlign: 'middle'
            }
        }
    },

    series: [{
        name: 'Speed',
        type: 'gauge',
        data: [80],
        dataLabels: {
            borderWidth: 0,
            style: {
                fontSize: '1.4em'
            },
            backgroundColor: '#ddd8'
        },
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]
});

document.querySelectorAll('input[type="range"]').forEach(
    input => input.addEventListener('input', () => {
        const pane = getPane();
        chart.update({
            pane,
            subtitle: {
                text: `startAngle: ${pane.startAngle},
                    endAngle: ${pane.endAngle}`
            }
        }, undefined, undefined, false);
    })
);

type ResizableOptions = {
    resize: (this: HTMLElement) => void;
}

type JQueryUI = {
    resizable: (options?: ResizableOptions) => void;
}

($('#resizer') as unknown as JQueryUI).resizable({
    resize: function () {
        Highcharts.charts[0].setSize(
            this.offsetWidth - 20,
            this.offsetHeight - 20,
            false
        );
    }
});
