import './LoginHistoryTable.css';
import axios from 'axios';
import React, { useState, useEffect } from "react";

function LoginHistoryTable({ id }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get("https://localhost:7157/User/getUserLoginHistory/" + id)
            .then(response => {
                console.log("getUserLoginHistory", response.data);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

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
        <div className='tableLoginHistory'>
            <div>
                <h3 className='alertMessage'>
                    Если вы заметили подозрительную активность - смените пароль
                </h3>
            </div>
            <div>
                {data ? (
                    <table className="tableCoins">
                        <thead>
                        <tr className='tableHead'>
                            <th>Дата</th>
                            <th>IP адресс</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(data.$values) && data.$values.length > 0 ? (
                            data.$values.map(loginHistory => (
                                <tr key={loginHistory.id}>
                                    <td>{formatDate(loginHistory.dateCreated)}</td>
                                    <td>{loginHistory.ipAddress}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default LoginHistoryTable;
