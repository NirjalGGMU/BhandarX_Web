import apiClient from './api'

const productService = {
    // Get all products
    getAllProducts: (params) =>
        apiClient.get('/products', { params }),

    // Get product by ID
    getProductById: (id) =>
        apiClient.get(`/products/${id}`),

    // Get product by SKU
    getProductBySku: (sku) =>
        apiClient.get(`/products/sku/${sku}`),

    // Search products
    searchProducts: (query) =>
        apiClient.get('/products/search', { params: { q: query } }),

    // Create product
    createProduct: (data) =>
        apiClient.post('/products', data),

    // Update product
    updateProduct: (id, data) =>
        apiClient.put(`/products/${id}`, data),

    // Delete product
    deleteProduct: (id) =>
        apiClient.delete(`/products/${id}`),

    // Get inventory summary
    getInventorySummary: () =>
        apiClient.get('/products/inventory-summary'),

    // Get low/out of stock
    getLowStock: () =>
        apiClient.get('/products/low-stock'),

    getOutOfStock: () =>
        apiClient.get('/products/out-of-stock'),

    // Upload product images
    uploadProductImages: (id, files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('productImages', file);
        });
        return apiClient.post(`/products/${id}/images`, formData);
    }
}

export default productService
