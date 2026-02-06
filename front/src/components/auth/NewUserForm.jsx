import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { addUser } from "../../api/authApi";

export default function NewUserForm({ phone, onSuccess }) {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        pin_code: "",
        city: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        if (!form.first_name || !form.last_name || !form.email) {
            setError("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await addUser({
                phone,
                user_type: "customer",
                ...form,
            });

            onSuccess(); // fetch customer & login
        } catch (err) {
            setError("Failed to create user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography fontWeight={700} mb={1}>
                Complete Profile
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                </Alert>
            )}

            <Box display="grid" gap={1.5}>
                <TextField
                    label="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Pincode"
                    name="pin_code"
                    value={form.pin_code}
                    onChange={handleChange}
                />
                <TextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                />

                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={loading}
                >
                    Save & Continue
                </Button>
            </Box>
        </>
    );
}
