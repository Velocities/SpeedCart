import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import mainSiteStyles from '../../pages/main.module.css';

function Dashboard() {
    return (
        <div className={mainSiteStyles.topElement}>
            {/* Contact the API*/}
            <p>No lists</p>
            <Link to="/NewShoppingList" id="createNewListBtn">Create New List</Link>
        </div>
    );
}

export default Dashboard;