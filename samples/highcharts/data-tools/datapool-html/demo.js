const container = document.querySelector('#container');
const dataPool = new Highcharts.DataPool();
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;
const getConnectorSelect = document.querySelector('#get-connector-select');
const log = document.querySelector('#log');


// Set Connector Options

const setConnectorButton = document.querySelector('#set-connector-button');
const setConnectorId = document.querySelector('#set-connector-id');
const setConnectorOptions = document.querySelector('#set-connector-options');
const setConnectorType = document.querySelector('#set-connector-type');

setConnectorButton.addEventListener('click', () => {
    const id = (
        setConnectorId.value.trim() ||
        'Untitled ' + getConnectorSelect.options.length
    );

    dataPool.setConnectorOptions({
        id,
        type: setConnectorType.value,
        options: JSON.parse(setConnectorOptions.value)
    });

    const selectOption = document.createElement('option');
    selectOption.innerText = id;
    getConnectorSelect.appendChild(selectOption);

    setConnectorId.value = (
        'My Connector ' +
        (getConnectorSelect.childNodes.length + 1)
    );
});

setConnectorType.addEventListener('input', () => {
    const options = {
        CSV: {
            csv: 'a,b,c\n1,2,3\n4,5,6',
            csvURL: null
        },
        GoogleSheets: {
            googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
            googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
        }
    }[setConnectorType.value];

    setConnectorOptions.value = JSON.stringify(options || {}, null, '  ');
});

setConnectorType.dispatchEvent(new Event('input')); // prefill options field

// Get Connector Table

const getConnectorButton = document.querySelector('#get-connector-button');

getConnectorButton.addEventListener('click', async () => {
    log.innerText = '';
    container.innerText = '';

    await delay(500);

    const timeStamp = new Date().getTime();
    log.innerText = '0ms Loading connector...\n';

    const table = await dataPool.getConnectorTable(getConnectorSelect.value);

    const timeDelta = (new Date().getTime() - timeStamp);
    log.innerText += timeDelta + 'ms Connector loaded.\n';

    renderTable(container, table);
});


function delay(milliseconds) {
    return new Promise(resolve => {
        window.setTimeout(resolve, milliseconds);
    });
}

// Render Simple HTML Table

function renderTable(container, table) {
    const html = [];

    html.push('<table>');
    html.push('<thead>');
    html.push('<tr>');
    for (const column of table.getColumnNames()) {
        html.push('<th>', escapeStringForHTML(column), '</th>');
    }
    html.push('</tr>');
    html.push('</thead>');
    html.push('<tbody>');
    for (const row of table.getRows()) {
        html.push('<tr>');
        for (const value of row) {
            html.push('<td>', escapeStringForHTML('' + value), '</td>');
        }
        html.push('</tr>');
    }
    html.push('</tbody>');
    html.push('</table>');

    container.innerHTML = html.join('');
}
