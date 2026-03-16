import apiClient from "./apiClient";


export const fetchTrendingProduct = () =>
    apiClient.get("/product/trending");


export const searchProducts = async (payload) => {
    const res = await apiClient.post("/product/search", payload);
    return res.data; // ✅ unwrap axios response
};

export const filterCategories = () =>
    apiClient.get("/product/filters/categories");

export const toggleLikedProduct = async (productId) => {
    const res = await apiClient.post(
        `/customer/liked-product/${productId}`,
        {}
    );
    return res.data;
};


export const updateCartProduct = async (productId, quantity) => {
    const res = await apiClient.post(
        `/customer/cart/${productId}`,
        { quantity }
    );
    return res.data;
};