const outer = document.getElementById('outer');
const show = document.getElementById('show');

// Create the grid while hidden.
outer.style.display = 'none';

Grid.grid('container', {
    data: {
        columns: {
            a: [1, 2, 3, 4],
            b: [1, 2, 3, 4]
        }
    }
});

show.addEventListener('click', () => {
    outer.style.display = 'block';
});
