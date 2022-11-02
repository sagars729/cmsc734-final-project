import React from 'react';
import './Card.css';

function Card(  ) {
    return (
        <div className='Card'>
            <div className='left_info'>
                <div className='timestamp'>
                    <header></header>
                </div>
                <div className='variable'>
                    <p></p>
                </div>
            </div>
            <div className='right_input'>
                <input type='text'></input>
            </div>
        </div>
    )
}

export default Card