import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Box,
    Container,
    Grid,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
    IconButton,
    Chip,
    Badge,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import Header from "../components/Header";
import SideDrawer from "../components/SideDrawer";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import FilterPopover from "../components/FilterPopover";
import { searchProducts } from "../api/productApi";

const PAGE_SIZE = 20;

export default function Search() {
    const location = useLocation();

    const [drawerOpen, setDrawerOpen] = useState(false);

    /* ---------------- UI FILTER STATE ---------------- */
    const [query, setQuery] = useState("");
    const [gender, setGender] = useState("All");
    const [category, setCategory] = useState("All");
    const [subCategory, setSubCategory] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 5000]);

    /* ---------------- APPLIED FILTERS ---------------- */
    const [appliedFilters, setAppliedFilters] = useState(null);

    /* ---------------- DATA STATE ---------------- */
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [filterAnchor, setFilterAnchor] = useState(null);
    const observerRef = useRef(null);

    /* ---------------- FILTER INDICATOR ---------------- */
    const filtersApplied =
        appliedFilters &&
        (appliedFilters.gender !== "All" ||
            appliedFilters.category !== "All" ||
            appliedFilters.subCategory !== "All" ||
            appliedFilters.priceRange[0] !== 0 ||
            appliedFilters.priceRange[1] !== 5000);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* =========================================================
       ✅ SYNC URL → FILTERS
    ========================================================= */
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const urlQuery = params.get("query") || "";
        const urlGender = params.get("gender") || "All";
        const urlCategory = params.get("category") || "All";
        const urlSubCategory = params.get("subCategory") || "All";

        setQuery(urlQuery);
        setGender(urlGender);
        setCategory(urlCategory);
        setSubCategory(urlSubCategory);

        setAppliedFilters({
            query: urlQuery,
            gender: urlGender,
            category: urlCategory,
            subCategory: urlSubCategory,
            priceRange: [0, 5000],
        });

        setProducts([]);
        setPage(1);
        setHasMore(true);
        scrollToTop();
    }, [location.search]);

    /* =========================================================
       ✅ LOAD PRODUCTS WHEN FILTER VALUES CHANGE
    ========================================================= */
    useEffect(() => {
        if (!appliedFilters) return;
        loadProducts(1, true);
        // eslint-disable-next-line
    }, [
        appliedFilters?.query,
        appliedFilters?.gender,
        appliedFilters?.category,
        appliedFilters?.subCategory,
        appliedFilters?.priceRange,
    ]);

    /* ---------------- API ---------------- */
    const loadProducts = async (pageNo, reset = false) => {
        if (loading || (!hasMore && !reset) || !appliedFilters) return;

        setLoading(true);

        const {
            query,
            gender,
            category,
            subCategory,
            priceRange,
        } = appliedFilters;

        try {
            const payload = {
                query: query?.trim() || "",
                gender: gender === "All" ? null : gender,
                category: category === "All" ? null : category,
                subCategory: subCategory === "All" ? null : subCategory,
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

    /* ---------------- APPLY SEARCH ---------------- */
    const handleSearch = () => {
        setAppliedFilters({
            query,
            gender,
            category,
            subCategory,
            priceRange,
        });

        setProducts([]);
        setPage(1);
        setHasMore(true);
        scrollToTop();
        setFilterAnchor(null);
    };

    /* ---------------- CLEAR FILTERS ---------------- */
    const handleClearFilters = () => {
        setQuery("");
        setGender("All");
        setCategory("All");
        setSubCategory("All");
        setPriceRange([0, 5000]);

        setAppliedFilters({
            query: "",
            gender: "All",
            category: "All",
            subCategory: "All",
            priceRange: [0, 5000],
        });

        setProducts([]);
        setPage(1);
        setHasMore(true);
        scrollToTop();
        setFilterAnchor(null);
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
            <SideDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            {/* SEARCH BAR */}
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
                                placeholder="Search products"
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value)
                                }
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
                                onClick={handleSearch}
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

                    {filtersApplied && (
                        <Box sx={{ mt: 1 }}>
                            {appliedFilters.gender !== "All" && (
                                <Chip
                                    label={`Gender: ${appliedFilters.gender}`}
                                    sx={{ mr: 1 }}
                                />
                            )}
                            {appliedFilters.category !== "All" && (
                                <Chip
                                    label={`Category: ${appliedFilters.category}`}
                                    sx={{ mr: 1 }}
                                />
                            )}
                            {appliedFilters.subCategory !== "All" && (
                                <Chip
                                    label={`Sub-Category: ${appliedFilters.subCategory}`}
                                />
                            )}
                        </Box>
                    )}
                </Container>
            </Box>

            <FilterPopover
                filterAnchor={filterAnchor}
                setFilterAnchor={setFilterAnchor}
                gender={gender}
                setGender={setGender}
                category={category}
                setCategory={setCategory}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                handleSearch={handleSearch}
                handleClearFilters={handleClearFilters}
            />

            {/* PRODUCTS */}
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