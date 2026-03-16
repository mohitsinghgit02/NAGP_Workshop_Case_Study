import { useEffect, useState } from "react";

import {
    Box,
    Container,
    Typography,
    Divider,
    CircularProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Avatar
} from "@mui/material";

import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import Footer from "../components/Footer";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { getProductsByIds, updateCartProduct } from "../api/productApi";

export default function CartPage() {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCartEmpty, setIsCartEmpty] = useState(false);

    const VAT_RATE = 0.18;

    useEffect(() => {
        loadCartProducts();
    }, []);

    /* LOAD CART */

    const loadCartProducts = async () => {

        const storage = JSON.parse(
            localStorage.getItem("cart_products") ||
            '{"cart_products":[]}'
        );

        const items = storage.cart_products || [];

        if (items.length === 0) {
            setIsCartEmpty(true);
            return;
        }

        setIsCartEmpty(false);

        const ids = items.map(i => Number(i.product_id));

        const quantityMap = {};

        items.forEach(i => {
            quantityMap[i.product_id] = i.quantity;
        });

        setLoading(true);

        try {

            const data = await getProductsByIds({
                product_ids: ids
            });

            const results = Array.isArray(data?.results)
                ? data.results
                : [];

            /* Normalize API response */

            const mergedProducts = results.map(p => ({
                id: p.id,
                name: p.productDisplayName,
                image: p.image_path,
                price: Number(p.price),
                quantity: quantityMap[p.id] || 1
            }));

            setCartProducts(mergedProducts);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    /* UPDATE LOCAL STORAGE */

    const updateLocalStorage = (updatedProducts) => {

        const cart = updatedProducts.map(p => ({
            product_id: String(p.id),
            quantity: p.quantity
        }));

        localStorage.setItem(
            "cart_products",
            JSON.stringify({ cart_products: cart })
        );

    };

    /* UPDATE QUANTITY */

    const updateQuantity = async (productId, delta) => {

        const updated = cartProducts.map(p => {

            if (p.id === productId) {

                const newQty = p.quantity + delta;

                if (newQty <= 0) return null;

                return { ...p, quantity: newQty };

            }

            return p;

        }).filter(Boolean);

        setCartProducts(updated);

        updateLocalStorage(updated);

        try {

            await updateCartProduct(productId, delta);

        } catch (err) {
            console.error(err);
        }

        if (updated.length === 0) {
            setIsCartEmpty(true);
        }

    };

    /* REMOVE ITEM */

    const removeItem = (productId) => {

        const updated = cartProducts.filter(p => p.id !== productId);

        setCartProducts(updated);

        updateLocalStorage(updated);

        if (updated.length === 0) {
            setIsCartEmpty(true);
        }

    };

    /* CALCULATIONS */

    const subtotal = cartProducts.reduce((sum, p) => {
        return sum + (p.price * p.quantity);
    }, 0);

    const vat = subtotal * VAT_RATE;

    const grandTotal = subtotal + vat;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>

            <Header onMenuClick={() => setDrawerOpen(true)} />

            <SideDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            <Container maxWidth="lg" sx={{ mt: 5 }}>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <ShoppingCartIcon color="primary" />
                    <Typography variant="h5" fontWeight={700}>
                        Your Cart
                    </Typography>
                </Stack>

                <Divider sx={{ mb: 4 }} />

                {loading && (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && isCartEmpty && (

                    <Box sx={{ textAlign: "center", py: 10 }}>

                        <RemoveShoppingCartIcon
                            sx={{ fontSize: 60, color: "#94a3b8" }}
                        />

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Nothing in your cart
                        </Typography>

                        <Typography color="text.secondary">
                            Add some products to start shopping
                        </Typography>

                    </Box>

                )}

                {!loading && !isCartEmpty && (

                    <>

                        {/* CART TABLE */}

                        <TableContainer component={Paper} elevation={0}>

                            <Table>

                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Product</b></TableCell>
                                        <TableCell align="center"><b>Price</b></TableCell>
                                        <TableCell align="center"><b>Quantity</b></TableCell>
                                        <TableCell align="center"><b>Total</b></TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>

                                    {cartProducts.map((p) => {

                                        const total = p.price * p.quantity;

                                        return (

                                            <TableRow key={p.id} hover>

                                                {/* PRODUCT INFO */}

                                                <TableCell sx={{ width: "50%" }}>

                                                    <Stack direction="row" spacing={2} alignItems="center">

                                                        <Avatar
                                                            src={p.image}
                                                            alt={p.name}
                                                            variant="rounded"
                                                            sx={{
                                                                width: 70,
                                                                height: 70,
                                                                border: "1px solid #eee"
                                                            }}
                                                        />

                                                        <Typography fontWeight={600}>
                                                            {p.name}
                                                        </Typography>

                                                    </Stack>

                                                </TableCell>

                                                <TableCell align="center">
                                                    ₹{p.price}
                                                </TableCell>

                                                {/* QUANTITY CONTROLS */}

                                                <TableCell align="center">

                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        justifyContent="center"
                                                        alignItems="center"
                                                    >

                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(p.id, -1)}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>

                                                        <Typography>
                                                            {p.quantity}
                                                        </Typography>

                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(p.id, 1)}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>

                                                    </Stack>

                                                </TableCell>

                                                <TableCell align="center">
                                                    ₹{total.toFixed(2)}
                                                </TableCell>

                                                {/* REMOVE */}

                                                <TableCell align="center">

                                                    <IconButton
                                                        color="error"
                                                        onClick={() => removeItem(p.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>

                                                </TableCell>

                                            </TableRow>

                                        );

                                    })}

                                </TableBody>

                            </Table>

                        </TableContainer>

                        {/* ORDER SUMMARY */}

                        <Box
                            sx={{
                                mt: 4,
                                display: "flex",
                                justifyContent: "flex-end"
                            }}
                        >

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    width: 340,
                                    borderRadius: 3,
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                                }}
                            >

                                <Stack spacing={1.5}>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography>Subtotal</Typography>
                                        <Typography>₹{subtotal.toFixed(2)}</Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography>VAT (18%)</Typography>
                                        <Typography>₹{vat.toFixed(2)}</Typography>
                                    </Stack>

                                    <Divider />

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography fontWeight={700}>
                                            Grand Total
                                        </Typography>

                                        <Typography fontWeight={700}>
                                            ₹{grandTotal.toFixed(2)}
                                        </Typography>
                                    </Stack>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Checkout
                                    </Button>

                                </Stack>

                            </Paper>

                        </Box>

                    </>

                )}

            </Container>

            <Footer />

        </Box>
    );
}