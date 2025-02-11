import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EmailConfirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;
    const isMounted = useRef(true); // Utilisez useRef pour le drapeau

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                if (token !== "sending-email" && isMounted.current) {
                    const response = await axios.get(`${API_URL}/api/auth/confirm/${token}`);
                    console.log(response.data);
                    localStorage.setItem('token', response.data.token);
                    setMessage("Email confirmed. Redirecting to login page...");
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000); // Redirige vers la page de login après 3 secondes
                }
            } catch (error) {
                if (isMounted.current) {
                    setMessage(error.response?.data?.message || 'Erreur lors de la confirmation de l\'email.');
                }
            }
        };

        confirmEmail();

        return () => {
            isMounted.current = false; // Nettoyage du drapeau
        };
    }, [token, API_URL, navigate]);

    return (
        <div className= "module">
            {token !== "sending-email" ? (
                <div>
                    <h1>Confirmation d'Email</h1>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <br /><br />
                    <label align="center" margin="20px">📧 A confirmation email has been sent to you (Please check your spam)</label>
                </div>
            )}
        </div>
    );
};

export default EmailConfirmation;