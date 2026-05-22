describe('Pagination.', () => {
    beforeEach(() => {
        cy.viewport(1200, 800);
    });

    before(() => {
        cy.visit('grid-lite/e2e/pagination');
    });

    it('Render pagination container.', () => {
        // Check pagination wrapper is visible
        cy.get('.hcg-pagination').should('be.visible');

        // Check page info is displayed with correct initial page size
        cy.get('.hcg-pagination-info').should('be.visible');
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1');

        // Check controls buttons exist
        cy.get('.hcg-pagination-controls').should('be.visible');
        
        // Check first/last buttons
        cy.get('.hcg-button').should('have.length.at.least', 4);
        
        // Check page size selector with correct initial value
        cy.get('.hcg-pagination-page-size select.hcg-input').should('be.visible');

        // Check page number buttons
        cy.get('.hcg-pagination-pages .hcg-button').should('have.length.at.least', 1);
        cy.get('.hcg-button-selected').should('contain', '1');

        // Check initial data rows
        cy.get('table tbody tr').should('have.length', 22);
    });

    it('Next/previous button.', () => {
        // Click next page button
        cy.get('.hcg-button[title="Next page"]').click();

        // Check page info updates
        cy.get('.hcg-pagination-info').should('contain', 'Showing 23');

        // Check active page button updates
        cy.get('.hcg-button-selected').should('contain', '2');

        // Check data rows update
        cy.get('table tbody tr').should('have.length', 22);

        // Click previous button
        cy.get('.hcg-button[title="Previous page"]').click();

        // Check we're back on page 1
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1');
        cy.get('.hcg-button-selected').should('contain', '1');
    });

    it('First/last button', () => {
        // Click last button to go to last page
        cy.get('.hcg-button[title="Last page"]').click();

        // Check we're on the last page
        cy.get('.hcg-pagination-info').should('contain', 'Showing 243 - 254 of 254');

        // Check button states - last button should be disabled
        cy.get('.hcg-button[title="Last page"]').should('be.disabled');
        cy.get('.hcg-button[title="Next page"]').should('be.disabled');
        cy.get('.hcg-button[title="First page"]').should('not.be.disabled');
        cy.get('.hcg-button[title="Previous page"]').should('not.be.disabled');

        // // Click first button to go back to first page
        cy.get('.hcg-button[title="First page"]').click();
        cy.get('.hcg-button[title="Last page"]').should('not.be.disabled');
        cy.get('.hcg-button[title="Next page"]').should('not.be.disabled');

        // // Check we're back on first page
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 22 of 254');
    });

    it('Direct page number.', () => {
        // Click on page number
        cy.get('.hcg-pagination-pages .hcg-button').contains('3').click();

        // Check we're on page
        cy.get('.hcg-pagination-info').should('contain', 'Showing 45 - 66 of 254');
    });

    it('Update pagination.', () => {
        cy.window().its('Grid').then((grid) => {
            // Disable pagination
            grid.grids[0].update({
                pagination: {
                    enabled: false
                }
            });

            cy.get('.hcg-pagination').should('not.exist');
        });

        cy.window().its('Grid').then((grid) => {
            // Enable pagination
            grid.grids[0].update({
                pagination: {
                    enabled: true
                }
            });

            cy.get('.hcg-pagination').should('exist');
            cy.get('table tbody tr').should('have.length', 22);
        });
    });

    it('Page size', () => {
        // Change page size to 10
        cy.get('.hcg-pagination-page-size select.hcg-input').eq(0).select('20');

        // Check page info updates
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 20');

        // Check data rows update
        cy.get('table tbody tr').should('have.length', 20);
    });

    it('Sorted pagination.', () => {
        cy.window().its('Grid').then((grid) => {
            // Disable pagination
            grid.grids[0].update({
                pagination: {
                    pageSize: 5
                }
            });

            // Click on the name column heade to sort
            cy.get('table th[data-column-id="Name"]')
                .eq(0)
                .invoke('click');

            // First row does not contain Michael
            cy.get('table tbody tr')
                .eq(0)
                .should('not.contain', 'Michael');
        });
    });

    it('Lang support.', () => {
        cy.window().its('Grid').then((grid) => {
            // Disable pagination
            grid.grids[0].update({
                lang: {
                    pagination: {
                        pageInfo: 'Total pages {total}',
                        pageSizeLabel: 'Items per page',
                    }
                }
            });

            cy.get('.hcg-pagination-info')
                .eq(0)
                .should('contain', 'Total pages');

            cy.get('.hcg-pagination-page-size')
                .eq(0)
                .should('contain', 'Items per page');
        });
    });

    it('Position parameter - custom container.', () => {
        cy.window().its('Grid').then((grid) => {
            // Test custom container position
            grid.grids[0].update({
                pagination: {
                    enabled: true,
                    position: '#test-custom-container'
                }
            });

            // Check that custom container exists and contains pagination
            cy.get('#test-custom-container').should('exist');
            cy.get('#test-custom-container .hcg-pagination-controls')
                .should('exist');
            cy.get('#test-custom-container .hcg-pagination-info')
                .should('exist');
            cy.get('#test-custom-container .hcg-pagination-pages .hcg-button')
                .should('exist');
        });
    });

    it('Position parameter - top/bottom/footer.', () => {
        cy.window().its('Grid').then((grid) => {
            // Check that pagination container is before the table
            grid.grids[0].update({
                pagination: {
                    enabled: true,
                    position: 'top'
                }
            });

            // Check that pagination container is before the table
            cy.get('.hcg-pagination').should('exist');
            
            // Verify the DOM order: pagination should be before table
            cy.get('.hcg-container').then(async ($container) => {
                const paginationIndex =
                    $container.find('.hcg-pagination').index();
                const tableIndex = $container.find('.hcg-table').index();
                expect(paginationIndex).to.be.lessThan(tableIndex);

                // Test bottom position (default)
                await grid.grids[0].update({
                    pagination: {
                        position: 'bottom'
                    }
                });

                // Verify the DOM order: pagination should be after table
                cy.get('.hcg-container').then(($container) => {
                    const paginationIndex =
                        $container.find('.hcg-pagination').index();
                    const tableIndex = $container.find('.hcg-table').index();
                    expect(paginationIndex).to.be.greaterThan(tableIndex);

                    // Test footer position
                    grid.grids[0].update({
                        pagination: {
                            enabled: true,
                            position: 'footer',
                            pageSize: 10
                        }
                    });

                    // Check that tfoot element exists and contains pagination
                    cy.get('.hcg-table tfoot').should('exist');
                    cy.get('.hcg-table tfoot .hcg-pagination')
                        .should('exist');
                });
            });
        });
    });
});
