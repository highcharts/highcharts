DataGrid.dataGrid2('container', {
    table: {
        columns: {
            'Select all': ['<input type="checkbox" checked />'],
            Header: ['<h2>Loreum ipsum</h2>'],
            Description: ['Loreum ipsum'],
            'Nested content': [`
                <div>
                    <h3>Description</h3>
                    <p>Loreum ipsum et omnia dolores</p>
                </div>
            `],
            List: [`<ul>
                <li>Item 1</li>
                <li>Item 2</li>
            `],
            Image: ['<img src="https://www.highcharts.com/samples/graphics/sun.png" />']
        }
    }
});
