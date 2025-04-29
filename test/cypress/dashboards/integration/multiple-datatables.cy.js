describe('Multiple dataTables rendering', () => {
    before(() => {
        cy.visit('/dashboards/cypress/multiple-datatables');
    });
    const CONNECTOR_ID = 'data-connector';

    it('Should render multiple dataTables properly.', () => {
        cy.board().then((board) => {
            console.info(board);
            const DATA_TABLE_KEY = 'kpis';
            const connector = board.dataPool.connectors[CONNECTOR_ID];
            const dataTablesArray = Object.values(connector.dataTables);

            expect(
                dataTablesArray.length,
                'Should render a proper dataTables amount.'
            ).to.equal(2);

            assert.deepEqual(
                connector.getTable(),
                dataTablesArray[0],
                'Should retrieve a proper first dataTable instance.'
            );

            assert.deepEqual(
                connector.getTable(DATA_TABLE_KEY),
                connector.dataTables[DATA_TABLE_KEY],
                'Should retrieve a proper dataTable instance based on key.'
            );
        });
    });

    it('Should adjust multiple dataTables options properly.', () => {
        cy.board().then((board) => {
            const DATA_TABLE_KEY = 'kpis';
            const dataPool = board.dataPool;
            const dataPoolOptions = dataPool.options.connectors.find(
                (connector) => connector.id === CONNECTOR_ID
            ).dataTables.find(
                (table) => table.key === DATA_TABLE_KEY
            );
            const table =
                dataPool.connectors[CONNECTOR_ID].getTable(DATA_TABLE_KEY);

            assert.equal(
                dataPoolOptions.firstRowAsNames,
                table.firstRowAsNames,
                'The dataTable firstRowAsNames option should match the user options.'
            );

            assert.equal(
                dataPoolOptions.columnNames,
                table.columnNames,
                'The dataTable columnNames option should match the user options.'
            );

            assert.deepEqual(
                dataPoolOptions.dataModifier,
                table.dataModifier,
                'The dataTable dataModifier option should match the user options.'
            );
        });
    });

    it('Should get the proper dataTable for a component.', () => {
        cy.board().then((board) => {
            const connector = board.dataPool.connectors[CONNECTOR_ID];
            connector.components.forEach((component) => {
                assert.deepEqual(
                    connector.dataTables[component.dataTableKey].columns,
                    component.connectorHandlers[0].presentationTable.columns,
                    'The component dataTable columns should match based on the provided data table key.'
                );
            });
        });
    });
});
