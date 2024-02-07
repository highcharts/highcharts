const options = {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Monthly precipitation'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        max: 300,
        title: {
            text: 'Precipitation / mm'
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
};

// Add an event to keep the annotations update
options.chart.events = {

    // The render event fires both on the first chart render and on redraws
    render() {

        let isNew = false;

        // If our two SVG elements don't exist yet, create them. Save references
        // on the Chart instance so we can refer to them on subsequent redraws.
        if (!this.autumnBracket) {
            this.autumnBracket = this.renderer.path()
                .attr({
                    stroke: '#333333',
                    'stroke-width': 1
                })
                .add();

            this.autumnText = this.renderer.text('Autumn months')
                .attr({
                    'text-anchor': 'middle'
                })
                .css({
                    fontStyle: 'italic'
                })
                .add();

            // Mark as new, so that we avoid animation on the first initial
            // positioning
            isNew = true;
        }

        // Get the positions of the autumn month values
        const autumnMonthsPos = this.series[0].points
            .slice(8, 11)
            .map(p => p.pos(true));

        // Get the minimum (uppermost) y position because we want to render
        // the bracket above them all
        const minY = Math.min.apply(0, autumnMonthsPos.map(p => p[1])),
            top = minY - 10,
            // Use the category width to calculate the offset outside both
            // central column x positions
            categoryWidth = autumnMonthsPos[1][0] - autumnMonthsPos[0][0],
            left = autumnMonthsPos.at(0)[0] - categoryWidth / 2,
            right = autumnMonthsPos.at(-1)[0] + categoryWidth / 2;

        // Position the two elements. The first time this runs, we call the
        // attr function because we don't want animation. On subsequent redraws,
        // animate into new position.
        this.autumnBracket[isNew ? 'attr' : 'animate']({
            d: [
                ['M', left, top + 10],
                ['L', left, top],
                ['L', right, top],
                ['L', right, top + 10]
            ]
        });
        this.autumnText[isNew ? 'attr' : 'animate']({
            x: (right + left) / 2,
            y: top - 5
        });

    }
};

Highcharts.chart('container', options);