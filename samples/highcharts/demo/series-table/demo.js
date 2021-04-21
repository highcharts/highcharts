const chart = Highcharts.chart('container', {
    series: [
        {
            name: 'Series with table sync'
        }
    ],
    title: {
        text: 'Series table demo'
    },
    tooltip: {
        formatter: function () {
            const point = this.point;
            const row = point.series.table.getRowObject(point.index);

            return Object
                .keys(row)
                .sort()
                .map(
                    function (key) {
                        return key + ': ' + row[key];
                    }
                )
                .join('<br />');
        }
    }
});
const formTableBody = document.getElementById('table-body');

// change a series row with data from the HTML form
function change() {
    const formInputs = this.getElementsByTagName('input');
    const index = parseInt(this.getAttribute('data-index'), 10);
    const name = formInputs[0].value;
    const seriesTable = chart.series[0].table;
    const x = parseFloat(formInputs[1].value);
    const y = parseFloat(formInputs[2].value);

    seriesTable.setRow({ name, x, y }, index);
}

// add a series row with data from the HTML form
function add() {
    const formInputs = this.getElementsByTagName('input');
    const formTableRow = document.createElement('tr');
    const name = formInputs[0].value;
    const seriesTable = chart.series[0].table;
    const x = parseFloat(formInputs[1].value);
    const y = parseFloat(formInputs[2].value);

    formTableRow.setAttribute('data-index', seriesTable.getRowCount());
    formTableRow.innerHTML = [
        `<td><input type="text" value="${name}"" /></td>`,
        `<td><input type="number" value="${x}"" /></td>`,
        `<td><input type="number" value="${y}"" /></td>`,
        `<td><button type="button">Change</button></td>`
    ].join('');
    formTableRow.childNodes[3].addEventListener('click', change.bind(formTableRow));
    formTableBody.appendChild(formTableRow);

    seriesTable.setRow({ name, x, y });
}

// connect HTML form
const htmlButtonAdd = document.getElementById('button-add');
htmlButtonAdd.addEventListener('click', add.bind(htmlButtonAdd.parentNode.parentNode));
