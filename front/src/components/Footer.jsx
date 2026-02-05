import { Box, Container, Grid, Typography, Divider } from "@mui/material";

export default function Footer() {
    return (
        <Box sx={{
            background:
                "linear-gradient(135deg, #020617 0%, #111827 100%)",
            color: "#e5e7eb",
            mt: 8,
        }}>
            <Container sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" color="#fff" gutterBottom>
                            AmCart
                        </Typography>
                        <Typography variant="body2">
                            Your one-stop destination for trendy fashion and lifestyle
                            products.
                        </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                        <Typography variant="subtitle1" color="#fff" gutterBottom>
                            Quick Links
                        </Typography>
                        <Typography variant="body2">Men</Typography>
                        <Typography variant="body2">Women</Typography>
                        <Typography variant="body2">Trending</Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                        <Typography variant="subtitle1" color="#fff" gutterBottom>
                            Support
                        </Typography>
                        <Typography variant="body2">Contact Us</Typography>
                        <Typography variant="body2">Privacy Policy</Typography>
                        <Typography variant="body2">Terms & Conditions</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: "#374151" }} />

                <Typography variant="body2" align="center">
                    © {new Date().getFullYear()} AmCart. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
