import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaTrash, FaEdit, FaShare, FaClipboard } from 'react-icons/fa';
import { useAuth } from '@customHooks/AuthContext';
import Modal from '@components/Modal';
import styles from './Dashboard.module.css';

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

function Dashboard() {
    const [shoppingListTitles, setShoppingListTitles] = useState([]);
    const [sharedShoppingListTitles, setSharedShoppingListTitles] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    // All state variables for list sharing
    const [shareListId, setShareListId] = useState(null);
    const [shareLink, setShareLink] = useState('');
    const [canUpdate, setCanUpdate] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        document.title = "View shopping lists";
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            setError('You are not signed in; please try signing in at the Login page');
            setIsLoading(false);
            return;
        }

        const ownedListsUrl = `${baseUrl}/shopping-lists`;
        const sharedListsUrl = `${baseUrl}/shopping-lists/shared`;

        // Retrieve lists owned by user
        fetch(ownedListsUrl, {
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

        // Retrieve lists shared with user
        fetch(sharedListsUrl, {
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
            setSharedShoppingListTitles(data);
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

    // Sharing feature for shopping lists
    const handleShare = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const urlWithParams = `${baseUrl}/share/${shareListId}`;
            
            const response = await fetch(urlWithParams, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    can_update: canUpdate,
                    can_delete: canDelete
                }),
            });
            
            const data = await response.json();
            const { link } = data;
            setShareLink(link);
        } catch (error) {
            console.error('Error sharing shopping list', error);
        }
    };
    

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Handle checkbox changes
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'update') {
            setCanUpdate(checked);
        } else if (name === 'delete') {
            setCanDelete(checked);
        }
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
            <h2>Your lists</h2>
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
                                    <span className={styles.leftAlign}>
                                        <Link to={`/shopping-list/${list.list_id}`} className={styles.iconContainer}>
                                            <FaEdit className={styles.viewEditIcon} />
                                            <span className={styles.tooltip}>View/Edit List</span>
                                        </Link>
                                        <button onClick={() => {
                                            // This state will display the modal for the sharing feature for that specific list
                                            setShareListId(list.list_id);
                                            //handleShare(list.list_id);
                                        }} >
                                            <FaShare className={styles.faShare} />
                                        </button>
                                    </span>
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
            <h2>Lists shared with you</h2>
            {sharedShoppingListTitles.length === 0 ? 
            <p>
                No lists
            </p> : 
            <ul>
                {sharedShoppingListTitles.map(list => (
                    <li key={list.list_id} className={styles.shoppingListItem}>
                        <span className={styles.leftAlign}>
                            <Link to={`/shopping-list/${list.list_id}`} className={styles.iconContainer}>
                                <FaEdit className={styles.viewEditIcon} />
                                <span className={styles.tooltip}>View/Edit List</span>
                            </Link>
                            <button onClick={() => {
                                // This state will display the modal for the sharing feature for that specific list
                                setShareListId(list.list_id);
                                //handleShare(list.list_id);
                            }} >
                                <FaShare className={styles.faShare} />
                            </button>
                        </span>
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
            }
            

            {shareListId !== null && (
                <Modal isOpen={shareListId !== null} onClose={() => setShareListId(null)}>
                    {({ closeModal }) => (
                        <div>
                            <h2>Share Shopping List</h2>
                            <section>
                                This will generate a single-use link that will be valid for 1 week
                                and will grant the user the permissions you provide for the list
                                (read is always the bare minimum).
                            </section>
                            <section>
                                <input
                                    type="checkbox"
                                    disabled
                                    checked
                                /> Read
                                <input
                                    type="checkbox"
                                    name="update"
                                    checked={canUpdate}
                                    onChange={handleCheckboxChange}
                                /> Update
                                <input
                                    type="checkbox"
                                    name="delete"
                                    checked={canDelete}
                                    onChange={handleCheckboxChange}
                                /> Delete
                            </section>
                            <div className={styles.shareLinkContainer}>
                                <button onClick={handleShare}>Generate link</button>
                                <span className={styles.shareLink}>
                                    {shareLink} 
                                    <span onClick={handleCopyToClipboard} className={styles.clipboardIcon}>
                                        <FaClipboard />
                                    </span>
                                </span>
                            </div>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    )}
                </Modal>
            )}
            {isAuthenticated ? (
                <Link to="/NewShoppingList" className={styles.createNewListBtn}>Create New List</Link>
            ) : <Link to="/login" className={styles.loginBtn}>Go sign in</Link>
            }
        </main>
    );
}

export default Dashboard;
