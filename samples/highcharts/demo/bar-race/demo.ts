type CountryData = Record<string, number>;
type CountryValueTuple = [string, number];

type DataSet = Record<string, CountryData>;


// Plugin to add text animation to data labels
declare namespace Highcharts {
    interface Chart {
        isResizing: number;
        sequenceTimer?: number;
    }
    interface SVGElement {
        endText?: string;
        textGetter(): string;
    }
}

type FxLike = {
    elem: Highcharts.SVGElement & {
        renderer: {
            chartIndex: number;
        };
        attr: (...args: any[]) => any;
    };
    end: string;
    pos: number;
    prop: string;
    start: string;
};

type HighchartsExtended = typeof Highcharts & {
    Fx: {
        prototype: {
            textSetter: (this: FxLike) => void;
        };
    };
};
(Highcharts => {
    const {
        charts,
        Fx,
        Series,
        SVGElement,
        wrap
    } = Highcharts as HighchartsExtended;
    const FLOAT = /^-?\d+\.?\d*$/;

    // Add animated textSetter, just like fill/strokeSetters
    Fx.prototype.textSetter = function (this: FxLike): void {
        const chart = charts[this.elem.renderer.chartIndex];

        let thousandsSep = chart.numberFormatter(1000.0, 1)[1];

        if (/[0-9]/.test(thousandsSep)) {
            thousandsSep = ' ';
        }

        const replaceRegEx = new RegExp(thousandsSep, 'g');

        let startValue: string | number = this.start.replace(replaceRegEx, ''),
            endValue: string | number = this.end.replace(replaceRegEx, ''),
            currentValue: string | number = this.end.replace(replaceRegEx, '');

        if ((String(startValue || '')).match(FLOAT)) {
            startValue = parseInt(String(startValue), 10);
            endValue = parseInt(String(endValue), 10);

            // No support for float
            currentValue = chart.numberFormatter(
                Math.round(startValue + (endValue - startValue) * this.pos),
                0
            );
        }

        this.elem.endText = this.end;

        this.elem.attr(this.prop, currentValue, null, true);
    };

    // Add textGetter, not supported at all at this moment:
    SVGElement.prototype.textGetter = function (): string {
        const ct = this.text.element.textContent || '';
        return this.endText ? this.endText : ct.substring(0, ct.length / 2);
    };

    // Temporary change label.attr() with label.animate():
    // In core it's simple change attr(...) => animate(...) for text prop
    wrap(Series.prototype, 'drawDataLabels', function (
        this: Highcharts.Series,
        proceed: (...args: any[]) => any,
        ...args: any[]
    ): void {
        const attr = SVGElement.prototype.attr,
            chart = this.chart;

        if (chart.sequenceTimer) {
            this.points.forEach(point =>
                (point.dataLabels || []).forEach(
                    label =>
                        (label.attr = function (...labelArgs: any[]): any {
                            const [hash, ...rest] = labelArgs;

                            if (
                                typeof hash === 'object' &&
                                hash.text !== undefined &&
                                chart.isResizing === 0
                            ) {
                                const text = hash.text;

                                delete hash.text;

                                return this
                                    .attr(hash, ...rest)
                                    .animate({ text });
                            }
                            return attr.apply(this, labelArgs);

                        })
                )
            );
        }

        const ret = proceed.apply(this, args);

        this.points.forEach(p =>
            (p.dataLabels || []).forEach(d => (d.attr = attr))
        );

        return ret;
    });
})(Highcharts as HighchartsExtended);

const startYear = 1960,
    endYear = 2022,
    btn = document.getElementById('play-pause-button') as HTMLButtonElement,
    input = document.getElementById('play-range') as HTMLInputElement,
    nbr = 20;

let dataset: DataSet;
let chart: Highcharts.Chart;

function getData(year: number): [CountryValueTuple, CountryValueTuple[]] {
    const output: CountryValueTuple[] = Object.keys(dataset)
        .map((countryName: string) => [
            countryName,
            Number(dataset[countryName][String(year)])
        ] as CountryValueTuple)
        .sort((a: CountryValueTuple, b: CountryValueTuple) => b[1] - a[1]);
    return [output[0], output.slice(1, nbr)];
}

function getSubtitle(): string {
    const currentYear = Number(input.value);
    const population = (getData(currentYear)[0][1] / 1000000000).toFixed(2);
    return `<span style="font-size: 80px">${input.value}</span>
        <br>
        <span style="font-size: 22px">
            Total: <b>: ${population}</b> billion
        </span>`;
}

const linearEasing = function (pos: number): number {
    return pos;
};

(async (): Promise<void> => {

    const response = await fetch(
        'https://demo-live-data.highcharts.com/population.json'
    );
    dataset = await response.json() as DataSet;

    chart = Highcharts.chart('container', {
        chart: {
            animation: {
                duration: 500,
                easing: linearEasing
            },
            marginRight: 50
        },
        title: {
            text: 'World population by country',
            align: 'left'
        },
        subtitle: {
            text: getSubtitle(),
            floating: true,
            align: 'right',
            verticalAlign: 'middle',
            useHTML: true,
            y: -80,
            x: -100
        },

        legend: {
            enabled: false
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            opposite: true,
            tickPixelInterval: 150,
            title: {
                text: null
            }
        },
        plotOptions: {
            bar: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                colorByPoint: true,
                dataSorting: {
                    enabled: true,
                    matchByName: true
                },
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                type: 'bar',
                name: String(startYear),
                data: getData(startYear)[1]
            }
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 550
                },
                chartOptions: {
                    xAxis: {
                        visible: false
                    },
                    subtitle: {
                        x: 0
                    },
                    plotOptions: {
                        series: {
                            dataLabels: [{
                                enabled: true,
                                y: 8
                            }, {
                                enabled: true,
                                format: '{point.name}',
                                y: -8,
                                style: {
                                    fontWeight: 'normal',
                                    opacity: 0.7
                                }
                            }]
                        }
                    }
                }
            }]
        }
    } satisfies Highcharts.Options);
})();

/*
 * Pause the timeline, either when the range is ended, or when clicking the
 * pause button. Pausing stops the timer and resets the button to play mode.
 */
function pause(button: HTMLButtonElement): void {
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

/*
 * Update the chart. This happens either on updating (moving) the range input,
 * or from a timer when the timeline is playing.
 */
function update(increment?: number): void {
    if (increment) {
        input.value = String(parseInt(input.value, 10) + increment);
    }
    if (Number(input.value) >= endYear) {
        // Auto-pause
        pause(btn);
    }

    chart.setTitle(void 0, {
        text: getSubtitle()
    }, false);

    chart.series[0].update({
        type: 'bar',
        name: input.value,
        data: getData(Number(input.value))[1]
    });
}

/*
 * Play the timeline.
 */
function play(button: HTMLButtonElement): void {
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(function () {
        update(1);
    }, 500);
}

btn.addEventListener('click', function () {
    if (chart.sequenceTimer) {
        pause(this as HTMLButtonElement);
    } else {
        play(this as HTMLButtonElement);
    }
});
/*
 * Trigger the update on the range bar click.
 */
input.addEventListener('click', function () {
    update();
});
