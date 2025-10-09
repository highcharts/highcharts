import { createEl, appendEl, setAttr, addEvent } from './../Dom.js';

export const numInput = (
    title: string,
    startVal: number,
    variant?: string
): HTMLElement => {

    // Handlers
    const incrementValue = (el: HTMLElement, inc: number) => (): void => {
        let val = Number(el.innerHTML);
        val += inc;
        el.innerHTML = val.toString();
    };

    variant = variant || 'default';

    // Groups
    const parent = createEl('div', `highcharts-uik-number-input ${variant}`);
    const buttonGroup =
        createEl('div', 'highcharts-uik-input-value-button-group');
    const valGroup = createEl('div', `highcharts-uik-number-input-value-group ${variant}`);

    // Labels
    const label = createEl('span', 'highcharts-uik-number-input-label', title);
    const valLabel =
        createEl('div', 'highcharts-uik-number-input-value', startVal);

    // Decrement button
    const decrementButton =
        createEl('div', 'highcharts-uik-input-value-button');
    const decrementIcon = createEl('img', '.highcharts-uik-input-value-icon');
    setAttr(decrementIcon, { src: '../assets/icons/minus.svg' });
    appendEl(decrementButton, decrementIcon);

    // Increment button
    const incrementButton =
        createEl('div', 'highcharts-uik-input-value-button');
    const incrementIcon = createEl('img', '.highcharts-uik-input-value-icon');
    setAttr(incrementIcon, { src: '../assets/icons/plus.svg' });
    appendEl(incrementButton, incrementIcon);

    // Events
    addEvent(incrementButton, 'click', incrementValue(valLabel, 1));
    addEvent(decrementButton, 'click', incrementValue(valLabel, -1));

    // Appends
    appendEl(valGroup, valLabel, buttonGroup);
    appendEl(buttonGroup, decrementButton, incrementButton);
    appendEl(parent, label, valGroup);

    return parent;
};
