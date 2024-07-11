import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '@customHooks/AuthContext';
import styles from './Dashboard.module.css';

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

function Dashboard() {
    const [shoppingListTitles, setShoppingListTitles] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        document.title = "View shopping lists";
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            setError('You are not signed in; please try signing in at the Login page');
            setIsLoading(false);
            return;
        }

        const url = `${baseUrl}/shopping-lists`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    throw new Error('Authorization error; please try signing in again at the Login page');
                } else {
                    throw new Error('Network response was not ok with status ' + response.status);
                }
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
    }, [logout]);

    const handleDelete = (listId) => {
        if (!window.confirm('Are you sure you want to delete this?')) {
            return;
        }

        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            setError('You are not signed in; please try signing in at the Login page');
            return;
        }

        const url = `${baseUrl}/shopping-lists/${listId}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authorization error; please try signing in again at the Login page');
                } else {
                    throw new Error('Network response was not ok with status ' + response.status);
                }
            }
            // Filter out the deleted list from the state
            setShoppingListTitles(prevLists => prevLists.filter(list => list.list_id !== listId));
        })
        .catch(error => {
            setError(error.toString());
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCaseSensitiveChange = (event) => {
        setIsCaseSensitive(event.target.checked);
    };

    const filteredShoppingListTitles = shoppingListTitles.filter(list => {
        if (isCaseSensitive) {
            return list.name.includes(searchQuery);
        }
        return list.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <main className={`main-content`}>
            <div className={styles.searchContainer}>
                <label className={styles.caseSensitiveLabel}>
                    <input
                        type="checkbox"
                        checked={isCaseSensitive}
                        onChange={handleCaseSensitiveChange}
                    />
                    Case Sensitive
                </label>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div>
            {isLoading ? (
                <p>Loading lists...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {filteredShoppingListTitles.length === 0 ? (
                        <p>No lists</p>
                    ) : (
                        <ul>
                            {filteredShoppingListTitles.map(list => (
                                <li key={list.list_id} className={styles.shoppingListItem}>
                                    <Link to={`/shopping-list/${list.list_id}`} className={styles.iconContainer}>
                                        <FaEdit className={styles.viewEditIcon} />
                                        <span className={styles.tooltip}>View/Edit List</span>
                                    </Link>
                                    <span className={styles.listName}>{list.name}</span>
                                    <div className={styles.listDetails}>
                                        <span className={styles.updatedAt}>{new Date(list.updated_at).toLocaleString()}</span>
                                        <FaTrash 
                                            className={styles.deleteIcon}
                                            onClick={() => handleDelete(list.list_id)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
            {isAuthenticated ? (
                <Link to="/NewShoppingList" className={styles.createNewListBtn}>Create New List</Link>
            ) : <Link to="/login" className={styles.loginBtn}>Go sign in</Link>
            }
        </main>
    );
}

export default Dashboard;
