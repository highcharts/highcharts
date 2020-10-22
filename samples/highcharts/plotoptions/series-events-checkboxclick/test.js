function test(chart) { // eslint-disable-line no-unused-vars
    document.querySelector('#container input').dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    }));
}