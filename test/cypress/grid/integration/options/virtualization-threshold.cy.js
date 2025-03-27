describe('Grid rows virtualizaion threshold', () => {
    before(() => {
        cy.visit('grid-pro/cypress/virtualization-threshold');
    });

    it('Should properly set rows virtualizaion based on row count.', () => {
        cy.window().its('Grid').then(({ grids }) => {
            const grid = grids[0];
            assert.isTrue(
                grid.options.rendering.rows.virtualization,
                'Virtualization should be active since the row count exceeds the default threshold.'
            );

            // Update data to lower the row count below the default
            // virtualization threshold.
            grid.update({
                dataTable: {
                    columns: {
                        Data: grid.dataTable.columns.Data.slice(0, 40)
                    }
                }
            });
            assert.isFalse(
                grid.options.rendering.rows.virtualization,
                'Virtualization should be inactive since the row count is lower than the default threshold.'
            );

            // Update virtualization manually.
            grid.update({
                rendering: {
                    rows: {
                        virtualization: true
                    }
                }
            });
            assert.isTrue(
                grid.options.rendering.rows.virtualization,
                'Virtualization should be active despite the lower row count than the default threshold.'
            );
        });
    });
});
