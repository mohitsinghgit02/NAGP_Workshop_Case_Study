import {
    Drawer,
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Divider,
    IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { filterCategories } from "../api/productApi";

export default function SideDrawer({ open, onClose }) {
    const [categoryTree, setCategoryTree] = useState({});
    const [expandedGender, setExpandedGender] = useState(null); // Only one open

    // Fetch category tree once
    useEffect(() => {
        const fetchCategories = async () => {
            const cached = localStorage.getItem("categoryTree");
            if (cached) {
                setCategoryTree(JSON.parse(cached));
                return;
            }

            try {
                const { data } = await filterCategories();
                if (data.status === "success") {
                    setCategoryTree(data.data);
                    localStorage.setItem("categoryTree", JSON.stringify(data.data));
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const toggleGender = (gender) => {
        setExpandedGender((prev) => (prev === gender ? null : gender));
    };

    const genderIcons = {
        Men: <ManIcon sx={{ mr: 1 }} />,
        Women: <WomanIcon sx={{ mr: 1 }} />,
        Boys: <ManIcon sx={{ mr: 1 }} />,
        Girls: <WomanIcon sx={{ mr: 1 }} />,
        Unisex: <ManIcon sx={{ mr: 1 }} />,
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 280,
                    background: "linear-gradient(180deg, #ffffff, #f8fafc)",
                },
            }}
        >
            {/* 🔹 Drawer Header */}
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "linear-gradient(90deg, #0f172a, #020617)",
                    color: "#fff",
                }}
            >
                <Typography fontWeight={700}>Shop Categories</Typography>
                <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box px={1} py={1}>
                {Object.keys(categoryTree).map((gender) => (
                    <Box key={gender}>
                        <ListItemButton
                            onClick={() => toggleGender(gender)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                "&:hover": { backgroundColor: "#eef2ff" },
                            }}
                        >
                            {genderIcons[gender] || <ManIcon sx={{ mr: 1 }} />}
                            <ListItemText
                                primary={gender}
                                primaryTypographyProps={{ fontWeight: 600 }}
                            />
                            {expandedGender === gender ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse
                            in={expandedGender === gender}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List dense sx={{ pl: 4 }}>
                                {Object.entries(categoryTree[gender]).map(
                                    ([category, subCategories]) => (
                                        <Box key={category} sx={{ mb: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                    mb: 0.5,
                                                }}
                                            >
                                                {category}
                                            </Typography>
                                            <List dense sx={{ pl: 2 }}>
                                                {subCategories.map((sub) => (
                                                    <ListItemButton
                                                        key={sub}
                                                        sx={{
                                                            borderRadius: 1,
                                                            "&:hover": {
                                                                backgroundColor: "#f1f5f9",
                                                            },
                                                        }}
                                                    >
                                                        <ListItemText primary={sub} />
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        </Box>
                                    )
                                )}
                            </List>
                        </Collapse>
                        <Divider sx={{ my: 1 }} />
                    </Box>
                ))}
            </Box>
        </Drawer>
    );
}