describe('Grid sorting.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/sorting-options');
    });

    it('Grid should be sorted initially by price in ascending order.', () => {
        cy.get('#select-column').should('have.value', 'price');
        cy.get('#select-order').should('have.value', 'asc');

        cy.window().its('grid').then(grid => {
            expect(
                grid.presentationTable.columns.price,
                'Price column should be sorted.',
            ).to.deep.equal([1.5, 2.53, 4.5, 5]);
        })

        cy.get('th[data-column-id="price"]').should('have.class', 'hcg-column-sorted-asc');
    });

    it('Should be able to turn off sorting.', () => {
        cy.get('#select-order').select('');
        cy.get('#apply-btn').click();

        cy.window().its('grid').then(grid => {
            expect(
                grid.presentationTable.columns.price,
                'Weight column should be sorted.',
            ).to.deep.equal([1.5, 2.53, 5, 4.5]);
        })

        cy.get('th[data-column-id="price"]').should('have.not.class', 'hcg-column-sorted-asc');
    });

    it('Clicking on the `icon` column header should do nothing.', () => {
        cy.get('th[data-column-id="icon"]').click();

        cy.window().its('grid').then(grid => {
            expect(
                grid.presentationTable.columns.price,
                'Weight column should be sorted.',
            ).to.deep.equal([1.5, 2.53, 5, 4.5]);
        })
    });

    it('Clicking two times on the `weight` column header should sort the table in descending order.', () => {
        cy.get('th[data-column-id="weight"]').click();
        cy.get('th[data-column-id="weight"]').click();

        cy.window().its('grid').then(grid => {
            expect(
                grid.presentationTable.columns.weight,
                'Weight column should be sorted.',
            ).to.deep.equal([200, 100, 40, 0.5]);

            expect(
                grid.columnOptionsMap.weight.options.sorting.order,
                'Weight column sorting options should be updated.'
            ).to.equal('desc');
        })

        cy.get('th[data-column-id="weight"]').should('have.class', 'hcg-column-sorted-desc');
    });

    it('Sorting the `icon` column should be possible by the code.', () => {
        cy.get('#select-column').select('icon');
        cy.get('#select-order').select('asc');
        cy.get('#apply-btn').click();

        cy.window().its('grid').then(grid => {
            expect(
                grid.presentationTable.columns.metaData,
                'Icon column should be sorted.',
            ).to.deep.equal(['a', 'd', 'b', 'c']);
        })

        cy.get('th[data-column-id="icon"]').should('have.class', 'hcg-column-sorted-asc');
    });

    it('Editing a cell in sorted column should resort the table.', () => {
        cy.get('th[data-column-id="weight"]').click();
        cy.get('tr[data-row-index="1"] td[data-column-id="weight"]')
            .dblclick()
            .find('input')
            .type('000{enter}');

        cy.window().its('grid').then(grid => {
            const { rows } = grid.viewport;
            const lastRow = rows[rows.length - 1];

            expect(
                lastRow.cells[0].value,
                'Last rendered row should be `Pears`.',
            ).to.equal('Pears');

            expect(
                grid.presentationTable.columns.weight,
                'Weight column should be sorted.',
            ).to.deep.equal([0.5, 100, 200, 40000]);
        });
    });
});
