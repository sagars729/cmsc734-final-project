import React from 'react';
import Card from '../Card/Card';
import './UserInput.css';

function UserInput() {
    return (
        <div>
            <div className="split left">
                <div className="centered">
                    <Card />
                </div>
                </div>

                <div className="split right">
                <div className="centered">
                    <h2>Graph from Shubham</h2>
                </div>
                </div>
        </div>
    )
}

export default UserInput;