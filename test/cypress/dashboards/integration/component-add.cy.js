function grabComponent(name) {
    cy.get('.highcharts-dashboards-edit-tools-btn').contains('Add').click();
    cy.get('.highcharts-dashboards-edit-grid-items')
        .children()
        .contains(name)
        .trigger('mousedown');
}

function dropComponent(elementName) {
    cy.get(elementName).first().trigger('mouseenter', {force: true});
    cy.get(elementName).first().trigger('mousemove', 'right', {force: true});
    cy.get(elementName).first().trigger('mouseup', 'right', {force: true});
}

describe('Add components through UI', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/add-layout');
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
    });

    it('should be able to add a layout', function() {
        grabComponent('layout');
        dropComponent('#dashboard-col-0');
        cy.board().then((board) => {
            assert.equal(
                board.layouts.length,
                2,
                'New layout should be added.'
            );
        });
    });

    it('should be able to add a HTML component', function() {

        // drop next to datagrid
        grabComponent('HTML');
        dropComponent('#dashboard-col-2');
        cy.hideSidebar(); // Hide sidebar to avoid interference with the next test.

        // drop between two top cells
        grabComponent('HTML');
        dropComponent('#dashboard-col-1');

        cy.hideSidebar(); // Hide sidebar to avoid interference with the next test.
        cy.board().then((board) => {
            assert.equal(
                board.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added in the first row.'
            );

            assert.equal(
                board.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added in the second row.'
            );

            const m = board.mountedComponents;
            assert.equal(
                m[m.length - 1].component.type,
                'HTML',
                `New component's type should be 'HTML'`
            );

            // HTML next to datagrid
            const rowHeight = m[m.length - 2].cell.row.container.getBoundingClientRect().height;
            const cellContentHeight = m[m.length - 2].component.contentElement.getBoundingClientRect().height;

            assert.ok(
                rowHeight > cellContentHeight,
                'The HTML Component has the same height as DataGrid'
            );

            // HTML Component next to containers
            const firstCellHeight = m[0].component.contentElement.getBoundingClientRect().height;
            const secondCellHeight = m[m.length - 1].component.contentElement.getBoundingClientRect().height;

            assert.ok(
                firstCellHeight === secondCellHeight,
                'The HTML Component has the same height as siblings'
            );
        });
        cy.get('#dashboard-col-0').children().click()
        cy.get('.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell').children().should('be.visible')
    });

    it('should be able to add a chart component and resize it', function() {
        grabComponent('chart');
        dropComponent('#dashboard-col-0')
        cy.hideSidebar(); // Hide sidebar to avoid interference with the next test.
        cy.board().then((board) => {
            assert.equal(
                board.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added.'
            );

            const m = board.mountedComponents,
                component =  m[m.length - 1].component;
            assert.equal(
                component.type,
                'Highcharts',
                `New component's type should be 'Highcharts'.`
            );

            // check values connector
            assert.equal(
                component.chart.series.length > 0,
                true,
                `Highcharts should display values from CSV data table.`
            );
        });
    });

    it('DataGrid component should be added.', function() {
        grabComponent('datagrid');
        dropComponent('#dashboard-col-0')
        cy.hideSidebar(); // Hide sidebar to avoid interference with the next test.
        cy.board().then((board) => {
            assert.equal(
                board.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added.'
            );
            const m = board.mountedComponents,
                component = m[m.length - 1].component;
            assert.equal(
                component.type,
                'DataGrid',
                `New component's type should be 'DataGrid'.`
            );

            // check values connector
            assert.deepEqual(
                m[m.length - 2].component.dataGrid.columnNames,
                component.dataGrid.columnNames,
                `DataGrid should display values from CSV data table.`
            );
        });
    });

    it('KPI component is added.', function() {
        grabComponent('KPI');
        dropComponent('#dashboard-col-0')
        cy.hideSidebar(); // Hide sidebar to avoid interference with the next test.
        cy.board().then((board) => {
            assert.equal(
                board.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added.'
            );
            const m = board.mountedComponents,
                component = m[m.length - 1].component;
            assert.equal(
                component.type,
                'KPI',
                `New component's type should be 'KPI'.`
            );
        });
    });

    it('The component is added to empty dashboard.', function() {

        cy.get('#dashboard-col-0').click({ force: true });
        cy.get('.highcharts-dashboards-edit-menu-destroy').first().click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').click();

        cy.get('#dashboard-col-2').click({ force: true });
        cy.get('.highcharts-dashboards-edit-menu-destroy').first().click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').click();

        grabComponent('chart');
        dropComponent('.highcharts-dashboards-wrapper');
        cy.hideSidebar(); // Hide sidebar to avoid interference with the next test.
        cy.board().then((board) => {
            assert.equal(
                board.layouts[0].rows[0].cells.length,
                1,
                'New cell should be added.'
            );
            const m = board.mountedComponents,
                component = m[m.length - 1].component;

            assert.equal(
                component.type,
                'Highcharts',
                `New component's type should be 'Highcharts'.`
            );
        });
    });
});

describe('Edit mode with toolbars disabled', () => {
    before(() => {
        cy.visit('/dashboards/edit-mode/toolbars-disabled');
        cy.toggleEditMode();
    });

    it('Add component button should not exist.', () => {
        cy.get('.highcharts-dashboards-edit-tools-btn').contains('Add').should('not.exist');
    });
});

describe('Edit mode with buttons disabled', () => {
    before(() => {
        cy.visit('/dashboards/edit-mode/buttons-disabled');
        cy.toggleEditMode();
    });

    it('Edit tools buttons should not exist.', () => {
        cy.get('.highcharts-dashboards-edit-tools-btn').should('not.exist');
    });
});
