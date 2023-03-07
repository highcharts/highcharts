// eslint-disable-next-line no-underscore-dangle
const BasePopup = Highcharts._modules['Extensions/BasePopup.js'],
    iconURL = 'https://code.highcharts.com/10.3.3/gfx/stock-icons/',
    container = document.getElementById('container');

const popup = new BasePopup(container, iconURL);

document.getElementById('button').addEventListener('click', function () {
    popup.showPopup();
});