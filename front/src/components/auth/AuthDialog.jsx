import {
    Dialog,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import { useState } from "react";

import OtpInput from "./OtpInput";
import NewUserForm from "./NewUserForm";
import { useAuth } from "../../context/AuthContext";

import {
    sendOtp,
    verifyOtp,
    fetchCustomer,
    fetchLikedProducts,
    fetchCartProducts
} from "../../api/authApi";

export default function AuthDialog({ open, onClose }) {

    const [step, setStep] = useState("EMAIL");
    const [email, setEmail] = useState("");
    const [otpMeta, setOtpMeta] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendOtp = async () => {

        if (!validateEmail(email)) {
            setError("Enter a valid email address");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const res = await sendOtp(email);

            setOtpMeta(res.data);
            setStep("OTP");

        } catch {

            setError("Failed to send OTP. Try again.");

        } finally {

            setLoading(false);

        }
    };

    const handleVerifyOtp = async (otp) => {

        try {

            setLoading(true);
            setError("");

            const res = await verifyOtp(email, otp);

            localStorage.setItem(
                "access_token",
                res.data.token.access_token
            );

            localStorage.setItem(
                "id_token",
                res.data.token.id_token
            );

            if (res.data.status === "NEW_USER") {

                setOtpMeta(res.data);
                setStep("NEW_USER");

            } else {

                await loadCustomerAndLogin();

            }

        } catch {

            setError("Invalid OTP. Please try again.");

        } finally {

            setLoading(false);

        }
    };

    const loadCustomerAndLogin = async () => {

        try {

            const res = await fetchCustomer();
            const data = res.data.data;

            const name = `${data.customer?.first_name || ""} ${data.customer?.last_name || ""}`.trim();

            const userPayload = {
                user_id: data.user.user_id,
                name: name,
                email: data.user.email,
                phone: data.user.phone,
                roles: data.roles,
                customer_id: data.customer?.customer_id,
                first_name: data.customer?.first_name,
                last_name: data.customer?.last_name,
                city: data.address?.city,
                country: data.address?.country,
                postal_code: data.address?.postal_code,
                address: data.address
            };

            localStorage.setItem(
                "user_profile",
                JSON.stringify(userPayload)
            );

            login(
                userPayload,
                {
                    access_token: localStorage.getItem("access_token"),
                    id_token: localStorage.getItem("id_token"),
                }
            );

            /* FETCH LIKED PRODUCTS */

            try {

                const likedRes = await fetchLikedProducts();

                localStorage.setItem(
                    "liked_products",
                    JSON.stringify(likedRes.data.data || { liked_products: [] })
                );

            } catch {
                console.warn("Liked products fetch failed");
            }

            /* FETCH CART PRODUCTS */

            try {

                const cartRes = await fetchCartProducts();

                localStorage.setItem(
                    "cart_products",
                    JSON.stringify(cartRes.data.data || [])
                );

            } catch {
                console.warn("Cart products fetch failed");
            }

            onClose();


        } catch {

            setError("Unable to fetch user details");

        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box p={3} width={360}>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {step === "EMAIL" && (
                    <>
                        <Typography fontWeight={700} mb={1}>
                            Login / Sign Up
                        </Typography>

                        <TextField
                            fullWidth
                            label="Email Address"
                            margin="normal"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value.trim())
                            }
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSendOtp}
                            disabled={loading}
                        >
                            Send OTP
                        </Button>
                    </>
                )}

                {step === "OTP" && (
                    <OtpInput
                        onSubmit={handleVerifyOtp}
                        onResend={handleSendOtp}
                        email={email}
                    />
                )}

                {step === "NEW_USER" && (
                    <NewUserForm
                        email={email}
                        otpMeta={otpMeta}
                        onSuccess={loadCustomerAndLogin}
                    />
                )}

            </Box>
        </Dialog>
    );
}