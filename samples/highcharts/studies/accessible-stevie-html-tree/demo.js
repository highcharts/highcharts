let parsedData = [];
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    accessibility: {
        enabled: false
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
            const year = Highcharts.dateFormat('%Y', this.x);
            const column = parsedData.find(columns =>
                columns[0].startsWith(this.point.x)
            );

            if (column) {
                const grammy = column[3],
                    songwin = column[4],
                    songnom = column[5],
                    awardwin = column[6],
                    awardnom = column[7];

                if (this.series.name === 'wins') {
                    return createTooltipText(grammy, year, 'wins', this.y, songwin, awardwin);
                }
                if (this.series.name === 'nominations') {
                    return createTooltipText(grammy, year, 'nominations', this.y, songnom, awardnom);
                }
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

    return `
        <p class="tooltip-heading">${grammy} Grammy Awards (${year})</p>
        <p class="win-nom">
            ${seriesName.charAt(0).toUpperCase() + seriesName.slice(1)}: ${y}
        </p>
        <ul>
            ${mappedValues.map(value => `<li><strong>${value.award.trim()}: </strong>${value.song}</li>`).join('')}
        </ul>
    `;

}

function createHTML(data) {

    // Remove first line
    parsedData.shift();

    const htmlTree = document.getElementById('html-tree');
    const h1 = document.createElement('h1');
    h1.textContent = 'Stevie Wonder Grammy Awards Wins and Nominations';
    const description = document.createElement('p');
    description.textContent = 'Bar chart with 32 bars';
    const axis = document.createElement('p');
    axis.textContent = 'The chart has 1 X axis displaying Time. Data ranges from 1967-01-01 00:00:00 to 2010-01-01 00:00:00. The chart has 1 Y axis displaying Number of awards/nominations. Data ranges from 0 to 7.';
    const ol = document.createElement('ol');

    htmlTree.appendChild(h1);
    htmlTree.appendChild(description);
    htmlTree.appendChild(axis);
    htmlTree.appendChild(ol);

    parsedData.forEach(item => {

        const year = Highcharts.dateFormat('%Y', Number(item[0]));
        const button = document.createElement('button');
        const details = document.createElement('div');
        button.textContent = `${year} details`;
        button.setAttribute('aria-expanded', 'false');
        const wins = Number(item[1]);
        const nom = Number(item[2]);
        const grammy = item[3];


        if ((wins !== 0 || nom !== 0) && !isNaN(wins) && !isNaN(nom)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${year}: ${wins} wins, ${nom} nominations. `;
            ol.appendChild(listItem);
            listItem.appendChild(button);
            listItem.appendChild(details);
        }

        button.addEventListener('click', function () {
            const details = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                details.style.display = 'none';
                button.setAttribute('aria-expanded', 'false');
            } else {
                if (details.childElementCount === 0) {
                    const grammyText = document.createElement('p');
                    grammyText.textContent = `${grammy} Grammy Awards`;
                    details.append(grammyText);
                    const winning = document.createElement('ul');
                    const nominated = document.createElement('ul');
                    const winningTitle = document.createElement('p');
                    winningTitle.textContent = 'Wins';
                    const nominatedTitle = document.createElement('p');
                    nominatedTitle.textContent = 'Nominations';
                    const songWin = item[4].split(';');
                    const songNom = item[5].split(';');
                    const awardWin = item[6].split(';');
                    const awardNom = item[7].split(';');

                    for (let i = 0; i < awardWin.length; i++) {
                        if (awardWin[i].trim().toLowerCase() !== 'none' && songWin[i].trim().toLowerCase() !== 'none') {
                            const winningAwardAndSong = document.createElement('li');
                            winningAwardAndSong.textContent = `${awardWin[i]}: ${songWin[i]}`;
                            winning.append(winningAwardAndSong);
                        }
                    }
                    for (let i = 0; i < awardNom.length; i++) {
                        if (awardNom[i].trim().toLowerCase() !== 'none' && songNom[i].trim().toLowerCase() !== 'none') {
                            const nominationAwardAndSong = document.createElement('li');
                            nominationAwardAndSong.textContent = `${awardNom[i]}: ${songNom[i]}`;
                            nominated.append(nominationAwardAndSong);
                        }
                    }
                    if (winning.childElementCount > 0) {
                        details.append(winningTitle);
                        details.append(winning);
                    }
                    if (nominated.childElementCount > 0) {
                        details.append(nominatedTitle);
                        details.append(nominated);
                    }
                }
                details.style.display = 'block';
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

createHTML(parsedData);
