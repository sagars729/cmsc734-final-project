import React from 'react';
import UserInput from '../UserInput/UserInput';
import './UserEditPage.css';

function UserEditPage() {
    return (
        <div>
            <div className="split left">
                <UserInput />
            </div>

            <div className="split right">
                <div className="centered">
                    <h2>Graph from Shubham</h2>
                </div>
            </div>
        </div>
    )
}

export default UserEditPage;