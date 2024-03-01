let parsedData = [];
Highcharts.chart('container', {
    chart: {
        type: 'column'
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
