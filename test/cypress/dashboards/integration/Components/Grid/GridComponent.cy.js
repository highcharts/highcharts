describe('layout resize on window changes', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/component-grid');
    });

    it('The columnAssignment should be respected', () => {
        cy.get('th').should('have.length', 2);
        cy.chart().then((chart) => {
            assert.strictEqual(chart.series.length, 1, 'The chart should have only one series.');
        });
    });

    it('Chart and Grid Component should have synced hover events.', () => {
        // Arrange
        cy.get('tr.hcg-row').eq(0).as('firstGridRow');
        cy.get('tr.hcg-row').eq(1).as('secondGridRow');

        // Act - hover over Grid Component.
        cy.get('@firstGridRow').children().eq(0).trigger('mouseover');

        // Assert - hover over Grid Component.
        cy.get('@firstGridRow').should('have.class', 'hcg-hovered-row');
        cy.get('@firstGridRow').children().eq(0).should('have.class', 'hcg-hovered-column');
        cy.get('@firstGridRow').children().eq(1).should('not.have.class', 'hcg-hovered-column');
        cy.chart().then((chart) => {
            assert.notOk(chart.tooltip.isHidden, 'When hovering over Grid, chart should have tooltip.');
        });
        cy.get('@firstGridRow').children().eq(0).trigger('mouseout');

        // Act - hover over the chart.
        cy.get('.highcharts-point').eq(1).trigger('mouseover');

        // Assert - synced over the chart.
        cy.get('@firstGridRow').should('not.have.class', 'hcg-synced-row');
        cy.get('@secondGridRow').should('have.class', 'hcg-synced-row');
        cy.get('@secondGridRow').children().eq(0).should('not.have.class', 'hcg-synced-column');
        cy.get('@secondGridRow').children().eq(1).should('have.class', 'hcg-synced-column');
    });

    it('Updating of the store should work by changing chart and grid', () => {
        // Arrange
        cy.get('tr.hcg-row').eq(1).children().eq(1).as('gridCell');

        // Act
        cy.get('@gridCell').dblclick().type('{backspace}{backspace}{backspace}000').type('{enter}');

        // Assert
        cy.chart().then((chart) => {
            assert.strictEqual(
                chart.series[0].points[1].y,
                2000,
                'After updating the Grid the chart should be updated.'
            );
        });
    });

    it('Chart and Grid Component should have synced extremes events.', () => {
        // Arrange
        let containerTop;

        // Act
        cy.get('tbody')
            .invoke('scrollTop')
            .then((scrollTopValue) => {
                containerTop = scrollTopValue;
            });
        cy.get('.highcharts-dashboards-component-highcharts-content')
            .eq(0)
            .trigger('mousedown', 300)
            .trigger('mousemove', 300, 100)
            .trigger('mouseup');

        // Assert
        cy.get('tbody').then(($container) => {
            assert.ok(
                $container.scrollTop() > containerTop,
                'When selecting a range in the chart, the Grid Component should scroll.'
            );
        });
    });

    it('Toggling series visibility should change hide/show column in Grid Component', () => {
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('th').should('have.length', 1);
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('th').should('have.length', 2);
    });

    it('Grid Component should not throw error when dragging point on chart.', () => {
        cy.board().then((board) => {
            const hcComponent = board.mountedComponents[0].component,
                points = hcComponent.chart.series[0].points,
                lastPointIndex = points.length - 1;
            let error = false;

            // simulate dragging
            points[lastPointIndex].update(2000);
            // grid component
            try {
                board.mountedComponents[1].component.connectorHandlers[0].connector.getTable().emit({
                    type: 'afterSetCell'
                });
            } catch (e) {
                error = true;
            }

            assert.ok(!error, 'Error in reference to cells should not be thrown.');
        });
    });

    it('The gridOptions should be applied to the component.', () => {
        cy.get('th').eq(1).should('contain', 'Vitamin A (IU)');
    });

    it('The editableOptions should be visible in the sidebar and should show the correct values.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('Grid options').click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('General').click();

        cy.get('.highcharts-dashboards-edit-label-text').contains('Editable Grid').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Editable Grid')
            .prev()
            .find('input[type="checkbox"]')
            .should('be.checked');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Resizable columns').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Resizable columns')
            .prev()
            .find('input[type="checkbox"]')
            .should('be.checked');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Sortable columns').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Sortable columns')
            .prev()
            .find('input[type="checkbox"]')
            .should('be.checked');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Columns resizing mode').should('be.visible');
        cy.get('.highcharts-dashboards-edit-dropdown.highcharts-dashboards-edit-collapsable-content-header')
            .eq(1)
            .find('.highcharts-dashboards-edit-dropdown-button-content > span')
            .should('have.text', 'adjacent');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Cell text truncation').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Cell text truncation')
            .prev()
            .find('input[type="checkbox"]')
            .should('not.be.checked');
    });

    it('Changing options in the sidebar should update the grid.', () => {
        // Arrange
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('Grid options').click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('General').click();

        //Assert
        cy.get('.hcg-column-sortable').should('exist');

        // Act
        cy.get('.highcharts-dashboards-edit-label-text').contains('Sortable columns').prev().click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(0).click();

        // Assert
        cy.get('.hcg-column-sortable').should('not.exist');
    });

    it('Discarding changes should not be applied to the grid.', () => {
        // Assert
        cy.get('.hcg-column-sortable').should('exist');

        // Act
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('Grid options').click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('General').click();
        cy.get('.highcharts-dashboards-edit-label-text').contains('Sortable columns').prev().click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-cancel-btn').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(1).click();

        // Assert
        cy.get('.hcg-column-sortable').should('exist');
    });

    it('Applying class name to the component should work.', () => {
        cy.get('.highcharts-grid-container').should('exist');

        // Arrange
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');

        // Act
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('Grid class name').click();
        cy.get('input[name="Grid class name"]').type('-lama');
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(0).click();

        // Assert
        cy.get('.highcharts-grid-container-lama').should('exist');
    });
});
