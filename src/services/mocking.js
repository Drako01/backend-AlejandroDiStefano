import Product from '../models/products.model.js';

export const generateMockProducts = async () => {
    try {
        const mockProducts = [];

        for (let i = 0; i < 100; i++) {
            const newProduct = {
                title: `Product de Prueba #${i}`,
                category: 'Tennis',
                size: 'Medium',
                code: `T${i}`,
                description: 'Test Description',
                price: 15249.99,
                stock: 10,
                thumbnail: `/img/thumbnail-1683550963927.png`,
                status: true,
            };

            mockProducts.push(newProduct);
        }

        await Product.insertMany(mockProducts);
    } catch (error) {
        console.error('Error al generar productos de prueba:', error);
    }
};
