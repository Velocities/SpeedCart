import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaShare, FaClipboard } from 'react-icons/fa';

import { useAuth, fetchOwnedShoppingLists, fetchSharedShoppingLists, deleteShoppingList, createShareLink, AuthContextType } from 'shared';

import PageLayout from '@components/PageLayout';
import Modal from '@components/Modal';
import CustomCheckbox from '@components/CustomCheckbox';

import { RequestStatus } from '@constants/enums';

import styles from './Dashboard.module.css';

function Dashboard() {
    const [shoppingListTitles, setShoppingListTitles] = useState([]);
    const [sharedShoppingListTitles, setSharedShoppingListTitles] = useState([]);
    const [error, setError] = useState(null);
    const [sharedListsError, setSharedListsError] = useState(null);
    const [deletionStatus, setDeletionStatus] = useState(RequestStatus.IDLE);
    const [ownerListsAreLoading, setOwnerListsAreLoading] = useState<boolean>(true);
    const [sharedListsAreLoading, setSharedListsAreLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);
    // All state variables for list sharing
    const [shareListId, setShareListId] = useState(null);
    const [shareLink, setShareLink] = useState('Link will show here');
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const { isAuthenticated, logout, callBackendAPI }: AuthContextType = useAuth();

    const showOwnedShoppingLists = async () => {
        setOwnerListsAreLoading(true);
        setSharedListsAreLoading(true);
        setSharedListsError(null);
        setError(null);
        // Retrieve lists owned by user
        const ownedResponse: Response = await callBackendAPI(fetchOwnedShoppingLists, {});

        try {
            console.log('Owned lists response:', ownedResponse);  // Log the response object
            if (!ownedResponse.ok) {
                if (ownedResponse.status === 401) {
                    setOwnerListsAreLoading(false);
                    logout();
                    throw new Error('Authorization error; please try signing in again at the Login page');
                } else {
                    throw new Error('Network response was not ok with status ' + ownedResponse.status);
                }
            }
            const ownedData = await ownedResponse.json();
            setShoppingListTitles(ownedData);
            setOwnerListsAreLoading(false);
        } catch(error) {
            setError(error.toString());
            setOwnerListsAreLoading(false);
        }
    }

    const showSharedShoppingLists = async () => {
        // Retrieve lists shared with user
        const sharedResponse: Response = await callBackendAPI(fetchSharedShoppingLists, {});
        try {
            if (!sharedResponse.ok) {
                console.log('Shared lists response:', sharedResponse);  // Log the response object
                // We need to read this
                // Read and log the response body
                const reader = sharedResponse.body.getReader();
                reader.read().then(({ done, value }) => {
                    if (!done) {
                        const decoder = new TextDecoder();
                        const text = decoder.decode(value);
                        console.log('Shared lists response body:', text); // Log the response body
                    }
                }).catch(err => {
                    console.error('Error reading response body:', err);
                });
                
                if (sharedResponse.status === 401) {
                    logout();
                    throw new Error('Authorization error; please try signing in again at the Login page');
                } else {
                    throw new Error('Network response was not ok with status ' + sharedResponse.status);
                }
            }
            const sharedData = await sharedResponse.json();
            setSharedShoppingListTitles(sharedData);
            setSharedListsAreLoading(false);
        } catch(error) {
            setSharedListsError(error.toString());
            setSharedListsAreLoading(false);
        };
    }

    useEffect(() => {
        document.title = "View shopping lists";

        if (!isAuthenticated) {
            setOwnerListsAreLoading(false);
            setSharedListsAreLoading(false);
            setSharedListsError('You are not signed in; please try signing in at the Login page');
            setError('You are not signed in; please try signing in at the Login page');
            //return;
        } else {
            // These both run asynchronously for speed
            showOwnedShoppingLists();
            showSharedShoppingLists();
        }
    }, [isAuthenticated, logout]);

    const handleDelete = async (listId: string) => {
        if (!window.confirm('Are you sure you want to delete this?')) {
            return;
        }

        setDeletionStatus(RequestStatus.LOADING);
        
        if (!isAuthenticated) {
            setDeletionStatus(RequestStatus.ERROR);
            return;
        }

        const response: Response = await callBackendAPI(deleteShoppingList, {
            listId: listId
        });

        try {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authorization error; please try signing in again at the Login page');
                } else {
                    throw new Error('Network response was not ok with status ' + response.status);
                }
            }
            setDeletionStatus(RequestStatus.SUCCESS);
            // Filter out the deleted list from the state
            setShoppingListTitles(prevLists => prevLists.filter(list => list.list_id !== listId));
        } catch (error) {
            setError(error.toString());
            setDeletionStatus(RequestStatus.ERROR);
        }
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
            
            const response: Response = await callBackendAPI(createShareLink, {
                shareListId: shareListId,
                permissions: {
                    can_update: canUpdate,
                    can_delete: canDelete
                }
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
        <>
            <PageLayout
                status={deletionStatus}
                modalProps={{
                    loadingText:'Attempting deletion...',
                    successText:'Deletion successful! Updating your list of shopping lists...',
                    errorText:`Deletion failed! ${error}`
                }}
            >
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
                                        <CustomCheckbox disabled={true} checked={true} flexType={'flex'}>
                                            Read
                                        </CustomCheckbox>
                                        <CustomCheckbox checked={canUpdate} flexType={'flex'} onChange={() => {
                                            // Invert the current state
                                            setCanUpdate(!canUpdate);
                                        }}>
                                            Update
                                        </CustomCheckbox>
                                        <CustomCheckbox checked={canDelete} flexType={'flex'} onChange={() => {
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
            </PageLayout>
        </>
    );
}

export default Dashboard;