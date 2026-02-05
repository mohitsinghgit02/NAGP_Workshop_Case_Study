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
import { useState } from "react";

const categories = {
    Men: ["T-Shirts", "Shirts", "Jeans", "Jackets"],
    Women: ["Dresses", "Tops", "Jeans", "Ethnic Wear"],
};

export default function SideDrawer({ open, onClose }) {
    const [openMen, setOpenMen] = useState(true);
    const [openWomen, setOpenWomen] = useState(true);

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
                {/* 🧑 MEN */}
                <ListItemButton
                    onClick={() => setOpenMen(!openMen)}
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        "&:hover": { backgroundColor: "#eef2ff" },
                    }}
                >
                    <ManIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Men" primaryTypographyProps={{ fontWeight: 600 }} />
                    {openMen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={openMen} timeout="auto" unmountOnExit>
                    <List dense sx={{ pl: 4 }}>
                        {categories.Men.map((item) => (
                            <ListItemButton
                                key={item}
                                sx={{
                                    borderRadius: 1,
                                    "&:hover": { backgroundColor: "#f1f5f9" },
                                }}
                            >
                                <ListItemText primary={item} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                <Divider sx={{ my: 1 }} />

                {/* 👩 WOMEN */}
                <ListItemButton
                    onClick={() => setOpenWomen(!openWomen)}
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        "&:hover": { backgroundColor: "#eef2ff" },
                    }}
                >
                    <WomanIcon sx={{ mr: 1 }} />
                    <ListItemText
                        primary="Women"
                        primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    {openWomen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={openWomen} timeout="auto" unmountOnExit>
                    <List dense sx={{ pl: 4 }}>
                        {categories.Women.map((item) => (
                            <ListItemButton
                                key={item}
                                sx={{
                                    borderRadius: 1,
                                    "&:hover": { backgroundColor: "#f1f5f9" },
                                }}
                            >
                                <ListItemText primary={item} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </Box>
        </Drawer>
    );
}
