import React from 'react';
import { Link } from 'react-router-dom';
import './css/Dashboard.css';

function Dashboard() {
    return (
        <div>
            {/* Contact the API*/}
            <p>No lists</p>
            <Link to="/ShoppingList" id="createNewListBtn">Create New List</Link>
        </div>
    );
}

export default Dashboard;