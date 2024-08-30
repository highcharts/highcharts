// Add a general event handler, but with different behavior depending on the
// chart class name
Highcharts.addEvent(Highcharts.Chart, 'render', function () {
    if (this.options.chart.className?.indexOf('the-column') !== -1) {
        let isNew = false;
        if (!this.label) {
            this.label = this.renderer.label('This is the column')
                .add();
            isNew = true;
        }

        this.label[isNew ? 'attr' : 'animate']({
            x: this.plotLeft,
            y: this.plotTop
        });

    } else if (this.options.chart.className?.indexOf('the-pie') !== -1) {
        let isNew = false;
        if (!this.label) {
            this.label = this.renderer.label('This is the pie')
                .attr({
                    'text-anchor': 'middle'
                })
                .add();
            isNew = true;
        }

        this.label[isNew ? 'attr' : 'animate']({
            x: this.plotLeft + this.series[0].center[0],
            y: this.plotTop + this.series[0].center[1] - 15
        });
    }
});

Highcharts.chart('container-1', {
    chart: {
        type: 'column',
        className: 'the-column'
    },
    title: {
        text: 'Column chart'
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});

Highcharts.chart('container-2', {
    chart: {
        type: 'pie',
        className: 'the-pie'
    },
    title: {
        text: 'Pie chart'
    },
    series: [{
        data: [1, 3, 2, 4],
        dataLabels: {
            enabled: false
        },
        innerSize: '80%'
    }]
});