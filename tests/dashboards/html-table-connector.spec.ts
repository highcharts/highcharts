import { test, expect } from '~/fixtures.ts';

const tableHTML = `<table id="data">
<tr>
    <th>Index</th>
    <th>State</th>
    <th>Score</th>
</tr>
<tr>
    <td>1</td>
    <td>HAWAII</td>
    <td>2.0</td>
</tr>
<tr>
    <td>2</td>
    <td>NEW HAMPSHIRE</td>
    <td>2.6</td>
</tr>
<tr>
    <td>2</td>
    <td>NORTH DAKOTA</td>
    <td>2.6</td>
</tr>
<tr>
    <td>4</td>
    <td>NEBRASKA</td>
    <td>2.7</td>
</tr>
<tr>
    <td>5</td>
    <td>IOWA</td>
    <td>2.8</td>
</tr>
<tr>
    <td>5</td>
    <td>VERMONT</td>
    <td>2.8</td>
</tr>
<tr>
    <td>7</td>
    <td>IDAHO</td>
    <td>2.9</td>
</tr>
<tr>
    <td>8</td>
    <td>MAINE</td>
    <td>3.0</td>
</tr>
<tr>
    <td>8</td>
    <td>WISCONSIN</td>
    <td>3.0</td>
</tr>
<tr>
    <td>10</td>
    <td>COLORADO</td>
    <td>3.1</td>
</tr>
<tr>
    <td>10</td>
    <td>MINNESOTA</td>
    <td>3.1</td>
</tr>
<tr>
    <td>10</td>
    <td>UTAH</td>
    <td>3.1</td>
</tr>
<tr>
    <td>13</td>
    <td>TENNESSEE</td>
    <td>3.2</td>
</tr>
<tr>
    <td>14</td>
    <td>INDIANA</td>
    <td>3.4</td>
</tr>
<tr>
    <td>14</td>
    <td>KANSAS</td>
    <td>3.4</td>
</tr>
<tr>
    <td>16</td>
    <td>ALABAMA</td>
    <td>3.5</td>
</tr>
<tr>
    <td>16</td>
    <td>MASSACHUSETTS</td>
    <td>3.5</td>
</tr>
<tr>
    <td>16</td>
    <td>MISSOURI</td>
    <td>3.5</td>
</tr>
<tr>
    <td>16</td>
    <td>SOUTH DAKOTA</td>
    <td>3.5</td>
</tr>
<tr>
    <td>20</td>
    <td>ARKANSAS</td>
    <td>3.7</td>
</tr>
<tr>
    <td>20</td>
    <td>FLORIDA</td>
    <td>3.7</td>
</tr>
<tr>
    <td>20</td>
    <td>VIRGINIA</td>
    <td>3.7</td>
</tr>
<tr>
    <td>23</td>
    <td>TEXAS</td>
    <td>3.9</td>
</tr>
<tr>
    <td>24</td>
    <td>MARYLAND</td>
    <td>4.0</td>
</tr>
<tr>
    <td>25</td>
    <td>MONTANA</td>
    <td>4.1</td>
</tr>
<tr>
    <td>25</td>
    <td>OKLAHOMA</td>
    <td>4.1</td>
</tr>
<tr>
    <td>25</td>
    <td>OREGON</td>
    <td>4.1</td>
</tr>
<tr>
    <td>25</td>
    <td>SOUTH CAROLINA</td>
    <td>4.1</td>
</tr>
<tr>
    <td>29</td>
    <td>WYOMING</td>
    <td>4.2</td>
</tr>
<tr>
    <td>30</td>
    <td>CALIFORNIA</td>
    <td>4.3</td>
</tr>
<tr>
    <td>31</td>
    <td>GEORGIA</td>
    <td>4.4</td>
</tr>
<tr>
    <td>31</td>
    <td>KENTUCKY</td>
    <td>4.4</td>
</tr>
<tr>
    <td>31</td>
    <td>RHODE ISLAND</td>
    <td>4.4</td>
</tr>
<tr>
    <td>34</td>
    <td>ARIZONA</td>
    <td>4.5</td>
</tr>
<tr>
    <td>34</td>
    <td>NORTH CAROLINA</td>
    <td>4.5</td>
</tr>
<tr>
    <td>34</td>
    <td>WASHINGTON</td>
    <td>4.5</td>
</tr>
<tr>
    <td>37</td>
    <td>CONNECTICUT</td>
    <td>4.6</td>
</tr>
<tr>
    <td>37</td>
    <td>DELAWARE</td>
    <td>4.6</td>
</tr>
<tr>
    <td>37</td>
    <td>LOUISIANA</td>
    <td>4.6</td>
</tr>
<tr>
    <td>37</td>
    <td>MISSISSIPPI</td>
    <td>4.6</td>
</tr>
<tr>
    <td>37</td>
    <td>NEW YORK</td>
    <td>4.6</td>
</tr>
<tr>
    <td>42</td>
    <td>MICHIGAN</td>
    <td>4.7</td>
</tr>
<tr>
    <td>42</td>
    <td>OHIO</td>
    <td>4.7</td>
</tr>
<tr>
    <td>42</td>
    <td>PENNSYLVANIA</td>
    <td>4.7</td>
</tr>
<tr>
    <td>45</td>
    <td>ILLINOIS</td>
    <td>4.8</td>
</tr>
<tr>
    <td>46</td>
    <td>NEVADA</td>
    <td>5.0</td>
</tr>
<tr>
    <td>46</td>
    <td>NEW JERSEY</td>
    <td>5.0</td>
</tr>
<tr>
    <td>48</td>
    <td>WEST VIRGINIA</td>
    <td>5.5</td>
</tr>
<tr>
    <td>49</td>
    <td>DISTRICT OF COLUMBIA</td>
    <td>6.0</td>
</tr>
<tr>
    <td>49</td>
    <td>NEW MEXICO</td>
    <td>6.0</td>
</tr>
<tr>
    <td>51</td>
    <td>ALASKA</td>
    <td>7.3</td>
</tr>
</table>`;

test.describe('HTMLTableConnector', () => {
    test('HTMLTableConnector from HTML element', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body>
                    <div id="tableContainer">${tableHTML}</div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const HTMLTableConnector = Highcharts.DataConnector.types.HTMLTable;
            const registeredEvents: string[] = [];

            const tableElement = document.getElementById('tableContainer');
            const connector =
                new HTMLTableConnector({ htmlTable: tableElement });

            connector.on('load', () => registeredEvents.push('load'));
            connector.on('afterLoad', () => registeredEvents.push('afterLoad'));

            await connector.load();

            const table = connector.getTable();
            const rowCount = table.getRowCount();
            const expectedRowCount = tableElement.querySelectorAll('tr').length - 1;

            return {
                registeredEvents,
                rowCount,
                expectedRowCount
            };
        });

        expect(result.registeredEvents).toStrictEqual(['load', 'afterLoad']);
        expect(result.rowCount).toBe(result.expectedRowCount);
    });

    test('HTMLTableConverter', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body>
                    <div id="myDivider">${tableHTML}</div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Highcharts = (window as any).Highcharts;
            const HTMLTableConverter = Highcharts.DataConverter.types.HTMLTable;

            const tableElement = document.getElementById('myDivider');
            const dataconverter = new HTMLTableConverter({ tableElement });

            let afterParseTriggered = false;

            dataconverter.on('afterParse', () => {
                afterParseTriggered = true;
            });

            dataconverter.parse();

            return {
                afterParseTriggered,
                tableElementID: dataconverter.tableElementID,
                expectedID: tableElement.id
            };
        });

        expect(result.afterParseTriggered).toBe(true);
        expect(result.tableElementID).toBe(result.expectedID);
    });

    test('Export as HTML', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body>
                    <div id="container"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const HTMLTableConnector = Highcharts.DataConnector.types.HTMLTable;
            const CSVConnector = Highcharts.DataConnector.types.CSV;

            const csv = `identifier,Range (low),Range (mid),Range (high),something else,Range (ultra)
1,2,5,10,"Blue",22`;

            // Load the table from the CSV
            const csvconnector = new CSVConnector({ csv });
            await csvconnector.load();

            const connector = new HTMLTableConnector({
                dataTables: [{
                    columns: csvconnector.getTable().getColumns()
                }]
            });
            const converter = connector.converter;

            // Export with default settings (multiline and rowspan should be enabled)
            let htmlExport = converter.export(connector);

            const tableElement = document.createElement('div');
            tableElement.innerHTML = htmlExport;

            const defaultHeadRowCount = tableElement.querySelectorAll('thead tr').length;

            // Multilevel headers disabled
            htmlExport = converter.export(connector, {
                useMultiLevelHeaders: false
            });
            tableElement.innerHTML = htmlExport;

            const singleHeadRowCount = tableElement.querySelectorAll('thead tr').length;
            const colspanCount = tableElement.querySelectorAll('th[colspan]').length;
            const rowspanCount = tableElement.querySelectorAll('th[rowspan]').length;

            // table caption
            htmlExport = converter.export(connector, {
                useMultiLevelHeaders: false,
                tableCaption: 'My Data Table'
            });

            tableElement.innerHTML = htmlExport;
            const captionCount =
                tableElement.querySelectorAll('caption').length;
            const captionText =
                tableElement.querySelector('caption')?.innerText;

            // Make sure exported table is parseable, returns same result
            const connectorWithExport =
                new HTMLTableConnector({ htmlTable: tableElement });

            let loadError = false;
            let exportedMatchesOriginal = false;

            connectorWithExport.on('loadError', () => {
                loadError = true;
            });

            try {
                await connectorWithExport.load();
                exportedMatchesOriginal =
                    converter.export(connectorWithExport) ===
                    converter.export(connector);
            } catch {
                loadError = true;
            }

            return {
                defaultHeadRowCount,
                singleHeadRowCount,
                colspanCount,
                rowspanCount,
                captionCount,
                captionText,
                loadError,
                exportedMatchesOriginal
            };
        });

        expect(result.defaultHeadRowCount).toBe(2);
        expect(result.singleHeadRowCount).toBe(1);
        expect(result.colspanCount).toBe(0);
        expect(result.rowspanCount).toBe(0);
        expect(result.captionCount).toBe(1);
        expect(result.captionText).toBe('My Data Table');
        expect(result.loadError).toBe(false);
        expect(result.exportedMatchesOriginal).toBe(true);
    });
});
