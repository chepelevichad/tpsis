import styles from './Conversions.css';
import axios from 'axios';
import React, { useState, useEffect } from "react";

function Conversions({ id }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:7157/Transaction/getUserConversationsHistory/${id}`)
            .then(response => {
                console.log(5, response.data);
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
        <div className='bottomUserPanel'>
            {data ? (
                <table className="tableCoins1">
                    <thead>
                    <tr className='tableHead'>
                        <th>№</th>
                        <th>Сумма</th>
                        <th>Нач. монета</th>
                        <th></th>
                        <th>Кон. монета</th>
                        <th></th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(data.$values) && data.$values.length > 0 ? (
                        data.$values.map((conversion, index) => (
                            conversion.id ? (
                                <tr key={index}>
                                    <td>{conversion.id}</td>
                                    <td>{conversion.quantityUSD?.toFixed(3) + ' $'}</td>
                                    <td>
                                        <img className="coinIcon" src={coinIcons['./' + conversion.beginCoinShortname + '.png']} alt="icon" />
                                    </td>
                                    <td>{conversion.beginCoinShortname}({conversion.beginCoinQuantity?.toFixed(9)})</td>
                                    <td>
                                        <img className="coinIcon" src={coinIcons['./' + conversion.endCoinShortname + '.png']} alt="icon" />
                                    </td>
                                    <td>{conversion.endCoinShortname}({conversion.endCoinQuantity?.toFixed(9)})</td>
                                    <td>{formatDate(conversion.dateCreated)}</td>
                                </tr>
                            ) : null
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Нет информации</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            ) : (
                <div className='loadingPanel'>
                    Loading...
                </div>
            )}
        </div>
    );
}

export default Conversions;