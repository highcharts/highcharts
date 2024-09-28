describe('layout resize on window changes', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/component-datagrid');
    });

    it('The columnAssignment should be respected', () => {
        cy.get('th').should('have.length', 2);
        cy.chart().then((chart) => {
            assert.strictEqual(chart.series.length, 1, 'The chart should have only one series.');
        });
    });

    it('Chart and DataGridComponent should have synced hover events.', () => {
        // Arrange
        cy.get('tr.highcharts-datagrid-row').eq(0).as('firstDataGridRow');
        cy.get('tr.highcharts-datagrid-row').eq(1).as('secondDataGridRow');

        // Act - hover over DataGridComponent.
        cy.get('@firstDataGridRow').children().eq(0).trigger('mouseover');

        // Assert - hover over DataGridComponent.
        cy.get('@firstDataGridRow').should('have.class', 'highcharts-datagrid-hovered-row');
        cy.get('@firstDataGridRow').children().eq(0).should('have.class', 'highcharts-datagrid-hovered-column');
        cy.get('@firstDataGridRow').children().eq(1).should('not.have.class', 'highcharts-datagrid-hovered-column');
        cy.chart().then((chart) => {
            assert.notOk(chart.tooltip.isHidden, 'When hovering over DataGrid, chart should have tooltip.');
        });

        // Act - hover over the chart.
        cy.get('.highcharts-point').eq(1).trigger('mouseover');

        // Assert - hover over the chart.
        cy.get('@firstDataGridRow').should('not.have.class', 'highcharts-datagrid-hovered-row');
        cy.get('@secondDataGridRow').should('have.class', 'highcharts-datagrid-hovered-row');
        cy.get('@secondDataGridRow').children().eq(0).should('not.have.class', 'highcharts-datagrid-hovered-column');
        cy.get('@secondDataGridRow').children().eq(1).should('have.class', 'highcharts-datagrid-hovered-column');
    });

    it('Updating of the store should work by changing chart and datagrid', () => {
        // Arrange
        cy.get('tr.highcharts-datagrid-row').eq(1).children().eq(1).as('dataGridCell');

        // Act
        cy.get('@dataGridCell').dblclick().type('{backspace}{backspace}{backspace}000').type('{enter}');

        // Assert
        cy.chart().then((chart) => {
            assert.strictEqual(
                chart.series[0].points[1].y,
                2000,
                'After updating the Data Grid the chart should be updated.'
            );
        });
    });

    it('Chart and DataGridComponent should have synced extremes events.', () => {
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
                'When selecting a range in the chart, the DataGridComponent should scroll.'
            );
        });
    });

    it('Toggling series visibility should change hide/show column in DataGridComponent', () => {
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('th').should('have.length', 1);
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('th').should('have.length', 2);
    });

    it('DataGridComponent should not throw error when dragging point on chart.', () => {
        cy.board().then((board) => {
            const hcComponent = board.mountedComponents[0].component,
                points = hcComponent.chart.series[0].points,
                lastPointIndex = points.length - 1;
            let error = false;

            // simulate dragging
            points[lastPointIndex].update(2000);
            // datagrid component
            try {
                board.mountedComponents[1].component.connectorHandlers[0].connector.table.emit({
                    type: 'afterSetCell'
                });
            } catch (e) {
                error = true;
            }

            assert.ok(!error, 'Error in reference to cells should not be thrown.');
        });
    });

    it('The dataGridOptions should be applied to the component.', () => {
        cy.get('th').eq(1).should('have.text', 'Vitamin A (IU)');
    });

    it('The editableOptions should be visible in the sidebar and should show the correct values.', () => {
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('DataGrid options').click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('General').click();

        cy.get('.highcharts-dashboards-edit-label-text').contains('Editable DataGrid').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Editable DataGrid')
            .next()
            .find('input[type="checkbox"]')
            .should('be.checked');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Resizable columns').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Resizable columns')
            .next()
            .find('input[type="checkbox"]')
            .should('be.checked');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Sortable columns').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Sortable columns')
            .next()
            .find('input[type="checkbox"]')
            .should('be.checked');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Columns distribution').should('be.visible');
        cy.get('.highcharts-dashboards-edit-dropdown.highcharts-dashboards-edit-collapsable-content-header')
            .eq(1)
            .find('.highcharts-dashboards-edit-dropdown-button-content > span')
            .should('have.text', 'full');

        cy.get('.highcharts-dashboards-edit-label-text').contains('Cell text truncation').should('be.visible');
        cy.get('.highcharts-dashboards-edit-label-text')
            .contains('Cell text truncation')
            .next()
            .find('input[type="checkbox"]')
            .should('not.be.checked');
    });

    it('Changing options in the sidebar should update the grid.', () => {
        // Arrange
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('DataGrid options').click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('General').click();

        //Assert
        cy.get('.highcharts-datagrid-column-sortable').should('exist');

        // Act
        cy.get('.highcharts-dashboards-edit-label-text').contains('Sortable columns').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(0).click();

        // Assert
        cy.get('.highcharts-datagrid-column-sortable').should('not.exist');
    });

    it('Discarding changes should not be applied to the grid.', () => {
        // Assert
        cy.get('.highcharts-datagrid-column-sortable').should('exist');

        // Act
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('DataGrid options').click();
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('General').click();
        cy.get('.highcharts-dashboards-edit-label-text').contains('Sortable columns').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-cancel-btn').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(1).click();

        // Assert
        cy.get('.highcharts-datagrid-column-sortable').should('exist');
    });

    it('Applying class name to the component should work.', () => {
        cy.get('.dataGrid-container').should('exist');

        // Arrange
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-col-1');

        // Act
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').contains('DataGrid class name').click();
        cy.get('input[name="DataGrid class name"]').type('-lama');
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').eq(0).click();

        // Assert
        cy.get('.dataGrid-container-lama').should('exist');
    });
});
