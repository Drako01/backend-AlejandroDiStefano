import { ProductService } from '../repositories/index.js';
import loggers from '../config/logger.js'
import customError from './error.log.js';

export const generateMockProducts = async () => {
    try {
        const mockProducts = [];
        let error = null; 

        for (let i = 0; i < 100; i++) {
            if (i !== error?.writeErrors?.length) {
                const newProduct = {
                    title: `Product de Prueba #${i}`,
                    category: 'Remeras',
                    size: 'S M L XL',
                    code: `T${i}`,
                    description: 'Descripción de prueba - Esta es una descripción de prueba para el producto generado aleatoriamente',
                    price: 9670,
                    stock: 100,
                    thumbnail: `/img/thumbnail-1682378644655.png`,
                    status: true,
                }
                mockProducts.push(newProduct);
            }
        }
        await ProductService.insertMany(mockProducts);

    } catch (error) {
        customError(error);
        loggers.error('Error al generar productos de prueba');
        throw error
    }
};

