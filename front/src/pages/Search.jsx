import { useEffect, useRef, useState } from "react";
import {
    Box,
    Container,
    Grid,
    TextField,
    MenuItem,
    InputAdornment,
    Button,
    Slider,
    CircularProgress,
    Typography,
    IconButton,
    Popover,
    Chip,
    Badge,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { searchProducts } from "../api/productApi";

const PAGE_SIZE = 20;
const DEFAULT_QUERY = "apparel";

export default function Search() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    /* ---------------- FILTER STATE ---------------- */
    const [query, setQuery] = useState("");
    const [gender, setGender] = useState("All");
    const [category, setCategory] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 5000]);

    /* ---------------- DATA STATE ---------------- */
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    /* ---------------- FILTER POPOVER ---------------- */
    const [filterAnchor, setFilterAnchor] = useState(null);

    const observerRef = useRef(null);

    /* ---------------- FILTER INDICATOR ---------------- */
    const filtersApplied =
        gender !== "All" ||
        category !== "All" ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 5000;

    /* ---------------- SCROLL TO TOP ---------------- */
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ---------------- INITIAL LOAD ---------------- */
    useEffect(() => {
        handleSearch(true);
        // eslint-disable-next-line
    }, []);

    /* ---------------- API ---------------- */
    const loadProducts = async (pageNo, reset = false) => {
        if (loading || (!hasMore && !reset)) return;
        setLoading(true);

        try {
            const payload = {
                query: query?.trim() || DEFAULT_QUERY,
                gender: gender === "All" ? null : gender,
                category: category === "All" ? null : category,
                min_price: priceRange[0],
                max_price: priceRange[1],
                page: pageNo,
                page_size: PAGE_SIZE,
            };

            const data = await searchProducts(payload);
            const results = Array.isArray(data?.results) ? data.results : [];

            setProducts((prev) => (reset ? results : [...prev, ...results]));
            setHasMore(results.length === PAGE_SIZE);
            setPage(pageNo);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- SEARCH ---------------- */
    const handleSearch = (initial = false) => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        loadProducts(1, true);

        if (!initial) scrollToTop();
        setFilterAnchor(null);
    };

    /* ---------------- CLEAR FILTERS ---------------- */
    const handleClearFilters = () => {
        setGender("All");
        setCategory("All");
        setPriceRange([0, 5000]);

        setProducts([]);
        setPage(1);
        setHasMore(true);

        loadProducts(1, true);
        scrollToTop();
    };

    /* ---------------- INFINITE SCROLL ---------------- */
    useEffect(() => {
        if (!observerRef.current || loading) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore) {
                loadProducts(page + 1);
            }
        });

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [page, hasMore, loading]);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
            <Header onMenuClick={() => setDrawerOpen(true)} />
            <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* 🔝 STICKY SEARCH BAR */}
            <Box
                sx={{
                    position: "sticky",
                    top: 64,
                    zIndex: 10,
                    bgcolor: "#fff",
                    borderBottom: "1px solid #e5e7eb",
                }}
            >
                <Container maxWidth={false} sx={{ px: 4, py: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search apparel, shoes, jackets under 3000"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={8} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleSearch()}
                                sx={{ height: 40 }}
                            >
                                Search
                            </Button>
                        </Grid>

                        <Grid item xs={4} md={1}>
                            <Badge
                                color="primary"
                                variant="dot"
                                invisible={!filtersApplied}
                            >
                                <IconButton
                                    onClick={(e) =>
                                        setFilterAnchor(e.currentTarget)
                                    }
                                >
                                    <FilterAltIcon />
                                </IconButton>
                            </Badge>
                        </Grid>
                    </Grid>

                    {/* 🔖 APPLIED FILTER CHIPS */}
                    {filtersApplied && (
                        <Box sx={{ mt: 1 }}>
                            {gender !== "All" && (
                                <Chip label={`Gender: ${gender}`} sx={{ mr: 1 }} />
                            )}
                            {category !== "All" && (
                                <Chip
                                    label={`Category: ${category}`}
                                    sx={{ mr: 1 }}
                                />
                            )}
                            {(priceRange[0] !== 0 ||
                                priceRange[1] !== 5000) && (
                                    <Chip
                                        label={`₹${priceRange[0]} - ₹${priceRange[1]}`}
                                    />
                                )}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* 🎛️ FILTER POPOVER */}
            <Popover
                open={Boolean(filterAnchor)}
                anchorEl={filterAnchor}
                onClose={() => setFilterAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Box sx={{ p: 3, width: 280 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Filters
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Men">Men</MenuItem>
                        <MenuItem value="Women">Women</MenuItem>
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{ mb: 3 }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="T-Shirts">T-Shirts</MenuItem>
                        <MenuItem value="Shoes">Shoes</MenuItem>
                        <MenuItem value="Accessories">Accessories</MenuItem>
                    </TextField>

                    <Typography variant="body2" gutterBottom>
                        Price: ₹{priceRange[0]} – ₹{priceRange[1]}
                    </Typography>

                    <Slider
                        value={priceRange}
                        onChange={(e, v) => setPriceRange(v)}
                        min={0}
                        max={10000}
                        step={500}
                        valueLabelDisplay="auto"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => handleSearch()}
                    >
                        Apply Filters
                    </Button>
                    {/* 🔄 CLEAR FILTERS */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        sx={{ mt: 2 }}
                        disabled={!filtersApplied}
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </Box>
            </Popover>

            {/* 🛍️ PRODUCTS */}
            <Container maxWidth={false} sx={{ px: 4, mt: 3 }}>
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={6} sm={4} md={3} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>

                {loading && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                <div ref={observerRef} />
            </Container>

            <Footer />
        </Box>
    );
}