import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Menu,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthDialog from "./auth/AuthDialog";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();   // ✅ CORRECT
    const user = auth.user;               // ✅ CORRECT

    const [authOpen, setAuthOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        logout();
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
                    {/* Left */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton onClick={onMenuClick} sx={{ color: "#fff" }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography fontWeight={800} color="#fff">
                            AmCart | Fashion Mart
                        </Typography>
                    </Box>

                    {/* Right */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton onClick={() => navigate("/")} sx={{ color: "#fff" }}>
                            <HomeIcon />
                        </IconButton>

                        <IconButton onClick={() => navigate("/search")} sx={{ color: "#fff" }}>
                            <SearchIcon />
                        </IconButton>

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
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                >
                                    Welcome {user.name}
                                </Typography>

                                <AccountCircleIcon
                                    sx={{ color: "#fff", cursor: "pointer" }}
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
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

            {/* 🔐 Auth Dialog */}
            <AuthDialog
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />
        </>
    );
}
