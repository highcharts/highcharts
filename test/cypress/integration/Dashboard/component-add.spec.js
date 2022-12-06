function grabComponent(name) {
    cy.get('.hd-edit-tools-btn').contains('Add').click();
    cy.get('.hd-edit-sidebar-tab').contains('components').click();
    cy.get('.hd-edit-sidebar-tab-content')
        .children()
        .contains(name)
        .trigger('mousedown');
}

function dropComponent(elementName) {
    cy.get(elementName).first().trigger('mouseenter', {force: true});
    cy.get(elementName).first().trigger('mousemove', 'right', {force: true});
    cy.get(elementName).first().trigger('mouseup', 'right', {force: true});
}

describe('Add component through UI', () => {
    before(() => {
        cy.visit('/dashboard/cypress/add-layout');
        cy.viewport(1200, 1000);
        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('.hd-edit-toggle-slider').click();
    });

    it('should be able to add a layout', function() {
        grabComponent('layout');
        dropComponent('#dashboard-col-0');
        cy.dashboard().then((dashboard) => {
            assert.equal(
                dashboard.layouts.length,
                2,
                'New layout should be added.'
            );
        });
    });

    it('should be able to add a HTML component', function() {
        grabComponent('HTML');
        dropComponent('#dashboard-col-0');
        cy.dashboard().then((dashboard) => {
            assert.equal(
                dashboard.layouts[0].rows[0].cells.length,
                3,
                'New cell should be added.'
            );

            let m = dashboard.mountedComponents;
            assert.equal(
                m[m.length - 1].component.type,
                'HTML',
                `New component's type should be HTML`
            );
        });
    });

    it('should be able to add a chart component', function() {
        grabComponent('chart');
        dropComponent('#dashboard-col-1')
        cy.dashboard().then((dashboard) => {
            assert.equal(
                dashboard.layouts[0].rows[0].cells.length,
                4,
                'New cell should be added.'
            );

            let m = dashboard.mountedComponents;
            assert.equal(
                m[m.length - 1].component.type,
                'Highcharts',
                `New component's type should be Highcharts.`
            );
        });
    });

    it('should be possible to resize the added component', function() {
        cy.get('.hd-edit-resize-snap-x').trigger('mousedown');
        cy.get('.hd-cell').eq(1).trigger('mousemove');
        cy.get('.hd-cell').eq(1).trigger('mouseup');
        cy.dashboard().then((dashboard) => {

            let m = dashboard.mountedComponents,
                component =  m[m.length - 1];

            assert.closeTo(
                component.component.dimensions.width,
                223,
                1,
                'Width of the element should be equal to given value.'
                // Any better way of getting width?
            );
        });
    });

    // // TODO: add after the datagrid component is added
    // it('should be able to add a Data grid component', function() {
    //     grabComponent('datagrid');
    //     dropComponent('#dashboard-col-0')
    // });
});
