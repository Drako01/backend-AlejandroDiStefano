import Handlebars from 'handlebars';

export async function registerHandlebarsHelpers() {
    Handlebars.registerHelper('reduce', function (array, prop) {
        return array.reduce((acc, item) => acc + item[prop], 0);
    });

    Handlebars.registerHelper('multiply', function (a, b) {
        return a * b;
    });

    Handlebars.noEscape = true;

    Handlebars.registerHelper('ifEqual', (a, b, options) => {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('formatDate', function (date) {
        if (!date) return '';
        const formattedDate = new Date(date).toLocaleDateString('es-AR') + ' - ' + new Date(date).toLocaleTimeString('es-AR');
        return formattedDate;
    });

    Handlebars.registerHelper('indexInArray', function(array, value, plusOne, options) {
        const index = array.indexOf(value) + (plusOne ? 1 : 0);
        return index;
    });

    Handlebars.registerHelper('counter', function(index) {
        return index + 1;
    });
}
