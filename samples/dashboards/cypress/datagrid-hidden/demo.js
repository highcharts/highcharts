const { DataTable } = Dashboards;

const container = document.getElementById('container');
const columns = {
    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    weight: [100, 40, 0.5, 200],
    price: [1.5, 2.53, 5, 4.5],
    metaData: ['a', 'b', 'c', 'd']
};


const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataTable({ columns })
});

const btn = document.querySelector('#show');

btn.addEventListener('click', () => {
    container.style.display = 'block';
});
