import { ProductService } from '../repositories/index.js';
import loggers from '../../config/logger.js'

export const generateMockProducts = async () => {
    try {
        const mockProducts = [];

        for (let i = 0; i < 100; i++) {
            const newProduct = {
                title: `Product de Prueba #${i}`,
                category: 'Tennis',
                size: 'Medium',
                code: `T${i}`,
                description: 'Descripción de prueba - Esta es una descripción de prueba para el producto generado aleatoriamente',
                price: 15249,
                stock: 10,
                thumbnail: `/img/thumbnail-1683550963927.png`,
                status: true,
            };

            mockProducts.push(newProduct);
        }

        await ProductService.insertMany(mockProducts);
        
    } catch (error) {
        loggers.error('Error al generar productos de prueba:', error);
    }
};
