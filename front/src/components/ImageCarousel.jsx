import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const images = [
    "/carousel/banner-1.png",
    "/carousel/banner-2.png",
    "/carousel/banner-3.png",
    "/carousel/banner-4.png",
    "/carousel/banner-5.png",
];

export default function ImageCarousel() {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Box sx={{
            background:
                "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            py: 3,
        }}>
            <Box
                component="img"
                src={images[activeStep]}
                alt="Banner"
                sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    maxHeight: "77vh",
                    display: "block",
                }}
            />
        </Box>
    );
}
