const svg = document.querySelector('svg'),
    indigo = svg.querySelector('#indigo'),
    darkgreen1 = svg.querySelector('#darkgreen1'),
    darkgreen2 = svg.querySelector('#darkgreen2'),
    lightgreen = svg.querySelector('#lightgreen');

const A = [41, 0], // Right wing tip
    B = [16, 60], // Tail
    C = [49, 46], // Chest
    D = [68, 38], // Neck
    F = [52, 65], // Tip of the beak
    G = [0, 17]; // Left wing tip


const draw = () => {
    indigo.setAttribute('points', [A, B, C]);
    darkgreen1.setAttribute('points', [A, C, D]);
    darkgreen2.setAttribute('points', [C, F, D]);
    lightgreen.setAttribute('points', [G, B, D]);
};

draw();

let pos = -1,
    inFlight = false,
    landing = false;

const state = () => {
    // Right wing tip
    A[0] = 51 + 10 * pos;
    A[1] = 30 + 30 * pos;

    // Left wing tip
    G[0] = 10 + 10 * pos;
    G[1] = 42 + 25 * pos;

    // Tail
    B[0] = 13 - 3 * pos;
    B[1] = 55 - 5 * pos;

    // Chest
    C[0] = 46 - 3 * pos;
    C[1] = 41 - 5 * pos;

    // Neck
    D[0] = 65 - 3 * pos;
    D[1] = 33 - 5 * pos;

    // Tip of the beak
    F[0] = inFlight ? 71 - 3 * pos : 60 + 8 * pos;
    F[1] = inFlight ? 46 - 4 * pos : 53.5 - 11.5 * pos;

    draw();
};

document.querySelector('#range').addEventListener(
    'input',
    function () {
        pos = this.value;
        state();
    }
);

let playTimer,
    angle;
document.querySelector('#play').addEventListener(
    'click',
    e => {

        if (playTimer) {
            e.target.textContent = '▶️';
            landing = true;
        } else {
            e.target.textContent = '⏸';
            playTimer = setInterval(() => {

                // Wings up
                if (landing && !inFlight && pos < -0.995) {
                    clearInterval(playTimer);
                    pos = -1;
                    playTimer = undefined;
                    landing = false;
                    state();
                    return;
                }

                if (angle === undefined) {
                    angle = Math.asin(pos);
                }
                angle += 0.1;
                pos = Math.sin(angle);

                // Wings down
                if (pos > 0.995) {
                    inFlight = !landing;
                }
                state();
            }, 16);
        }
    }
);