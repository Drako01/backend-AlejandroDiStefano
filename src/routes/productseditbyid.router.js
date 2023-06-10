import express from 'express';
import Product from '../models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'img'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + ext;
        cb(null, filename);
    }
});
const upload = multer({ storage });


router.get('/:pid', isAdmin, async (req, res) => {
    const userToken = req.cookies[cokieName];
    const decodedToken = jwt.verify(userToken, secret); 
    const user = decodedToken;
    try {
        const productId = req.params.pid;
        const producto = await Product.findById(productId).lean();
        if (producto) {

            res.status(200).render('productseditbyid', { producto, user });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
    }
});


router.post('/:id', upload.single('thumbnail'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, category, size, code, description, price, stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            title: title,
            category: category,
            size: size,
            code: code,
            description: description,
            price: price,
            stock: stock,
            ...(req.file ? { thumbnail: `/img/${req.file.filename}` } : {})

        });

        res.redirect(`/productseditbyid/${productId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al editar el producto');
    }
});


export default router

