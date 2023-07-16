// Configurar Handlebars como motor de plantillas
import exphbs from 'express-handlebars';

const configureHandlebars = (app) => {
    const handlebarsOptions = {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    };
    app.engine(
        'handlebars',
        exphbs.engine({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            },
        })
    );
    app.set('view engine', 'handlebars');
}

export default configureHandlebars;