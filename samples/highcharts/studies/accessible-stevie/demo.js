const descriptionDivs = [];
const tooltipDivs = [];
let parsedData = [],
    checkboxChecked = false,
    nullpointCheckboxChecked = true;


Highcharts.addEvent(Highcharts.Chart, 'aftergetTableAST', function (e) {
    e.tree.children[2].children.forEach(function (row) {
        row.children.forEach(function (cell, i) {
            if (i === 0) {
                const split = cell.textContent.split('-');
                row.children[i].textContent = split[0].trim();
            }
        });
    });
});


Highcharts.chart('container', {
    chart: {
        type: 'column',
        events: {
            load: function () {
                const points = this.series.map(s => s.points).flat();
                points.forEach(point => {
                    const id = `tooltip-${point.series.name}-${point.index}`;
                    const descriptionDivId = id + '-description';
                    const tooltipDivId = id + '-tooltip';
                    if (checkboxChecked) {
                        point.graphic.element.setAttribute('aria-describedby', id);
                    }

                    if (nullpointCheckboxChecked && point.y === 0) {
                        point.graphic.element.setAttribute('aria-hidden', 'true');
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

                        // This text gets stripped of HTML tags and is used as the description for the points
                        const descriptionDiv = document.createElement('div');
                        descriptionDiv.setAttribute('id', descriptionDivId);
                        descriptionDiv.setAttribute('aria-hidden', 'true');
                        descriptionDiv.classList.add('visually-hidden');
                        const addPunctuation = tooltipText.replace(/<\/li>/g, '</li>. '); // Hack for adding punctuation after the song
                        let strippedDescription = addPunctuation.replace(/<[^>]*>?/gm, '');
                        strippedDescription = strippedDescription.replace(/Wins: \d+|Nominations: \d+/g, '');
                        descriptionDiv.innerHTML = strippedDescription;
                        document.body.appendChild(descriptionDiv);
                        descriptionDivs.push(descriptionDiv);

                        // The same text as above, but contains html for tooltip formatting
                        const tooltipDiv = document.createElement('div');
                        tooltipDiv.setAttribute('id', tooltipDivId);
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
    accessibility: {
        series: {
            descriptionFormat: '{series.options.custom.seriesDescription} with {series.options.custom.actualNumBars} bars.'
        },
        keyboardNavigation: {
            seriesKeyboardNavigation: {
                pointNavigationEnabledThreshold: true
            }
        }
    },
    xAxis: {
        type: 'datetime',
        title: {
            enabled: false
        },
        accessibility: {
            description: 'Years',
            rangeDescription: 'Data ranges from 1967 to 2010'
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
    exporting: {
        showTable: false
    },
    tooltip: {
        formatter: function () {
            const tooltipDiv =
                document.getElementById(
                    `tooltip-${this.point.series.name}-${this.point.index}-tooltip`
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
        color: '#B18B0F',
        custom: {
            seriesDescription: 'wins, bar series 1 of 2',
            actualNumBars: 10
        }
    }, {
        color: '#214769',
        custom: {
            seriesDescription: 'nominations, bar series 2 of 2',
            actualNumBars: 22
        }
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
        `<strong>${grammy} Grammy Awards (${year})</strong>. </br>` +
        `<strong>${seriesName.charAt(0).toUpperCase() + seriesName.slice(1)}</strong>: ${y}</br>`;

    if (songValues.includes('None') || awardValues.includes('None')) {
        return tooltipText;
    }
    tooltipText += mappedValues.map(value => `<strong>${value.award.trim()}: </strong>${value.song}. </br>`).join('');


    return tooltipText;
}

// Add a checkbox to the page to toggle verbosity of the chart
document.addEventListener('DOMContentLoaded', () => {
    const screenReaderSection = document.querySelector('#highcharts-screen-reader-region-before-0'),
        moreInfoButton = document.createElement('button'),
        infoDiv = document.createElement('div'),
        infoP = document.createElement('p');

    const tooltipCheckbox = document.getElementById('checkbox-info');
    const nullpointCheckbox = document.getElementById('checkbox-nullpoint');

    moreInfoButton.textContent = 'Toggle more information';
    moreInfoButton.setAttribute('aria-expanded', 'true');
    infoDiv.setAttribute('id', '#info-div');
    infoDiv.style.display = 'block';
    infoP.textContent = document.getElementById('rich-description').textContent;

    screenReaderSection.firstChild.appendChild(moreInfoButton);
    moreInfoButton.parentNode.appendChild(infoDiv);
    infoDiv.appendChild(infoP);


    moreInfoButton.addEventListener('click', () => {
        const expanded = moreInfoButton.getAttribute('aria-expanded') === 'true';

        if (!expanded) {
            console.log('expanded');
            infoDiv.style.display = 'block';
            moreInfoButton.setAttribute('aria-expanded', 'true');
        } else {
            console.log('not expanded');
            infoDiv.style.display = 'none';
            moreInfoButton.setAttribute('aria-expanded', 'false');
        }

    });

    nullpointCheckbox.addEventListener('change', () => {
        const chart = Highcharts.charts[0];
        const points = chart.series.map(s => s.points).flat();

        nullpointCheckboxChecked = !nullpointCheckboxChecked;

        points.forEach(point => {
            // If nullpointCheckbox is checked and the point's y value is 0, set aria-hidden to true
            if (nullpointCheckbox.checked && point.y === 0) {
                point.graphic.element.setAttribute('aria-hidden', 'true');
            } else {
                // If nullpointCheckbox is not checked or the point's y value is not 0, set aria-hidden to false
                point.graphic.element.setAttribute('aria-hidden', 'false');
            }
        });
    });

    tooltipCheckbox.addEventListener('change', () => {
        checkboxChecked = !checkboxChecked;

        const chart = Highcharts.charts[0];
        const points = chart.series.map(s => s.points).flat();

        points.forEach(point => {
            if (checkboxChecked) {
                const id = `tooltip-${point.series.name}-${point.index}-description`;
                point.graphic.element.setAttribute('aria-describedby', id);
            } else {
                point.graphic.element.removeAttribute('aria-describedby');
            }
        });

        descriptionDivs.forEach(descriptionDiv => {
            descriptionDiv.setAttribute('aria-hidden', !checkboxChecked);
        });
    });
});