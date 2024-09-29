import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import { AppRoute } from "@constants/routes";

import { useAuth, createSharingPermissions } from 'shared';


function ShoppingListShare() {
    const navigate = useNavigate();
    const [shareInteractionStatus, setShareInteractionStatus] = useState("Loading...");
    const { token } = useParams(); // Get link sharing token from url parameters
    const { isAuthenticated, login } = useAuth();

    useEffect(() => {
        // Only attempt to verify the share interaction if there's a token and the user is authenticated
        if (!token) {
            setShareInteractionStatus("Invalid or missing token.");
            return;
        }

        if (!isAuthenticated) {
            // No need to set shareInteractionStatus (JSX conditionally checks isAuthenticated already)
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
                        navigate(`${AppRoute.SHOPPING_LIST_DETAIL}/${shoppingListReturned.list_id}`);
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
    }, [token, isAuthenticated, navigate]);

    const verifyShareInteraction = async (token) => {

        try {
            const response = await createSharingPermissions(token);
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
