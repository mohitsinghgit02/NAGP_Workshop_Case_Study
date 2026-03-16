import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    Box,
    Container,
    Grid,
    Typography,
    CircularProgress,
    Divider,
    Paper,
    Button,
    IconButton,
    Stack
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import AuthDialog from "../components/auth/AuthDialog";

import { searchProducts, updateCartProduct } from "../api/productApi";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {

    const location = useLocation();
    const product = location.state;

    const { auth } = useAuth();
    const user = auth?.user;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [zoomStyle, setZoomStyle] = useState({});
    const [quantity, setQuantity] = useState(0);

    const [authOpen, setAuthOpen] = useState(false);

    /* SCROLL TO TOP */

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [product]);

    /* CHECK LOCAL STORAGE CART */

    useEffect(() => {

        if (!product) return;

        const storage = JSON.parse(
            localStorage.getItem("cart_products") ||
            '{"cart_products":[]}'
        );

        const items = storage.cart_products || [];

        const found = items.find(
            (i) => Number(i.product_id) === Number(product.id)
        );

        if (found) {
            setQuantity(found.quantity);
        } else {
            setQuantity(0);
        }

    }, [product]);

    /* LOAD SIMILAR PRODUCTS */

    useEffect(() => {
        if (product) loadSimilarProducts();
    }, [product]);

    const loadSimilarProducts = async () => {

        setLoading(true);

        try {

            const payload = {
                query: "",
                gender: product.gender,
                category: product.category,
                subCategory: product.subCategory,
                page: 1,
                page_size: 16,
            };

            const data = await searchProducts(payload);

            const results = Array.isArray(data?.results)
                ? data.results
                : [];

            const filtered = results.filter(
                (p) => p.id !== product.id
            );

            setSimilarProducts(filtered);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* UPDATE LOCAL STORAGE */

    const updateLocalStorage = (newQty) => {

        const storage = JSON.parse(
            localStorage.getItem("cart_products") ||
            '{"cart_products":[]}'
        );

        let items = storage.cart_products || [];

        const index = items.findIndex(
            (i) => Number(i.product_id) === Number(product.id)
        );

        if (newQty <= 0) {

            items = items.filter(
                (i) => Number(i.product_id) !== Number(product.id)
            );

        } else {

            if (index >= 0) {
                items[index].quantity = newQty;
            } else {
                items.push({
                    product_id: String(product.id),
                    quantity: newQty
                });
            }

        }

        localStorage.setItem(
            "cart_products",
            JSON.stringify({ cart_products: items })
        );
    };

    /* ADD TO CART */

    const addToCart = async () => {

        if (!user) {
            setAuthOpen(true);
            return;
        }

        const newQty = 1;

        setQuantity(newQty);
        updateLocalStorage(newQty);

        try {
            await updateCartProduct(product.id, 1);
        } catch (err) {
            console.error(err);
        }
    };

    /* UPDATE QUANTITY */

    const changeQuantity = async (delta) => {

        if (!user) {
            setAuthOpen(true);
            return;
        }

        const newQty = quantity + delta;

        if (newQty < 0) return;

        setQuantity(newQty);
        updateLocalStorage(newQty);

        try {
            await updateCartProduct(product.id, delta);
        } catch (err) {
            console.error(err);
        }
    };

    /* IMAGE ZOOM */

    const handleZoom = (e) => {

        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();

        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(1.7)"
        });
    };

    const resetZoom = () => {
        setZoomStyle({
            transform: "scale(1)"
        });
    };

    if (!product) return null;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>

            <Header onMenuClick={() => setDrawerOpen(true)} />

            <SideDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            <Container
                maxWidth={false}
                sx={{
                    px: { xs: 2, sm: 4, md: 6, lg: 8 },
                    mt: 5
                }}
            >

                {/* PRODUCT SECTION */}

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        background: "#fff",
                        boxShadow: "0 10px 35px rgba(0,0,0,0.06)"
                    }}
                >

                    <Grid container spacing={6} alignItems="flex-start">

                        {/* IMAGE */}

                        <Grid item xs={12} md={5} lg={4}>

                            <Box
                                sx={{
                                    overflow: "hidden",
                                    borderRadius: 3,
                                    background: "#fafafa",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 520
                                }}
                            >

                                <Box
                                    component="img"
                                    src={product.image_path}
                                    alt={product.productDisplayName}
                                    onMouseMove={handleZoom}
                                    onMouseLeave={resetZoom}
                                    sx={{
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        transition: "transform 0.25s ease",
                                        ...zoomStyle
                                    }}
                                />

                            </Box>

                        </Grid>

                        {/* DETAILS */}

                        <Grid item xs={12} md={7} lg={8}>

                            <Box sx={{ maxWidth: 700 }}>

                                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                    {product.productDisplayName}
                                </Typography>

                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    {product.category} • {product.subCategory}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color="primary"
                                    sx={{ mb: 3 }}
                                >
                                    ₹{product.price?.toLocaleString("en-IN")}
                                </Typography>

                                {/* CART */}

                                {quantity === 0 ? (

                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={addToCart}
                                        sx={{ mb: 3 }}
                                    >
                                        Add to Cart
                                    </Button>

                                ) : (

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{ mb: 3 }}
                                    >

                                        <IconButton
                                            onClick={() => changeQuantity(-1)}
                                            sx={{ border: "1px solid #ddd" }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>

                                        <Typography fontWeight={700} fontSize={18}>
                                            {quantity}
                                        </Typography>

                                        <IconButton
                                            onClick={() => changeQuantity(1)}
                                            sx={{ border: "1px solid #ddd" }}
                                        >
                                            <AddIcon />
                                        </IconButton>

                                    </Stack>

                                )}

                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={3}>

                                    <Grid item xs={6} md={4}>
                                        <Typography color="text.secondary">
                                            Gender
                                        </Typography>
                                        <Typography fontWeight={600}>
                                            {product.gender}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} md={4}>
                                        <Typography color="text.secondary">
                                            Color
                                        </Typography>
                                        <Typography fontWeight={600}>
                                            {product.baseColour}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} md={4}>
                                        <Typography color="text.secondary">
                                            Usage
                                        </Typography>
                                        <Typography fontWeight={600}>
                                            {product.usage}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} md={4}>
                                        <Typography color="text.secondary">
                                            Season
                                        </Typography>
                                        <Typography fontWeight={600}>
                                            {product.season}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6} md={4}>
                                        <Typography color="text.secondary">
                                            Year
                                        </Typography>
                                        <Typography fontWeight={600}>
                                            {product.year}
                                        </Typography>
                                    </Grid>

                                </Grid>

                            </Box>

                        </Grid>

                    </Grid>

                </Paper>

                {/* SIMILAR PRODUCTS */}

                <Box sx={{ mt: 8 }}>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Similar Products
                    </Typography>

                    <Divider sx={{ mb: 4 }} />

                    {loading ? (

                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <CircularProgress />
                        </Box>

                    ) : (

                        <Grid container spacing={3}>

                            {similarProducts.map((p) => (
                                <Grid item xs={6} sm={4} md={3} lg={2.4} key={p.id}>
                                    <ProductCard product={p} />
                                </Grid>
                            ))}

                        </Grid>

                    )}

                </Box>

            </Container>

            <Footer />

            {/* AUTH DIALOG */}

            <AuthDialog
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />

        </Box>
    );
}