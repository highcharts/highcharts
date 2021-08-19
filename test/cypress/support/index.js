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

Cypress.Commands.add('chart', () =>
    cy.window().then(win => new Cypress.Promise((resolve, reject) => {
        const H = win.Highcharts;
        if (H) {
            if (H.charts[0]) {
                resolve(H.charts[0]);
            } else {
                const unbind = H.addEvent(H.Chart, 'load', function() {
                    unbind();
                    resolve(this);
                });
            }
        } else {
            reject(new Error('No Highcharts :('));
        }
    }))
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
