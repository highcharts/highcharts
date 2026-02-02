describe('Grid Pro - grid events.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/grid-events');
    });

    it('Grid beforeLoad event.', () => {
        cy.get('#beforeLoad').should('have.value', 'beforeLoad');
    });

    it('Grid afterLoad event.', () => {
        cy.get('#afterLoad').should('have.value', 'afterLoad');
    });

    it('Grid beforeUpdate event.', () => {
        cy.get('#beforeUpdate').should('have.value', 'beforeUpdate');
    });

    it('Grid afterUpdate event.', () => {
        cy.get('#afterUpdate').should('have.value', 'afterUpdate');
    });
    
    it('Grid beforeUpdateColumn event.', () => {
        cy.get('#beforeUpdateColumn').should('have.value', 'beforeUpdateColumn');
    });

    it('Grid afterUpdateColumn event.', () => {
        cy.get('#afterUpdateColumn').should('have.value', 'afterUpdateColumn');

        cy.get('th[data-column-id="weight"] input').should('have.value', '50');
        cy.get('th[data-column-id="weight"] select').should('have.value', 'greaterThan');
        cy.get('th[data-column-id="weight"] button').should('not.be.disabled');
    });

    it('Grid beforeRedraw event.', () => {
        cy.get('#beforeRedraw').should('have.value', 'beforeRedraw');
    });

    it('Grid afterRedraw event.', () => {
        cy.get('#afterRedraw').should('have.value', 'afterRedraw');
    });
});

describe('Grid Pro - cell and column events.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/column-cell-events');
    });

    it('Cell mouseOver / mouseOut event.', () => {
        // ColumnDefaults
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="product"]')
            .trigger('mouseover');
        cy.get('#cellMouseOver').should('have.value', 'cellMouseOver');

        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="product"]')
            .click()
            .trigger('mouseout');
        cy.get('#cellMouseOut').should('have.value', 'cellMouseOut');

        // ColumnOptions
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
            .trigger('mouseover');
        cy.get('#cellMouseOver').should('have.value', 'cellMouseOverColumnOption');

        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
            .click()
            .trigger('mouseout');
        cy.get('#cellMouseOut').should('have.value', 'cellMouseOutColumnOption');
    });

    it('Cell click event', () => {
        // ColumnDefaults
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="product"]')
            .click({force: true});
        cy.get('#cellClick').should('have.value', 'cellClick');

        // ColumnOptions
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
            .click({force: true});
        cy.get('#cellClick').should('have.value', 'cellClickColumnOption');
    });

    it('Cell dblClick event', () => {
        // ColumnDefaults
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="product"]')
            .dblclick({force: true});
        cy.get('#cellDblClick').should('have.value', 'cellDblClick');

        // ColumnOptions
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
            .dblclick({force: true});
        cy.get('#cellDblClick').should('have.value', 'cellDblClickColumnOption');
    });

    it('Cell events should fire from nested elements', () => {
        const weightCell =
            '.hcg-row[data-row-index="0"] > td[data-column-id="weight"]';

        cy.get(weightCell)
            .dblclick({force: true})
            .find('input')
            .as('weightEditor');

        cy.get('#cellClick').invoke('val', 'reset');
        cy.get('@weightEditor').click({force: true});
        cy.get('#cellClick').should('have.value', 'cellClickColumnOption');

        cy.get('#cellMouseOver').invoke('val', 'reset');
        cy.get('@weightEditor').trigger('mouseover', {force: true});
        cy.get('#cellMouseOver')
            .should('have.value', 'cellMouseOverColumnOption');

        cy.get('#cellMouseOut').invoke('val', 'reset');
        cy.get('@weightEditor').trigger('mouseout', {force: true});
        cy.get('#cellMouseOut')
            .should('have.value', 'cellMouseOutColumnOption');

        cy.get('@weightEditor').type('{enter}', {force: true});
    });

    it('AfterRender event.', () => {
        // Capture initial counter value - may vary due to prior tests
        cy.get('#cellAfterRender').then(($el) => {
            const initialCount = +$el.val();

            // Edit the weight cell at row 1 - this should trigger afterRender
            // for that specific cell (afterRender only counts row 1, weight column)
            cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
                .dblclick({force: true})
                .find('input')
                .type('1{enter}');
            cy.get('#cellAfterRender').should('have.value', String(initialCount + 1));

            // Edit again to verify it increments
            cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
                .dblclick({force: true})
                .find('input')
                .type('2{enter}');
            cy.get('#cellAfterRender').should('have.value', String(initialCount + 2));
        });
    });

    it('AfterRender header event.', () => {
        cy.get('#headerAfterRender').should('have.value', 'afterRender');
    });

    it('Cell afterEdit event', () => {
        // ColumnDefaults
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="product"]')
            .dblclick({force: true})
            .find('input')
            .clear()
            .type('Strawberries{enter}');

        cy.get('#cellAfterEdit').should('have.value', 'cellAfterEdit');

        // ColumnOptions
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]')
            .dblclick({force: true})
            .find('input')
            .clear()
            .type('4{enter}');

        cy.get('#cellAfterEdit').should('have.value', 'cellAfterEdit');
    });

    it('Resize column event.', () => {
        // ColumnDefaults
        cy.get('th[data-column-id="product"] > .hcg-column-resizer')
            .trigger('mousedown')
            .trigger('mousemove', { clientX: 300, clientY: 300 })
            .trigger('mouseup');
        cy.get('#columnResizing').should('have.value', 'columnResizing');

        // ColumnOptions
        cy.get('th[data-column-id="weight"] > .hcg-column-resizer')
            .trigger('mousedown')
            .trigger('mousemove', { clientX: 300, clientY: 300 })
            .trigger('mouseup');
        cy.get('#columnResizing').should('have.value', 'columnResizingColumnOption');
    });

    it('Sorting column event.', () => {
        // ColumnDefaults
        cy.get('th[data-column-id="product"]').first().click({ force: true });
        cy.get('#beforeColumnSorting').should('have.value', 'beforeSort');
        cy.get('#headerClick').should('have.value', 'headerClick');
        cy.get('#afterColumnSorting').should('have.value', 'afterSort');

        // ColumnOptions
        cy.get('th[data-column-id="weight"]').first().click({ force: true });
        cy.get('#beforeColumnSorting').should('have.value', 'beforeSortColumnOption');
        cy.get('#headerClick').should('have.value', 'headerClickColumnOption');
        cy.get('#afterColumnSorting').should('have.value', 'afterSortColumnOption');
    });

    it('Filtering column event.', () => {
        // ColumnDefaults
        cy.get('th[data-column-id="product"] input').first().type('Apples');
        cy.get('#beforeColumnFiltering').should('have.value', 'beforeFilter');
        cy.get('#afterColumnFiltering').should('have.value', 'afterFilter');

        // // ColumnOptions
        cy.get('th[data-column-id="weight"] input').first().type(100);
        cy.get('#beforeColumnFiltering').should('have.value', 'beforeFilterColumnOption');
        cy.get('#afterColumnFiltering').should('have.value', 'afterFilterColumnOption');
    });
});

describe('Grid Pro - virtualization and delegated events.', () => {
    before(() => {
        cy.visit('grid-pro/cypress/virtualization-events');
    });

    it('Events work on initially visible rows', () => {
        // Click a cell in the first visible row
        cy.get('.hcg-row[data-row-index="0"] > td[data-column-id="product"]')
            .click({force: true});
        cy.get('#cellClick').should('have.value', 'clicked');
        cy.get('#lastClickedRow').should('have.value', '0');

        // Mouseover should work
        cy.get('.hcg-row[data-row-index="2"] > td[data-column-id="product"]')
            .trigger('mouseover');
        cy.get('#cellMouseOver').should('have.value', 'row-2');
    });

    it('Events work after scrolling to new rows', () => {
        // Use Grid instance to calculate exact scroll position
        cy.window().its('grid').then(grid => {
            const rowHeight = grid.viewport.rowsVirtualizer.defaultRowHeight;
            const targetRowIndex = 80;
            const scrollPosition = targetRowIndex * rowHeight;

            // Scroll to the calculated position
            cy.get('#container tbody').scrollTo(0, scrollPosition);
        });

        // Wait for virtualization to render new rows
        cy.get('.hcg-row[data-row-index="80"]').should('exist');

        // Reset the click tracker
        cy.get('#cellClick').invoke('val', '');
        cy.get('#lastClickedRow').invoke('val', '');

        // Click a cell that was scrolled into view
        cy.get('.hcg-row[data-row-index="80"] > td[data-column-id="product"]')
            .click({force: true});
        cy.get('#cellClick').should('have.value', 'clicked');
        cy.get('#lastClickedRow').should('have.value', '80');

        // Mouseover should work on scrolled rows
        cy.get('.hcg-row[data-row-index="82"] > td[data-column-id="product"]')
            .trigger('mouseover');
        cy.get('#cellMouseOver').should('have.value', 'row-82');
    });

    it('Events work after scrolling back to top', () => {
        // Scroll back to top
        cy.get('#container tbody').scrollTo(0, 0);

        // Wait for virtualization to render the rows again
        cy.get('.hcg-row[data-row-index="0"]').should('exist');

        // Reset trackers
        cy.get('#cellClick').invoke('val', '');
        cy.get('#lastClickedRow').invoke('val', '');

        // Events should still work on re-rendered rows
        cy.get('.hcg-row[data-row-index="1"] > td[data-column-id="product"]')
            .click({force: true});
        cy.get('#cellClick').should('have.value', 'clicked');
        cy.get('#lastClickedRow').should('have.value', '1');
    });
});
