import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Menu,
    MenuItem,
    Badge
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AuthDialog from "./auth/AuthDialog";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {

    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const user = auth.user;

    const [authOpen, setAuthOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";

    /* ---------------------- */
    /* LOAD CART COUNT */
    /* ---------------------- */

    const loadCartCount = () => {

        try {

            const storage = JSON.parse(
                localStorage.getItem("cart_products") ||
                '{"cart_products":[]}'
            );

            const cartProducts = storage.cart_products || [];

            const total = cartProducts.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0
            );

            setCartCount(total);

        } catch (err) {

            console.error("Cart read error", err);
            setCartCount(0);

        }
    };

    /* ---------------------- */
    /* INITIAL LOAD */
    /* ---------------------- */

    useEffect(() => {

        loadCartCount();

    }, [user]);

    /* ---------------------- */
    /* LISTEN STORAGE CHANGES */
    /* ---------------------- */

    useEffect(() => {

        const handleStorageChange = () => {

            loadCartCount();

        };

        window.addEventListener("storage", handleStorageChange);

        return () => {

            window.removeEventListener("storage", handleStorageChange);

        };

    }, []);

    /* ---------------------- */
    /* POLLING FOR SAME TAB UPDATES */
    /* ---------------------- */

    useEffect(() => {

        const interval = setInterval(() => {

            loadCartCount();

        }, 1000);

        return () => clearInterval(interval);

    }, []);

    /* ---------------------- */
    /* LOGOUT */
    /* ---------------------- */

    const handleLogout = () => {

        logout();

        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("user_profile");
        localStorage.removeItem("liked_products");
        localStorage.removeItem("cart_products");

        setCartCount(0);

        setAnchorEl(null);

        navigate("/", { replace: true });

    };

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: "linear-gradient(90deg, #020617, #0f172a)",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>

                    {/* LEFT */}

                    <Box display="flex" alignItems="center" gap={1}>

                        <IconButton
                            onClick={onMenuClick}
                            sx={{ color: "#fff" }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography fontWeight={800} color="#fff">
                            AmCart
                        </Typography>

                    </Box>

                    {/* CENTER */}

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        sx={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#94a3b8",
                                fontSize: "0.75rem",
                                letterSpacing: "0.05em",
                            }}
                        >
                            NAGP-CASE-STUDY
                        </Typography>

                        <Typography sx={{ color: "#475569", fontSize: "0.75rem" }}>
                            |
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#94a3b8",
                                fontSize: "0.75rem",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Version: {appVersion}
                        </Typography>
                    </Box>

                    {/* RIGHT */}

                    <Box display="flex" alignItems="center" gap={2}>

                        <IconButton
                            onClick={() => navigate("/")}
                            sx={{ color: "#fff" }}
                        >
                            <HomeIcon />
                        </IconButton>

                        <IconButton
                            onClick={() => navigate("/search")}
                            sx={{ color: "#fff" }}
                        >
                            <SearchIcon />
                        </IconButton>

                        {/* CART ICON */}

                        {user && (
                            <IconButton
                                onClick={() => navigate("/cart")}
                                sx={{ color: "#fff" }}
                            >
                                <Badge
                                    badgeContent={cartCount}
                                    color="error"
                                    overlap="circular"
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        )}

                        {!user ? (

                            <IconButton
                                sx={{ color: "#fff" }}
                                onClick={() => setAuthOpen(true)}
                            >
                                <LoginIcon />
                            </IconButton>

                        ) : (

                            <>

                                <Typography
                                    variant="body2"
                                    color="#e5e7eb"
                                    sx={{ cursor: "pointer" }}
                                    onClick={(e) =>
                                        setAnchorEl(e.currentTarget)
                                    }
                                >
                                    Welcome {user.name}
                                </Typography>

                                <AccountCircleIcon
                                    sx={{
                                        color: "#fff",
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) =>
                                        setAnchorEl(e.currentTarget)
                                    }
                                />

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >

                                    <MenuItem
                                        onClick={() => {

                                            navigate("/profile");

                                            setAnchorEl(null);

                                        }}
                                    >
                                        Profile
                                    </MenuItem>

                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>

                                </Menu>

                            </>
                        )}

                    </Box>

                </Toolbar>

            </AppBar>

            <AuthDialog
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />
        </>
    );
}