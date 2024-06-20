import styles from './DepositHistory.css';
import axios from 'axios';
import React, { useState, useEffect } from "react";

function DepositHistory({ id }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:7157/Transaction/getUserDepositHistory/${id}`)
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

    const coinIcons = {};
    function importAllCoinsIcons(r) {
        r.keys().forEach((key) => (coinIcons[key] = r(key)));
    }
    importAllCoinsIcons(require.context("../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        };
        return date.toLocaleDateString('ru-RU', options);
    }

    return (
        <div className='depositHistoryPanel'>
            {data ? (
                <div>
                    <table className="tableReplenisment">
                        <thead>
                        <tr className='tableHead'>
                            <th>№</th>
                            <th>Дата</th>
                            <th>Кол-во</th>
                            <th>Комиссия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(data.$values) && data.$values.length > 0 ? (
                            data.$values.map((deposit, index) => (
                                deposit.id ? (
                                    <tr key={deposit.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDate(deposit.dateCreated)}</td>
                                        <td>{deposit.quantity + ' $'}</td>
                                        <td>{deposit.commission + ' $'}</td>
                                    </tr>
                                ) : null
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Нет информации</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DepositHistory;
