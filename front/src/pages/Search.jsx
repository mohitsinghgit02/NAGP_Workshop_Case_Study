import { useState } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function Search() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filter, setFilter] = useState("All");

    const products = Array.from({ length: 8 }).map((_, id) => ({
        id,
        name: "Item Name",
        brand: "Brand",
        price: 1500,
        image: "/default/default-product.png",
    }));

    return (
        <Box sx={{ backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
            <Header onMenuClick={() => setDrawerOpen(true)} />
            <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* 🔍 SEARCH HEADER */}
            <Box
                sx={{
                    py: 4,
                    background:
                        "linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%)",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                size="small"
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Men">Men</MenuItem>
                                <MenuItem value="Women">Women</MenuItem>
                                <MenuItem value="T-Shirts">T-Shirts</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                placeholder="Search products..."
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* 🟢 SEARCH RESULTS */}
            <Box sx={{ py: 8 }}>
                <Box
                    sx={{
                        maxWidth: "1400px",
                        mx: "auto",
                        px: { xs: 2, sm: 3, md: 5 },
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ mb: 4, color: "#0f172a" }}
                    >
                        Search Results
                    </Typography>

                    <Grid container spacing={3}>
                        {products.map((p) => (
                            <Grid item xs={6} sm={4} md={3} key={p.id}>
                                <ProductCard product={p} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}
