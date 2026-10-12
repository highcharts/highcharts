const options = {
    data: {
        columns: {
            product: ['Apples', 'Pears'],
            weight: [100, 40]
        }
    }
};

const first = Grid.grid('container', { ...options, id: 'first' });
Grid.grid('container2', { ...options, id: 'second' });

document.getElementById('destroy-btn').addEventListener('click', () => {
    first.destroy();
});
