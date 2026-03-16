import {
    Card,
    Box,
    Typography,
    IconButton,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { toggleLikedProduct, updateCartProduct } from "../api/productApi";
import AuthDialog from "./auth/AuthDialog";

export default function ProductCard({ product }) {

    const navigate = useNavigate();
    const { auth } = useAuth();

    const user = auth?.user;

    const [authOpen, setAuthOpen] = useState(false);
    const [liked, setLiked] = useState(false);

    const {
        id,
        productDisplayName,
        category,
        price,
        image_path,
    } = product;

    /* CHECK LIKE STATUS */

    const checkLiked = () => {

        const storage =
            JSON.parse(localStorage.getItem("liked_products") || '{"liked_products":[]}');

        const likedProducts = storage.liked_products || [];

        const exists = likedProducts.some(p => p.product_id == id);

        setLiked(exists);
    };

    /* RUN WHEN COMPONENT LOADS */

    useEffect(() => {
        checkLiked();
    }, [id]);

    /* RUN WHEN USER LOGIN / LOGOUT */

    useEffect(() => {
        checkLiked();
    }, [user]);

    /* LISTEN FOR LOCAL STORAGE CHANGES */

    useEffect(() => {

        const handleStorageUpdate = () => {
            checkLiked();
        };

        window.addEventListener("storage", handleStorageUpdate);

        return () => {
            window.removeEventListener("storage", handleStorageUpdate);
        };

    }, []);

    const handleOpenProduct = () => {
        navigate(`/product/${id}`, { state: product });
    };

    /* LIKE BUTTON */

    const handleLike = async (e) => {

        e.stopPropagation();

        if (!user) {
            setAuthOpen(true);
            return;
        }

        try {

            await toggleLikedProduct(id);

            let storage =
                JSON.parse(localStorage.getItem("liked_products") || '{"liked_products":[]}');

            let likedProducts = storage.liked_products || [];

            const exists = likedProducts.some(p => p.product_id == id);

            if (exists) {

                likedProducts =
                    likedProducts.filter(p => p.product_id != id);

                setLiked(false);

            } else {

                likedProducts.push({ product_id: id });

                setLiked(true);

            }

            storage.liked_products = likedProducts;

            localStorage.setItem(
                "liked_products",
                JSON.stringify(storage)
            );

        } catch (err) {

            console.error("Like API failed", err);

        }
    };

    /* CART BUTTON */

    const handleAddToCart = async (e) => {

        e.stopPropagation();

        if (!user) {
            setAuthOpen(true);
            return;
        }

        try {

            await updateCartProduct(id, 1);

            let storage =
                JSON.parse(localStorage.getItem("cart_products") || '{"cart_products":[]}');

            let cartProducts = storage.cart_products || [];

            const exists = cartProducts.some(p => p.product_id == id);

            if (exists) {

                cartProducts = cartProducts.map(p =>
                    p.product_id == id
                        ? { ...p, quantity: (p.quantity || 1) + 1 }
                        : p
                );

            } else {

                cartProducts.push({
                    product_id: id,
                    quantity: 1
                });

            }

            storage.cart_products = cartProducts;

            localStorage.setItem(
                "cart_products",
                JSON.stringify(storage)
            );

            console.log("Added to cart:", id);

        } catch (err) {

            console.error("Cart API failed", err);

        }
    };

    return (
        <>
            <Card
                onClick={handleOpenProduct}
                sx={{
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    transition: "all 0.35s ease",
                    "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 25px 45px rgba(0,0,0,0.15)",
                    },
                }}
            >

                {/* LIKE BUTTON */}
                <IconButton
                    onClick={handleLike}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                    }}
                >
                    {liked ? (
                        <FavoriteIcon fontSize="small" color="error" />
                    ) : (
                        <FavoriteBorderIcon fontSize="small" />
                    )}
                </IconButton>

                {/* CART BUTTON */}
                <IconButton
                    onClick={handleAddToCart}
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        zIndex: 2,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                    }}
                >
                    <ShoppingCartIcon fontSize="small" />
                </IconButton>

                {/* PRODUCT IMAGE */}
                <Box
                    component="img"
                    src={image_path || "/default/default-product.png"}
                    alt={productDisplayName}
                    loading="lazy"
                    sx={{
                        width: "100%",
                        aspectRatio: "2 / 3",
                        objectFit: "cover",
                        display: "block",
                    }}
                />

                {/* PRODUCT INFO */}
                <Box sx={{ p: 1.5 }}>

                    <Typography fontSize={14} fontWeight={600} noWrap>
                        {productDisplayName}
                    </Typography>

                    <Typography fontSize={12} color="text.secondary" noWrap>
                        {category}
                    </Typography>

                    <Typography fontSize={14} fontWeight="bold" sx={{ mt: 0.5 }}>
                        ₹{price?.toLocaleString("en-IN")}
                    </Typography>

                </Box>

            </Card>

            {/* AUTH DIALOG */}

            <AuthDialog
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />

        </>
    );
}