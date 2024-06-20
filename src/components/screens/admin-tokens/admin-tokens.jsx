import './admin-tokens.css';
import axios from 'axios';
import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import loadingGif from "../../../assets/images/loading.gif";
import Cookies from "js-cookie";

function AdminMenu({ id }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setUserToken] = useState('');
    const history = useHistory();

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setUserToken(token)
        }else {
            history.push('/');
        }
    }, []);

    useEffect(() => {
        axios.get('https://localhost:7157/Admin/get-all-coins', { headers })
            .then(response => {
                const coins = response.data.$values.filter(coin => coin.shortName !== '$id');
                setData(coins);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    const coinIcons = {};

    function importAllCoinsIcons(r) {
        r.keys().forEach((key) => (coinIcons[key] = r(key)));
    }
    importAllCoinsIcons(require.context("../../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));

    const btnBackClick = () => {
        history.push('/');
    };

    const btnTClick = () => {
        history.push('/adminMenu');
    };

    const handleStatusChange = (coinName, status) => {
        const cookies = document.cookie.split(';');

        // Проходимся по каждой куки и удаляем её, устанавливая для неё истекшую дату
        cookies.forEach(cookie => {
            const cookieParts = cookie.split('=');
            const cookieName = cookieParts[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        axios.patch(`https://localhost:7157/Admin/set-coin-status?coinName=${coinName}&status=${status}`)
            .then(response => {
                axios.get('https://localhost:7157/Admin/get-active-coins', { headers })
                    .then(response => {
                        const coins = response.data.$values.filter(coin => coin.shortName !== '$id');
                        setData(coins);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        setIsLoading(false);
                    });
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = () => {
        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (sortConfig.direction === 'ascending') {
                return (aValue?.toString()?.localeCompare(bValue?.toString())) || 0;
            } else {
                return (bValue?.toString()?.localeCompare(aValue?.toString())) || 0;
            }
        });
    };

    const filteredData = () => {
        return sortedData().filter(coin => coin.shortName.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    return (
        <div className="containerAdmin">
            <div className='menuAdmin'>
                <div className='searchPanelAdmin'>
                    <button className='btnBack' onClick={btnBackClick}>
                        Выйти
                    </button>
                    <button className='btnBack' onClick={btnTClick}>
                        Плзвтл.
                    </button>
                    <input
                        className='inputField1'
                        type="text"
                        placeholder="Поиск монеты..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div>
                {isLoading ? (
                    <img src={loadingGif} alt="Loading..."/>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th onClick={() => requestSort('shortName')}>
                                Монета
                                {sortConfig.key === 'shortName' && sortConfig.direction === 'ascending' && <span>&uarr;</span>}
                                {sortConfig.key === 'shortName' && sortConfig.direction === 'descending' && <span>&darr;</span>}
                            </th>
                            <th onClick={() => requestSort('fullName')}>
                                Сокращенное название
                                {sortConfig.key === 'fullName' && sortConfig.direction === 'ascending' && <span>&uarr;</span>}
                                {sortConfig.key === 'fullName' && sortConfig.direction === 'descending' && <span>&darr;</span>}
                            </th>
                            <th onClick={() => requestSort('dateUpdated')}>
                                Полное название
                                {sortConfig.key === 'dateUpdated' && sortConfig.direction === 'ascending' && <span>&uarr;</span>}
                                {sortConfig.key === 'dateUpdated' && sortConfig.direction === 'descending' && <span>&darr;</span>}
                            </th>
                            <th>Статус</th>
                            <th>Дата изменения</th>
                            <th>Дата создания</th>
                            <th>Изменить статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            filteredData().map((coin, index) => (
                                <tr key={index}>
                                    <td>
                                        <img className="coinIcon" src={coinIcons['./' + coin.shortName + '.png']}
                                             alt="icon"/>
                                    </td>
                                    <td>{coin.shortName}</td>
                                    <td>{coin.fullName}</td>
                                    <td style={{color: coin.isActive ? 'green' : 'red'}}>
                                        {coin.isActive ? 'Активен' : 'Отключен'}
                                    </td>
                                    <td>{coin.dateUpdated ? coin.dateUpdated : 'Нет информации'}</td>
                                    <td>{coin.dateCreated ? new Date(coin.dateCreated).toLocaleString() : 'Нет информации'}</td>
                                    <td>
                                        <button onClick={() => handleStatusChange(coin.shortName, !coin.isActive)}>
                                            {coin.isActive ? 'Отключить' : 'Активировать'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Нет информации</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminMenu;
