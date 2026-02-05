import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }) {
    const navigate = useNavigate();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: "linear-gradient(90deg, #020617, #0f172a)",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={onMenuClick} sx={{ color: "#fff" }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography fontWeight={800} color="#fff">
                        AmCart
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton onClick={() => navigate("/")} sx={{ color: "#fff" }}>
                        <HomeIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate("/search")} sx={{ color: "#fff" }}>
                        <SearchIcon />
                    </IconButton>
                    <Typography variant="body2" color="#e5e7eb">
                        Welcome Mohit
                    </Typography>
                    <AccountCircleIcon sx={{ color: "#fff" }} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
