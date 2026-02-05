import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

export default function CategoryCard({ title, image }) {
    return (
        <Card
            sx={{
                cursor: "pointer",
                height: "100%",
            }}
        >
            {/* Image wrapper */}
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",   // 300x300
                    backgroundColor: "#f5f5f5", // prevents white gaps
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
                        objectFit: "contain", // 🔑 FIX: NO CROPPING
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
