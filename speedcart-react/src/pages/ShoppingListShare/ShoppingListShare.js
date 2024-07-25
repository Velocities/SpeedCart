import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@customHooks/AuthContext';

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

function ShoppingListShare() {
    const navigate = useNavigate();
    const [shareInteractionStatus, setShareInteractionStatus] = useState("Loading...");
    const { token } = useParams(); // Get link sharing token from url parameters
    const { isAuthenticated, login } = useAuth();

    useEffect(() => {
        // Only attempt to verify the share interaction if there's a token
        if (!token) {
            setShareInteractionStatus("Invalid or missing token.");
            return;
        }

        // Call verifyShareInteraction to verify the token
        const verifyAndRedirect = async () => {
            try {
                const shoppingListReturned = await verifyShareInteraction(token);

                // Check if we have a list ID
                if (shoppingListReturned && shoppingListReturned.list_id) {
                    setShareInteractionStatus("Success! Redirecting you to list...");
                    // This needs to have a small delay so the user can know they're being redirected
                    setTimeout(() => {
                        navigate(`/shopping-list/${shoppingListReturned.list_id}`);
                    }, 2000); // 2-second delay
                } else {
                    setShareInteractionStatus("Invalid or expired share link.");
                }
            } catch (error) {
                console.error("Error verifying share interaction", error);
                setShareInteractionStatus("An error occurred while verifying the share link.");
            }
        };

        verifyAndRedirect();
    }, [token, navigate]);

    const verifyShareInteraction = async (token) => {
        const urlWithParams = `${baseUrl}/share/${token}`;
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            //const responseText = await response.text();
            //console.log("Response text:", responseText);


            if (!response.ok) {
                console.log("response status: " + response.status);
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };

    const handleLoginSuccess = (credentialResponse) => {
        // Handle the success of the Google login
        const token = JSON.stringify(credentialResponse);
        login(token);
    };

    const handleLoginError = () => {
        // Handle login failure
        console.error('Login Failed');
    };

    return (
        <main className='main-content'>
            {/* Make sure user is signed in */}
            {!isAuthenticated ? (
                <>
                    <p>Please sign in first:</p>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                    />
                </>
            ) : (
                <>
                    {shareInteractionStatus}
                </>
            )}
        </main>
    );
}

export default ShoppingListShare;
