const switchButton = document.getElementById('switch');
const cards = document.querySelectorAll('.card');
const tables = document.querySelectorAll('.table');

switchButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    cards.forEach(card => card.classList.toggle('dark'));
    tables.forEach(table => table.classList.toggle('table-dark'));
    switchButton.classList.toggle('active');


    if (document.body.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

if (localStorage.getItem('darkMode') == 'enabled') {
    document.body.classList.toggle('dark');    
    cards.forEach(card => card.classList.toggle('dark'));
    tables.forEach(table => table.classList.toggle('table-dark'));
    switchButton.classList.toggle('active');
}