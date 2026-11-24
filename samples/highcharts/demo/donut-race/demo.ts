type CountryDataMap = Record<string, Record<string, number>>;
type DonutRacePoint = [string, number];
type DonutRaceChart = Highcharts.Chart & {
    sequenceTimer?: number;
};

const startYear = 1965,
    endYear = 2020,
    btn = document.getElementById('play-pause-button') as HTMLButtonElement,
    input = document.getElementById('play-range') as HTMLInputElement,
    nbr = 6;

let dataset: CountryDataMap;
let chart: DonutRaceChart;

function getYearData(year: number | string): {
    total: DonutRacePoint;
    countries: DonutRacePoint[];
} {
    const output: DonutRacePoint[] = Object.keys(dataset).map(
        (countryName: string): DonutRacePoint => {
            const countryData = dataset[countryName];
            return [countryName, Number(countryData[String(year)])];
        }
    );
    const total = output[0] ?? ['', 0];
    return {
        total,
        countries: output.slice(1, nbr)
    };
}

function getSubtitle(): string {
    const totalNumber = getYearData(input.value).total[1].toFixed(2);
    return `<span style="font-size: 80px">${input.value}</span>
        <br>
        <span style="font-size: 22px">
            Total: <b> ${totalNumber}</b> TWh
        </span>`;
}

(async (): Promise<void> => {
    dataset = await fetch(
        'https://www.highcharts.com/samples/data/nuclear-energy-production.json'
    ).then((response: Response): Promise<CountryDataMap> => response.json());

    chart = Highcharts.chart('container', {
        title: {
            text: 'Nuclear energy production from 1965 to 2021 in US, UK, ' +
                'France, Germany, and Japan',
            align: 'center'
        },
        subtitle: {
            text: getSubtitle(),
            floating: true,
            useHTML: true,
            verticalAlign: 'middle',
            y: 30
        },

        legend: {
            enabled: false
        },

        tooltip: {
            valueDecimals: 2,
            valueSuffix: ' TWh'
        },

        plotOptions: {
            pie: {
                borderWidth: 0,
                size: '100%',
                innerSize: '80%',
                dataLabels: {
                    enabled: true,
                    crop: false,
                    distance: '-10%',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '16px'
                    },
                    connectorWidth: 0
                }
            }
        },
        colors: ['#FCE700', '#F8C4B4', '#f6e1ea', '#B8E8FC', '#BCE29E'],
        series: [
            {
                type: 'pie',
                name: String(startYear),
                data: getYearData(startYear).countries
            }
        ]
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

    chart.update(
        {
            subtitle: {
                text: getSubtitle()
            }
        },
        false,
        false,
        false
    );

    chart.series[0].update({
        name: input.value,
        data: getYearData(input.value).countries
    } as Highcharts.SeriesPieOptions);
}

/*
 * Play the timeline.
 */
function play(button: HTMLButtonElement): void {
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = window.setInterval(() => {
        update(1);
    }, 500);
}

btn.addEventListener('click', function (): void {
    if (chart.sequenceTimer) {
        pause(this as HTMLButtonElement);
    } else {
        play(this as HTMLButtonElement);
    }
});
/*
 * Trigger the update on the range bar click.
 */
input.addEventListener('input', function (): void {
    update();
});
