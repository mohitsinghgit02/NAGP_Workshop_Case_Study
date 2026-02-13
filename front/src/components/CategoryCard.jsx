import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function CategoryCard({ title, image, url }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        // If already on same path, force navigation to trigger effects
        if (location.pathname + location.search === url) {
            navigate(url, { replace: true });
        } else {
            navigate(url);
        }
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                cursor: "pointer",
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                },
            }}
        >
            {/* Image wrapper */}
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>

            <CardContent>
                <Typography align="center" variant="h6" fontWeight={600}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}