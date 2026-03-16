import { useEffect, useState } from "react";

import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    Avatar,
    Divider,
    CircularProgress,
    Stack
} from "@mui/material";

import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { searchProducts, getProductsByIds } from "../api/productApi";

export default function ProfilePage() {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [user, setUser] = useState(null);

    const [likedProducts, setLikedProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [hasLikedProducts, setHasLikedProducts] = useState(false);

    /* LOAD USER */

    useEffect(() => {

        const storedUser = localStorage.getItem("user_profile");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        loadProducts();

    }, []);

    /* LOAD PRODUCTS */

    const loadProducts = async () => {

        const likedStorage = JSON.parse(
            localStorage.getItem("liked_products") ||
            '{"liked_products":[]}'
        );

        const likedItems = likedStorage.liked_products || [];

        if (likedItems.length > 0) {

            setHasLikedProducts(true);

            const ids = likedItems.map(i => Number(i.product_id));

            await loadLikedProducts(ids);

        } else {

            setHasLikedProducts(false);

            await loadRecommendedProducts();

        }

    };

    /* LOAD LIKED PRODUCTS */

    const loadLikedProducts = async (ids) => {

        setLoading(true);

        try {

            const data = await getProductsByIds({
                product_ids: ids
            });

            const results = Array.isArray(data?.results)
                ? data.results
                : [];

            setLikedProducts(results);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    /* LOAD RECOMMENDED PRODUCTS */

    const loadRecommendedProducts = async () => {

        setLoading(true);

        try {

            const month = new Date().toLocaleString("default", { month: "long" });

            const payload = {
                query: `${month} dress for men and women`,
                page: 1,
                page_size: 16
            };

            const data = await searchProducts(payload);

            const results = Array.isArray(data?.results)
                ? data.results
                : [];

            setRecommendedProducts(results);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    if (!user) return null;

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

                {/* PROFILE SECTION */}

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        background: "#fff",
                        boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
                        mb: 6
                    }}
                >

                    <Grid container spacing={4} alignItems="center">

                        {/* AVATAR */}

                        <Grid item xs={12} md={3}>

                            <Stack alignItems="center" spacing={2}>

                                <Avatar
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        fontSize: 36,
                                        bgcolor: "#0f172a"
                                    }}
                                >
                                    {user.first_name?.charAt(0)}
                                </Avatar>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {user.first_name} {user.last_name}
                                </Typography>

                            </Stack>

                        </Grid>

                        {/* USER DETAILS */}

                        <Grid item xs={12} md={9}>

                            <Grid container spacing={3}>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <EmailIcon color="primary" />
                                        <Box>
                                            <Typography color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <PhoneIcon color="primary" />
                                        <Box>
                                            <Typography color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                {user.phone}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <LocationCityIcon color="primary" />
                                        <Box>
                                            <Typography color="text.secondary">
                                                City
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                {user.city}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <PublicIcon color="primary" />
                                        <Box>
                                            <Typography color="text.secondary">
                                                Country
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                {user.country}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>

                </Paper>

                {/* PRODUCTS SECTION */}

                <Box sx={{ mt: 4 }}>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 2 }}
                    >

                        {hasLikedProducts ? (
                            <FavoriteIcon color="error" />
                        ) : (
                            <LocalOfferIcon color="primary" />
                        )}

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >

                            {hasLikedProducts
                                ? "Your Liked Products"
                                : "Recommended For You"}

                        </Typography>

                    </Stack>

                    <Divider sx={{ mb: 4 }} />

                    {loading ? (

                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <CircularProgress />
                        </Box>

                    ) : (

                        <Grid container spacing={3}>

                            {(hasLikedProducts
                                ? likedProducts
                                : recommendedProducts
                            ).map((p) => (

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                    lg={2.4}
                                    key={p.id}
                                >
                                    <ProductCard product={p} />
                                </Grid>

                            ))}

                        </Grid>

                    )}

                </Box>

            </Container>

            <Footer />

        </Box>
    );
}