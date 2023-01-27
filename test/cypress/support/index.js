Cypress.Commands.add('zoom', chartElement => {
    return cy.get(chartElement)
        .trigger('mouseenter')
        .trigger('mousedown', 50)
        .trigger('mousemove', 50, 50)
        .trigger('mouseup')
})

Cypress.Commands.add('pan', chartElement => {
    return cy.get(chartElement)
        .trigger('mouseenter')
        .trigger('mousedown', { shiftKey: true })
        .trigger('mousemove', { x: 50, y: 50, shiftKey: true })
        .trigger('mouseup')
})

Cypress.Commands.add('dashboard', () =>
    cy.window().then(win => new Cypress.Promise((resolve, reject) => {
        const D = win.Dashboards;
        if (D) {
            if (D.dashboards[0]) {
                 resolve(D.dashboards[0]);
            } else {
                const unbind = D.addEvent(D.Dashboards, 'load', function() {
                    unbind();
                    resolve(this);
                });
            }
        } else {
            reject(new Error('global Dashboards namespace is missing.'));
        }
    }))
);

Cypress.Commands.add('chart', () =>
    cy.window().then(win => new Cypress.Promise((resolve, reject) => {
        const H = win.Highcharts;
        if (H) {
            if (H.charts[0]) {
                window.setTimeout(() => resolve(H.charts[0]), 100);
            } else {
                const unbind = H.addEvent(H.Chart, 'load', function() {
                    unbind();
                    resolve(this);
                });
            }
        } else {
            reject(new Error('Global Highcharts namespace is missing.'));
        }
    }))
);

Cypress.Commands.add('openIndicators', () =>
    cy.get('.highcharts-indicators .highcharts-menu-item-btn')
        .click()
);

Cypress.Commands.add('addIndicator', () =>
    cy.get('.highcharts-popup-rhs-col')
        .children('.highcharts-popup button')
        .eq(0)
        .click()
);

Cypress.Commands.add(
    'dragTo',
    {
        prevSubject: true
    },
    (subject, toSelector, x, y, options) => {
        cy.wrap(subject).trigger(
            'mousedown',
            // Pass the trigger options object to mousedown as well for things
            // like shiftKey
            [
                x, y, options
            ].find(arg => typeof arg === 'object')
        );
        cy.get(toSelector)
            .trigger('mousemove', x, y, options)
            .trigger('mouseup', x, y, options)
            .trigger('click', x, y, options);

        // Keep the dragged element as the subject
        cy.wrap(subject);
    }
);

Cypress.Commands.add('selectIndicator', (indicator) =>
    cy.get('.highcharts-indicator-list')
        .contains(indicator)
        .click()
);

Cypress.Commands.add('selectAnnotation', (annotationClassName, parentClassName) => {

    if(parentClassName) {
        cy.get(`.${parentClassName}`).children().eq(1).click();
    }
    cy.get(`.${annotationClassName}`).click();
})

Cypress.Commands.add('selectRange', (range) =>
    cy.get('.highcharts-range-selector-group')
        .contains(range)
        .click()
);
