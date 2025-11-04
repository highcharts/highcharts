const demos = [
    {
        image: 'demo1.png',
        name: 'Pie chart',
        desc: 'Pie charts are very popular'
    },
    {
        image: 'demo2.png',
        name: 'Column chart',
        desc: 'Column charts are great'
    },
    {
        image: 'demo3.png',
        name: 'Line chart',
        desc: 'Line charts show trends clearly over time or ordered categories.'
    },
    {
        image: 'demo4.png',
        name: 'Bar chart',
        desc: 'Bar charts display data'
    },
    {
        image: 'demo5.png',
        name: 'Area chart',
        desc: 'Area charts emphasize magnitude of change over time.'
    }
];

const imgEl = document.getElementById('demoImage');
const nameEl = document.getElementById('demoName');
const descEl = document.getElementById('demoDescription');
const pagination = document.getElementById('pagination');

let currentIndex = 0;
let interval;

// Build pagination dots
demos.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) {
        dot.classList.add('active');
    }
    dot.addEventListener('click', () => goToDemo(i));
    pagination.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateView() {
    const demo = demos[currentIndex];
    imgEl.src = demo.image;
    nameEl.textContent = demo.name;
    descEl.textContent = demo.desc;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

function nextDemo() {
    currentIndex = (currentIndex + 1) % demos.length;
    updateView();
    resetInterval();
}

function goToDemo(i) {
    currentIndex = i;
    updateView();
    resetInterval();
}

function startAuto() {
    interval = setInterval(nextDemo, 4000);
}

function resetInterval() {
    clearInterval(interval);
    startAuto();
}

document.getElementById('nextBtn').addEventListener('click', nextDemo);
startAuto();