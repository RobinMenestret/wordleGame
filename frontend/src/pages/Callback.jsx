import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            console.log(code)
            handleAuth(code);
        } else {
            console.error("Aucun code OAuth trouvé dans l'URL.");
            navigate("/login"); // Redirige en cas d'erreur
        }
    }, []);

    const handleAuth = async (code) => {
        try {
            const response = await axios.post("http://localhost:4000/api/auth/callback", { code }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Si vous utilisez des cookies pour gérer la session
            });

            localStorage.setItem('token', response.data.token);
            navigate('/Settings');

            // Redirection vers la page d'accueil ou tableau de bord
            navigate("/login");
        } catch (error) {
            console.error("Erreur lors de l'authentification :", error);
            navigate("/register"); // Redirige en cas d'échec
        }
    };

    return <p>Authentification en cours...</p>;
};

export default Callback;
