import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaTrash, FaEdit, FaShare, FaClipboard } from 'react-icons/fa';
import { useAuth } from '@customHooks/AuthContext';
import Modal from '@components/Modal';
import styles from './Dashboard.module.css';
import CustomCheckbox from '../../components/CustomCheckbox';

const baseUrl = `https://${process.env.REACT_APP_API_DOMAIN}:${process.env.REACT_APP_API_PORT}`;

function Dashboard() {
    const [shoppingListTitles, setShoppingListTitles] = useState([]);
    const [sharedShoppingListTitles, setSharedShoppingListTitles] = useState([]);
    const [error, setError] = useState(null);
    const [ownerListsAreLoading, setOwnerListsAreLoading] = useState(true);
    const [sharedListsAreLoading, setSharedListsAreLoading] = useState(true);
    const [sharedListsError, setSharedListsError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCaseSensitive, setIsCaseSensitive] = useState(false);
    // All state variables for list sharing
    const [shareListId, setShareListId] = useState(null);
    const [shareLink, setShareLink] = useState('Link will show here');
    const [canUpdate, setCanUpdate] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        document.title = "View shopping lists";
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            setError('You are not signed in; please try signing in at the Login page');
            setOwnerListsAreLoading(false);
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
            setOwnerListsAreLoading(false);
        })
        .catch(error => {
            setError(error.toString());
            setOwnerListsAreLoading(false);
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
            setSharedListsAreLoading(false);
        })
        .catch(error => {
            setSharedListsError(error.toString());
            setSharedListsAreLoading(false);
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
            setShareLink('Generating link...');
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
            setShareLink('Unable to generate share link (an error occurred)');
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
            <div className={styles.content}>
                <h2>Your lists</h2>
                {ownerListsAreLoading ? (
                    <p>Loading your lists...</p>
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
                                                <FaEdit className={`${styles.viewEditIcon} ${styles.slowColorTransition}`} />
                                                <span className={styles.tooltip}>View/Edit List</span>
                                            </Link>
                                            <button onClick={() => {
                                                // This state will display the modal for the sharing feature for that specific list
                                                setShareListId(list.list_id);
                                                //handleShare(list.list_id);
                                            }} className={styles.iconContainer}>
                                                <FaShare className={`${styles.faShare} ${styles.slowColorTransition}`} />
                                                <span className={styles.tooltip}>Share List</span>
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
                {sharedListsAreLoading ? (
                    <p>Loading lists shared with you...</p>
                    ) : sharedListsError ? (
                        <p>{sharedListsError}</p>
                    ) : (
                    <>
                        {sharedShoppingListTitles.length === 0 ? 
                            <p>
                                No lists
                            </p> : (
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
                            </ul>)
                        }
                    </>
                )}

                {shareListId !== null && (
                    <Modal isOpen={shareListId !== null} onClose={() => {
                        // This closes/hides the modal
                        setShareListId(null);
                        // Clear clipboard content
                        setShareLink('Link will show here');
                        // Clear checkbox inputs
                        setCanUpdate(false);
                        setCanDelete(false);
                    }}>
                        {({ closeModal }) => (
                            <div>
                                <h2>Share Shopping List</h2>
                                <section>
                                    This will generate a single-use link that will be valid for 1 week
                                    and will grant the user the permissions you provide for the list
                                    (read is always the bare minimum).
                                </section>
                                <section>
                                    <CustomCheckbox disabled={true} checked={true}>
                                        Read
                                    </CustomCheckbox>
                                    <CustomCheckbox checked={canUpdate} onChange={() => {
                                        // Invert the current state
                                        setCanUpdate(!canUpdate);
                                    }}>
                                        Update
                                    </CustomCheckbox>
                                    <CustomCheckbox checked={canDelete} onChange={() => {
                                        // Invert the current state
                                        setCanDelete(!canDelete);
                                    }}>
                                        Delete
                                    </CustomCheckbox>
                                </section>
                                <button onClick={handleShare}>Generate link</button>
                                <div className={styles.shareLinkContainer}>
                                    <span className={styles.shareLink}>
                                        {shareLink} 
                                        <span onClick={handleCopyToClipboard} className={styles.clipboardIcon}>
                                            <FaClipboard />
                                        </span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
                {isAuthenticated ? (
                    <Link to="/NewShoppingList" className={styles.createNewListBtn}>Create New List</Link>
                ) : <Link to="/login" className={styles.loginBtn}>Go sign in</Link>
                }
            </div>
        </main>
    );
}

export default Dashboard;
