import styles from './WithdrawHistory.css';
import axios from 'axios';
import React, {useState, useEffect} from "react";

function WithdrawHistory({id}) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:7157/Transaction/getUserWithdrawalsHistory/${id}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

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
        <div className='withdrawHistoryPanel'>
            {data ? (
                <div>
                    <table className="tableReplenisment">
                        <thead>
                        <tr className='tableHead'>
                            <th>№</th>
                            <th>Дата</th>
                            <th>Кол-во</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(data.$values) && data.$values.length > 0 ? (
                            data.$values.map((withdraw, index) => (
                                withdraw.id ? (
                                    <tr key={withdraw.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDate(withdraw.dateCreated)}</td>
                                        <td>{withdraw.quantity + ' $'}</td>
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

export default WithdrawHistory;
