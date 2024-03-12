const descriptionDivs = [],
    tooltipDivs = [],
    tooltipCheckbox = document.getElementById('checkbox-info'),
    nullpointCheckbox = document.getElementById('checkbox-nullpoint');
let parsedData = [],
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

                    if (tooltipCheckbox.checked) {
                        point.graphic.element.setAttribute('aria-describedby', descriptionDivId);
                    }

                    if (nullpointCheckbox.checked && point.y === 0) {
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
                        const addPunctuation = tooltipText.replace(/<\/li>/g, '</li>. '); // Hack for adding punctuation after the song
                        let strippedDescription = addPunctuation.replace(/<[^>]*>?/gm, '');
                        strippedDescription = strippedDescription.replace(/Wins: \d+|Nominations: \d+/g, '');
                        const descriptionDiv = createAndAppendDiv(descriptionDivId, strippedDescription);
                        descriptionDivs.push(descriptionDiv);

                        // The same text as above, but contains html for tooltip formatting
                        const tooltipDiv = createAndAppendDiv(tooltipDivId, tooltipText);
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
            enabled: false
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
        borderColor: '#B18B0F',
        borderWidth: 1,
        color: '#B18B0F',
        custom: {
            seriesDescription: 'wins, bar series 1 of 2',
            actualNumBars: 10
        }
    }, {
        borderColor: '#214769',
        borderWidth: 1,
        color: {
            pattern: {
                path: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
                color: '#214769',
                backgroundColor: '#21476920',
                width: 5.5,
                height: 5.5
            }
        },
        custom: {
            seriesDescription: 'nominations, bar series 2 of 2',
            actualNumBars: 22
        }
    }]
});

// Chart variables
const chart = Highcharts.charts[0],
    points = chart.series.map(s => s.points).flat();

// New DOM elements
const screenReaderSection = document.getElementById('highcharts-screen-reader-region-before-0'),
    moreInfoButton = document.createElement('button'),
    infoP = document.createElement('p'),
    infoDiv = document.createElement('div');

// Adding more info button to the DOM and setting attributes
moreInfoButton.textContent = 'Toggle more information';
moreInfoButton.setAttribute('aria-expanded', 'true');
infoDiv.setAttribute('id', '#info-div');
infoDiv.style.display = 'block';
infoP.textContent = document.getElementById('rich-description').textContent;
screenReaderSection.firstChild.appendChild(moreInfoButton);
moreInfoButton.parentNode.appendChild(infoDiv);
infoDiv.appendChild(infoP);

// Function to create tooltip text with <strong> and <br> for
// attempt of styling withous useHTML
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
        `<strong>${seriesName.charAt(0).toUpperCase() +
        seriesName.slice(1)}</strong>: ${y}</br>`;

    if (songValues.includes('None') || awardValues.includes('None')) {
        return tooltipText;
    }
    tooltipText += mappedValues.map(value => `<strong>${value.award.trim()}: </strong>${value.song}. </br>`).join('');

    return tooltipText;
}

function createAndAppendDiv(id, innerHTML) {
    const div = document.createElement('div');
    div.setAttribute('id', id);
    div.classList.add('tooltip-description');
    div.innerHTML = innerHTML;
    document.body.appendChild(div);
    return div;
}

// More information button that is appended to the screen reader
// section in the chart container.
moreInfoButton.addEventListener('click', () => {
    const expanded = moreInfoButton.getAttribute('aria-expanded') === 'true';

    if (!expanded) {
        infoDiv.style.display = 'block';
        moreInfoButton.setAttribute('aria-expanded', 'true');
    } else {
        infoDiv.style.display = 'none';
        moreInfoButton.setAttribute('aria-expanded', 'false');
    }
});

// Verbosity checkbox for hiding points with zero value
nullpointCheckbox.addEventListener('change', () => {
    nullpointCheckboxChecked = !nullpointCheckboxChecked;
    points.forEach(point => {
        if (nullpointCheckbox.checked && point.y === 0) {
            point.graphic.element.setAttribute('aria-hidden', 'true');
        } else {
            point.graphic.element.setAttribute('aria-hidden', 'false');
        }
    });
});

// Verbosity checkbox for announcing tooltip details to screen reader
tooltipCheckbox.addEventListener('change', () => {
    points.forEach(point => {
        if (tooltipCheckbox.checked) {
            const id =
                `tooltip-${point.series.name}-${point.index}-description`;
            point.graphic.element.setAttribute('aria-describedby', id);
        } else {
            point.graphic.element.removeAttribute('aria-describedby');
        }
    });
});
