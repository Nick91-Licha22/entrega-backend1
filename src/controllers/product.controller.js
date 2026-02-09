import Product from "../models/product.model.js";

export const getAllProducts = async (req, res, next) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        
        const filter = query ? { 
            $or: [
                { category: query },
                { status: query === "true" }
            ] 
        } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
        };

        const result = await Product.paginate(filter, options);

        res.status(200).json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null
        });
    } catch (error) { next(error); }
};


export const addProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        const io = req.app.get('socketio');
        io.emit('productAdded', newProduct); 
        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) { next(error); }
};

export const deleteProductById = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.pid);
        const io = req.app.get('socketio');
        io.emit('productDeleted', req.params.pid);
        res.status(200).json({ status: "success", message: "Eliminado" });
    } catch (error) { next(error); }
};