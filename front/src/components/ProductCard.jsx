import {
    Card,
    Box,
    Typography,
    IconButton,
    Button,
    Stack
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
    const [cartQty, setCartQty] = useState(0);

    const {
        id,
        productDisplayName,
        category,
        price,
        image_path,
    } = product;

    /* ------------------- */
    /* CHECK LIKE STATUS */
    /* ------------------- */

    const checkLiked = () => {

        const storage =
            JSON.parse(localStorage.getItem("liked_products") || '{"liked_products":[]}');

        const likedProducts = storage.liked_products || [];

        const exists = likedProducts.some(p => p.product_id == id);

        setLiked(exists);
    };

    /* ------------------- */
    /* CHECK CART STATUS */
    /* ------------------- */

    const checkCart = () => {

        const storage =
            JSON.parse(localStorage.getItem("cart_products") || '{"cart_products":[]}');

        const cartProducts = storage.cart_products || [];

        const item = cartProducts.find(p => p.product_id == id);

        setCartQty(item ? item.quantity : 0);
    };

    /* ------------------- */
    /* INITIAL LOAD */
    /* ------------------- */

    useEffect(() => {

        checkLiked();
        checkCart();

    }, [id, user]);

    /* ------------------- */
    /* OPEN PRODUCT */
    /* ------------------- */

    const handleOpenProduct = () => {

        navigate(`/product/${id}`, { state: product });

    };

    /* ------------------- */
    /* LIKE BUTTON */
    /* ------------------- */

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

    /* ------------------- */
    /* UPDATE CART */
    /* ------------------- */

    const updateCart = async (newQty) => {

        let storage =
            JSON.parse(localStorage.getItem("cart_products") || '{"cart_products":[]}');

        let cartProducts = storage.cart_products || [];

        const index = cartProducts.findIndex(p => p.product_id == id);

        if (newQty <= 0) {

            cartProducts =
                cartProducts.filter(p => p.product_id != id);

        } else {

            if (index !== -1) {

                cartProducts[index].quantity = newQty;

            } else {

                cartProducts.push({
                    product_id: id,
                    quantity: newQty
                });

            }
        }

        storage.cart_products = cartProducts;

        localStorage.setItem(
            "cart_products",
            JSON.stringify(storage)
        );

        setCartQty(newQty);

        try {

            await updateCartProduct(id, newQty);

        } catch (err) {

            console.error("Cart API failed", err);

        }
    };

    /* ------------------- */
    /* ADD TO CART */
    /* ------------------- */

    const handleAddToCart = (e) => {

        e.stopPropagation();

        if (!user) {
            setAuthOpen(true);
            return;
        }

        updateCart(1);
    };

    const increaseQty = (e) => {

        e.stopPropagation();

        updateCart(cartQty + 1);
    };

    const decreaseQty = (e) => {

        e.stopPropagation();

        updateCart(cartQty - 1);
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

                {/* CART CONTROLS */}

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        zIndex: 2
                    }}
                >

                    {cartQty === 0 ? (

                        <IconButton
                            onClick={handleAddToCart}
                            sx={{
                                backgroundColor: "#fff",
                                boxShadow: 2
                            }}
                        >
                            <ShoppingCartIcon fontSize="small" />
                        </IconButton>

                    ) : (

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{
                                background: "#fff",
                                borderRadius: 2,
                                px: 1,
                                boxShadow: 2
                            }}
                        >

                            <IconButton size="small" onClick={decreaseQty}>
                                <RemoveIcon fontSize="small" />
                            </IconButton>

                            <Typography fontSize={14} fontWeight={600}>
                                {cartQty}
                            </Typography>

                            <IconButton size="small" onClick={increaseQty}>
                                <AddIcon fontSize="small" />
                            </IconButton>

                        </Stack>

                    )}

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