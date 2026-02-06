import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";

export default function OtpInput({ onSubmit, onResend }) {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (timer === 0) return;
        const t = setTimeout(() => setTimer((t) => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    const verifyOtp = async () => {
        if (!/^\d{6}$/.test(otp)) {
            setError("Enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await onSubmit(otp);
        } catch {
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = () => {
        if (!onResend) return;
        setOtp("");
        setTimer(30);
        onResend();
    };

    return (
        <>
            <Typography fontWeight={700}>Enter OTP</Typography>

            {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                margin="normal"
                label="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 6 }}
            />

            <Button
                fullWidth
                variant="contained"
                onClick={verifyOtp}
                disabled={loading}
            >
                Verify
            </Button>

            <Box mt={1} textAlign="center">
                {timer > 0 ? (
                    <Typography fontSize={12}>
                        Retry in {timer}s
                    </Typography>
                ) : (
                    <Button size="small" onClick={resendOtp}>
                        Resend OTP
                    </Button>
                )}
            </Box>
        </>
    );
}
