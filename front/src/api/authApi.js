import apiClient from "./apiClient";

export const sendOtp = (phone) =>
    apiClient.post("/auth/send-otp", {
        identifier: phone,
    });

export const verifyOtp = (phone, otp) =>
    apiClient.post("/auth/verify-otp", {
        identifier: phone,
        otp,
    });

export const addUser = (payload) =>
    apiClient.post("/auth/user/add", payload);

export const fetchCustomer = () =>
    apiClient.get("/customer/fetch");

export const fetchLikedProducts = () =>
    apiClient.get("/customer/liked-products");

export const fetchCartProducts = () =>
    apiClient.get("/customer/cart");
