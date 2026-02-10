import { Popover, Box, Typography, TextField, MenuItem, Slider, Button, Select } from "@mui/material";

export default function FilterPopover({
    filterAnchor,
    setFilterAnchor,
    gender,
    setGender,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    priceRange,
    setPriceRange,
    handleSearch,
    handleClearFilters,
}) {
    const categoryTree = JSON.parse(localStorage.getItem("categoryTree") || "{}");

    const genderOptions = ["All", ...Object.keys(categoryTree)];
    const categoryOptions =
        gender !== "All" && categoryTree[gender]
            ? ["All", ...Object.keys(categoryTree[gender])]
            : ["All"];
    const subCategoryOptions =
        gender !== "All" && category !== "All" && categoryTree[gender][category]
            ? ["All", ...categoryTree[gender][category]]
            : ["All"];

    const filtersApplied =
        gender !== "All" || category !== "All" || subCategory !== "All" || priceRange[0] !== 0 || priceRange[1] !== 5000;

    const menuProps = { disableScrollLock: true }; // ensure popover dropdown closes properly

    return (
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

                {/* Gender */}
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Gender"
                    value={gender}
                    onChange={(e) => {
                        setGender(e.target.value);
                        setCategory("All");
                        setSubCategory("All");
                    }}
                    SelectProps={{ MenuProps: menuProps }}
                    sx={{ mb: 2 }}
                >
                    {genderOptions.map((g) => (
                        <MenuItem key={g} value={g}>
                            {g}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Category */}
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Category"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory("All");
                    }}
                    SelectProps={{ MenuProps: menuProps }}
                    sx={{ mb: 2 }}
                >
                    {categoryOptions.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Sub-Category */}
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Sub-Category"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    SelectProps={{ MenuProps: menuProps }}
                    sx={{ mb: 3 }}
                    disabled={subCategoryOptions.length <= 1}
                >
                    {subCategoryOptions.map((sc) => (
                        <MenuItem key={sc} value={sc}>
                            {sc}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Price */}
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
                    onClick={() => {
                        handleSearch();
                        setFilterAnchor(null);
                    }}
                >
                    Apply Filters
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2 }}
                    disabled={!filtersApplied}
                    onClick={() => {
                        handleClearFilters();
                        setFilterAnchor(null);
                    }}
                >
                    Clear Filters
                </Button>
            </Box>
        </Popover>
    );
}