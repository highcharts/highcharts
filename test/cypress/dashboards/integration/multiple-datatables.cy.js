describe('Multiple dataTables rendering', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/multiple-datatables');
    });
    const CONNECTOR_ID = 'data-connector';

    it('Render multiple dataTables.', () => {
        cy.board().then((board) => {
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

    it('Adjust multiple dataTables.', () => {
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

            assert.deepEqual(
                dataPoolOptions.columnIds,
                table.getColumnIds(),
                'The dataTable columnIds option should match the user options.'
            );

            assert.deepEqual(
                dataPoolOptions.dataModifier.type,
                table.modifier.options.type,
                'The dataTable dataModifier option should match the user options.'
            );
        });
    });

    it('Should get the proper dataTable for a component.', () => {
        cy.board().then((board) => {
            const connector = board.dataPool.connectors[CONNECTOR_ID];
            connector.components.forEach((component) => {
                assert.deepEqual(
                    connector.dataTables[component.connectorHandlers[0].options.dataTableKey].columns,
                    component.getDataTable().columns,
                    'The component dataTable columns should match based on the provided data table key.'
                );
            });
        });
    });
});
