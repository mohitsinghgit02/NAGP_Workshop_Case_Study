import { useState, useEffect } from "react";
import { Container, Grid, Typography, Box, CircularProgress } from "@mui/material";
import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import ImageCarousel from "../components/ImageCarousel";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { fetchTrendingProduct } from "../api/productApi";

export default function Home() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetchTrendingProduct(); // axios response
                setProducts(res.data.products || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load trending products");
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    return (
        <Box
            sx={{
                backgroundColor: "#f1f5f9", // slate-100
                minHeight: "100vh",
            }}
        >
            <Header onMenuClick={() => setDrawerOpen(true)} />
            <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* 🔵 HERO */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
                    pt: { xs: 1, md: 2 },   // ✅ reduced top space
                    pb: { xs: 2, md: 3 },   // ✅ reduced bottom space
                }}
            >
                {/* Decorative fabric blob */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 360,
                        height: 360,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.2), transparent 65%)",
                        top: -140,
                        left: -140,
                        filter: "blur(60px)",
                    }}
                />

                {/* Accent blob */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 280,
                        height: 280,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle at 70% 30%, rgba(34,211,238,0.2), transparent 65%)",
                        top: -120,
                        right: -120,
                        filter: "blur(60px)",
                    }}
                />

                {/* Content */}
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        mt: 0,     // ✅ force remove margin
                        mb: 0,
                    }}
                >
                    <ImageCarousel />
                </Box>
            </Box>



            {/* 🟣 CATEGORY SECTION */}
            <Box
                sx={{
                    py: 8,
                    backgroundColor: "#0f172a",
                    backgroundImage:
                        "url('/backgrounds/dots-pattern.svg')",
                }}
            >
                <Container>
                    <Typography
                        variant="h5"
                        align="center"
                        fontWeight={700}
                        sx={{ mb: 5, color: "#fff" }}
                    >
                        Shop by Category
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <CategoryCard title="Men" image="/categories/men.png" url="/search?gender=Men" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryCard title="Women" image="/categories/women.png" url="/search?gender=Women" />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* 🟢 PRODUCTS SECTION */}
            <Box
                sx={{
                    py: 10,
                    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
                }}
            >
                <Box sx={{ mb: 6, textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={800}>
                        Trending Products
                    </Typography>
                    <Typography sx={{ color: "#475569", mt: 1 }}>
                        Hand-picked styles just for you
                    </Typography>
                </Box>

                <Box
                    sx={{
                        maxWidth: "1400px",
                        mx: "auto",
                        px: { xs: 2, sm: 3, md: 5 },
                        py: { xs: 3, md: 4 },
                        backgroundColor: "#ffffff",
                        borderRadius: 4,
                        boxShadow: "0 20px 40px rgba(15,23,42,0.08)",
                    }}
                >
                    {loading && (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Typography color="error" align="center">
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && (
                        <Grid container spacing={3}>
                            {products.map((p) => (
                                <Grid item xs={6} sm={4} md={3} key={p.id}>
                                    <ProductCard product={p} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>

            {/* ⚫ FOOTER */}
            <Footer />
        </Box>
    );
}
