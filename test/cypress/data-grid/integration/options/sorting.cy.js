describe('DataGrid events.', () => {
    before(() => {
        cy.visit('data-grid/cypress/sorting-options');
    });

    it('DataGrid should be sorted initially by price in ascending order.', () => {
        cy.get('#select-column').should('have.value', 'price');
        cy.get('#select-order').should('have.value', 'asc');

        cy.window().its('dataGrid').then(dataGrid => {
            expect(
                dataGrid.presentationTable.columns.price,
                'Price column should be sorted.',
            ).to.deep.equal([1.5, 2.53, 4.5, 5]);
        })

        cy.get('th[data-column-id="price"]').should('have.class', 'highcharts-datagrid-column-sorted-asc');
    });

    it('Should be able to turn off sorting.', () => {
        cy.get('#select-order').select('');
        cy.get('#apply-btn').click();

        cy.window().its('dataGrid').then(dataGrid => {
            expect(
                dataGrid.presentationTable.columns.price,
                'Weight column should be sorted.',
            ).to.deep.equal([1.5, 2.53, 5, 4.5]);
        })

        cy.get('th[data-column-id="price"]').should('have.not.class', 'highcharts-datagrid-column-sorted-asc');
    });

    it('Clicking on the `icon` column header should do nothing.', () => {
        cy.get('th[data-column-id="icon"]').click();

        cy.window().its('dataGrid').then(dataGrid => {
            expect(
                dataGrid.presentationTable.columns.price,
                'Weight column should be sorted.',
            ).to.deep.equal([1.5, 2.53, 5, 4.5]);
        })
    });

    it('Clicking two times on the `weight` column header should sort the table in descending order.', () => {
        cy.get('th[data-column-id="weight"]').click();
        cy.get('th[data-column-id="weight"]').click();

        cy.window().its('dataGrid').then(dataGrid => {
            expect(
                dataGrid.presentationTable.columns.weight,
                'Weight column should be sorted.',
            ).to.deep.equal([200, 100, 40, 0.5]);
        })

        cy.get('th[data-column-id="weight"]').should('have.class', 'highcharts-datagrid-column-sorted-desc');
    });

    it('Sorting the `icon` column should be possible by the code.', () => {
        cy.get('#select-column').select('icon');
        cy.get('#select-order').select('asc');
        cy.get('#apply-btn').click();

        cy.window().its('dataGrid').then(dataGrid => {
            expect(
                dataGrid.presentationTable.columns.metaData,
                'Icon column should be sorted.',
            ).to.deep.equal(['a', 'd', 'b', 'c']);
        })

        cy.get('th[data-column-id="icon"]').should('have.class', 'highcharts-datagrid-column-sorted-asc');
    });
});
