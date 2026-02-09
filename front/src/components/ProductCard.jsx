import {
    Card,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProductCard({ product }) {
    const {
        productDisplayName,
        category,
        price,
        image_path,
    } = product;

    return (
        <Card
            sx={{
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
            {/* ❤️ Wishlist */}
            <IconButton
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    backgroundColor: "#fff",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#f8fafc" },
                }}
            >
                <FavoriteBorderIcon fontSize="small" />
            </IconButton>

            {/* 🖼 Image */}
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

            {/* ℹ️ Product Info */}
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
    );
}