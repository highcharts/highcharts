let parsedData = [];
const tooltipDivs = [];
let checkboxChecked = false;
Highcharts.chart('container', {
    chart: {
        type: 'column',
        events: {
            load: function () {
                const points = this.series.map(s => s.points).flat();
                points.forEach(point => {
                    const id = `tooltip-${point.series.name}-${point.index}`;
                    if (checkboxChecked) {
                        point.graphic.element.setAttribute('aria-describedby', id);
                    }

                    const column = parsedData.find(columns =>
                        columns[0].startsWith(point.x)
                    );

                    if (column) {
                        const grammy = column[3],
                            songwin = column[4],
                            songnom = column[5],
                            awardwin = column[6],
                            awardnom = column[7];

                        let tooltipText;
                        if (point.series.name === 'wins') {
                            tooltipText = createTooltipText(grammy, Highcharts.dateFormat('%Y', point.x), 'wins', point.y, songwin, awardwin);
                        }
                        if (point.series.name === 'nominations') {
                            tooltipText = createTooltipText(grammy, Highcharts.dateFormat('%Y', point.x), 'nominations', point.y, songnom, awardnom);
                        }

                        const tooltipDiv = document.createElement('div');
                        tooltipDiv.setAttribute('id', id);
                        tooltipDiv.setAttribute('aria-hidden', 'true');
                        tooltipDiv.classList.add('visually-hidden');
                        tooltipDiv.innerHTML = tooltipText;
                        document.body.appendChild(tooltipDiv);
                        tooltipDivs.push(tooltipDiv);
                    }
                });
            }
        }
    },

    title: {
        text: 'Stevie Wonder Grammy Awards Wins and Nominations'
    },
    xAxis: {
        type: 'datetime',
        title: {
            enabled: false
        }
    },

    yAxis: {
        title: {
            text: 'Number of awards/nominations'
        },
        stackLabels: {
            enabled: true,
            formatter: function () {
                if (this.total === 0) {
                    return '';
                }
                return this.total;
            }
        }
    },
    data: {
        csv: document.getElementById('grammy-data').innerText,
        beforeParse: function (csv) {
            parsedData = csv.split('\n').map(line => line.split(','));
            return parsedData.map(columns => columns.slice(0, 3).join(',')).join('\n');
        }
    },
    tooltip: {
        useHTML: true,
        formatter: function () {
            const tooltipDiv =
                document.getElementById(
                    `tooltip-${this.point.series.name}-${this.point.index}`
                );
            if (tooltipDiv) {
                return tooltipDiv.innerHTML;
            }
            return '';
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: [{
        color: '#B18B0F'
    }, {
        color: '#214769'
    }]
});


function createTooltipText(
    grammy, year, seriesName, y, songValues, awardValues
) {
    const songValuesArray = songValues.split(';'),
        awardValuesArray = awardValues.split(';'),
        mappedValues = songValuesArray.map((song, i) => ({
            song, award: awardValuesArray[i]
        }));

    let tooltipText =
        `<p class="tooltip-heading">${grammy} Grammy Awards (${year})</p>
        <p class="win-nom">
            ${seriesName.charAt(0).toUpperCase() + seriesName.slice(1)}: ${y}
        </p>`;

    if (songValues.includes('None') || awardValues.includes('None')) {
        return tooltipText;
    }
    tooltipText += mappedValues.map(value => `<li><strong>${value.award.trim()}: </strong>${value.song}</li>`).join('');


    return tooltipText;
}

// Add a checkbox to the page to toggle verbosity of the chart
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#container'),
        checkbox = document.createElement('input'),
        labelCheckbox = document.createElement('label');

    checkbox.setAttribute('type', 'checkbox');
    checkbox.id = 'checkbox-info';
    labelCheckbox.setAttribute('for', checkbox.id);
    labelCheckbox.textContent = ' Announce tooltip details';

    container.parentNode.insertBefore(checkbox, container);
    container.parentNode.insertBefore(labelCheckbox, container);

    checkbox.addEventListener('change', () => {
        checkboxChecked = !checkboxChecked;

        const chart = Highcharts.charts[0];
        const points = chart.series.map(s => s.points).flat();

        points.forEach(point => {
            if (checkboxChecked) {
                const id = `tooltip-${point.series.name}-${point.index}`;
                point.graphic.element.setAttribute('aria-describedby', id);

                // Store original aria-label
                point.graphic.element.dataset.originalAriaLabel = point.graphic.element.getAttribute('aria-label');

                // To avoid duplicate information
                point.graphic.element.removeAttribute('aria-label');
            } else {
                point.graphic.element.removeAttribute('aria-describedby');
                const originalAriaLabel =
                    point.graphic.element.dataset.originalAriaLabel;

                // Restore original aria-label if checkbox is unchecked after being checked
                if (originalAriaLabel) {
                    point.graphic.element.setAttribute('aria-label', originalAriaLabel);
                }
            }
        });

        tooltipDivs.forEach(tooltipDiv => {
            tooltipDiv.setAttribute('aria-hidden', !checkboxChecked);
        });
    });
});