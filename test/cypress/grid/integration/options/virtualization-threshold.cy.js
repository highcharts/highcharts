describe('Grid rows virtualizaion threshold', () => {
    before(() => {
        cy.visit('grid-pro/cypress/virtualization-threshold');
    });

    it('Should properly set rows virtualizaion based on row count.', () => {
        cy.window().its('Grid').then(async ({ grids }) => {
            const grid = grids[0];
            expect(grid.viewport.virtualRows).to.be.true;

            // Update data to lower the row count below the default
            // virtualization threshold.
            await grid.update({
                dataTable: {
                    columns: {
                        Data: grid.dataTable.columns.Data.slice(0, 40)
                    }
                }
            });
            expect(grid.viewport.virtualRows).to.be.false;

            // Update virtualization manually.
            await grid.update({
                rendering: {
                    rows: {
                        virtualization: true
                    }
                }
            });
            expect(grid.viewport.virtualRows).to.be.true;
        });
    });
});
