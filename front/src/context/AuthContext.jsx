import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        user: null,
        tokens: null,
    });

    // ✅ RESTORE SESSION ON REFRESH
    useEffect(() => {
        const stored = localStorage.getItem("auth");
        if (stored) {
            const parsed = JSON.parse(stored);
            setAuth({
                isLoggedIn: true,
                user: parsed.user,
                tokens: parsed.tokens,
            });
        }
    }, []);

    const login = (user, tokens) => {
        setAuth({ isLoggedIn: true, user, tokens });
        localStorage.setItem("auth", JSON.stringify({ user, tokens }));
    };

    const logout = () => {
        setAuth({ isLoggedIn: false, user: null, tokens: null });
        localStorage.removeItem("auth");
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
