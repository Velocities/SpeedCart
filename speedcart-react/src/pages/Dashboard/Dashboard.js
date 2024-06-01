import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import dashboardStyles from './Dashboard.module.css';
import layoutStyles from '../main.module.css'; // Import the new layout styles

function Dashboard() {
    const [shoppingListTitles, setShoppingListTitles] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            setError('User is not authenticated.');
            setIsLoading(false);
            return;
        }

        const url = 'https://api.speedcartapp.com/shopping-lists';

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setShoppingListTitles(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.toString());
            setIsLoading(false);
        });
    }, []);

    const handleDelete = (listId) => {
        if (!window.confirm('Are you sure you want to delete this?')) {
            return;
        }

        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            setError('User is not authenticated.');
            return;
        }

        const url = `https://api.speedcartapp.com/shopping-lists/${listId}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Filter out the deleted list from the state
            setShoppingListTitles(prevLists => prevLists.filter(list => list.list_id !== listId));
        })
        .catch(error => {
            setError(error.toString());
        });
    };

    return (
        <div className={`${layoutStyles.fullHeightContainer}`}>
            <div className={layoutStyles.mainContent}>
                {isLoading ? (
                    <p>Loading lists...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        {shoppingListTitles.length === 0 ? (
                            <p>No lists</p>
                        ) : (
                            <ul>
                                {shoppingListTitles.map(list => (
                                    <li key={list.list_id} className={dashboardStyles.shoppingListItem}>
                                        <Link to={`/shopping-list/${list.list_id}`}>{list.name}</Link>
                                        <FaTrash 
                                            className={dashboardStyles.deleteIcon}
                                            onClick={() => handleDelete(list.list_id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
                <Link to="/NewShoppingList" className={dashboardStyles.createNewListBtn}>Create New List</Link>
            </div>
        </div>
    );
}

export default Dashboard;
