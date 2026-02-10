import apiClient from "./apiClient";


export const fetchTrendingProduct = () =>
    apiClient.get("/product/trending");


export const searchProducts = async (payload) => {
    const res = await apiClient.post("/product/search", payload);
    return res.data; // ✅ unwrap axios response
};

export const filterCategories = () =>
    apiClient.get("/product/filters/categories");