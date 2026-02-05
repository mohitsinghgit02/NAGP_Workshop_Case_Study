import {
    Card,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProductCard({ product }) {
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
                }}
            >
                <FavoriteBorderIcon />
            </IconButton>

            {/* Image */}
            <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    objectFit: "cover",
                    display: "block",
                }}
            />

            {/* Product info (VISIBLE always) */}
            <Box sx={{ p: 1.5 }}>
                <Typography fontSize={14} fontWeight={600} noWrap>
                    {product.name}
                </Typography>

                <Typography fontSize={12} color="text.secondary" noWrap>
                    {product.brand}
                </Typography>

                <Typography fontSize={14} fontWeight="bold" sx={{ mt: 0.5 }}>
                    ₹{product.price}
                </Typography>
            </Box>
        </Card>
    );
}
