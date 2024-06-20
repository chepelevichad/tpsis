import './AdminMenu.css';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import BlockingMenu from '../../../components/blokingMenu/blocking';
import { useHistory } from 'react-router-dom';
import TransactionsHistory from '../../../components/transactionsHistory/TransactionsHistory';
import Cookies from "js-cookie";

function AdminMenu({ id }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [token, setUserToken] = useState('');
    const history = useHistory();

    const headers = {
        Authorization: `Bearer ${token}`
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('token');
                if (token) {
                    setUserToken(token);
                    const response = await axios.get("https://localhost:7157/Admin/getUserList", { headers });
                    setData(response.data.$values);
                    console.log(response);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            axios.interceptors.request.use(config => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            });
        }
    }, []);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setUserToken(token)
        }
    }, []);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

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

    function sortTable(column) {
        if (sortColumn === column) {
            setSortDirection(sortDirection * -1);
        } else {
            setSortColumn(column);
            setSortDirection(1);
        }
    }

    function getSortedData() {
        if (sortColumn) {
            return [...filteredData].sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];
                if (aValue < bValue) {
                    return -1 * sortDirection;
                } else if (aValue > bValue) {
                    return sortDirection;
                } else {
                    return 0;
                }
            });
        } else {
            return filteredData;
        }
    }

    const sortedData = getSortedData();

    const handleModalOpen = (selectedUser) => {
        setSelectedUser(selectedUser);
        //setIsModalOpen(true);
    };

    const handleButtonClick = async (buttonName, userId) => {
        setSelectedUserId(userId);

        if (selectedComponent === buttonName) {
            setSelectedComponent(null);
            setSelectedUserId(null);
        } else {
            setSelectedComponent(buttonName);
            setSelectedUserId(userId);
        }
    };

    const setSearchTerm = (term) => {
        const filtered = data.filter(user => user.login.toLowerCase().includes(term.toLowerCase()));
        setFilteredData(filtered);
    };

    const setStatusDel = async (userId, statusDel) => {
        try {
            const url = 'https://localhost:7157/Admin/setStatusDel';
            const params = {
                id: userId,
                status: !statusDel
            };
            console.log('----------------------'); // Обработка ответа сервера
            console.log(headers); // Обработка ответа сервера
            const response = await axios.put(url, null, { params });
            console.log(response.data); // Обработка ответа сервера
            axios.get("https://localhost:7157/Admin/getUserList", { headers })
                .then(response => {
                    setData(response.data.$values);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const btnBackClick = () => {
        history.push('/');
    };

    const btnTClick = () => {
        history.push('/admin-tokens');
    };

    const handleBlockUser = async () => {
        try {
            const url = `https://localhost:7157/Admin/setStatusBlock?id=${selectedUser.id}&status=true`;
            const response = await axios.put(url);
            console.log(response.data);

            const messageBody = {
                userId: selectedUser.id,
                message: blockReason
            };
            await axios.patch('https://localhost:7157/Email/send-message-block', messageBody, { headers });

            axios.get("https://localhost:7157/Admin/getUserList")
                .then(response => {
                    setData(response.data.$values);
                })
                .catch(error => {
                    console.log(error);
                });

            setShowPopup(false); // Закрытие попапа после успешной отправки сообщения
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            const url = `https://localhost:7157/Admin/setStatusBlock?id=${userId}&status=false`;
            const response = await axios.put(url);
            console.log(response.data); // Обработка ответа сервера

            // Обновление списка пользователей после разблокировки
            axios.get("https://localhost:7157/Admin/getUserList", { headers })
                .then(response => {
                    setData(response.data.$values);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleBlockingBtnClick = (user) => {
        if (user.isBlocked) {
            handleUnblockUser(user.id); // Разблокировать пользователя, если он уже заблокирован
        } else {
            togglePopup(); // Открыть попап для блокировки пользователя, если он активен
        }
    };

    const togglePopup = () => {
        console.log(1)
        setShowPopup(!showPopup);
    };

    return (
        <div className="containerAdmin">
            <div className='menuAdmin'>
                <div className='searchPanelAdmin'>
                    <button className='btnBack' onClick={btnBackClick}>
                        Выйти
                    </button>
                    <button className='btnBack' onClick={btnTClick}>
                        Токены
                    </button>
                    <input className='inputField1' type="text" placeholder="Введите логин пользователя"
                           onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
            </div>
            <div className="userList">
                {Array.isArray(sortedData) && sortedData.length > 0 ? (
                    <table className="usersTable">
                        <thead>
                        <tr className='tableHead'>
                            <th className="btnColumn" onClick={() => sortTable('id')}>ID</th>
                            <th onClick={() => sortTable('login')}>Логин</th>
                            <th>Email</th>
                            <th onClick={() => sortTable('dateCreated')}>Дата создания</th>
                            <th onClick={() => sortTable('dateUpdated')}>Дата модификации</th>
                            <th className="btnColumn">Блокировка</th>
                            <th className="btnColumn">Удаление</th>
                            <th className="btnColumn">Информация</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedData.map((user) => (
                            <React.Fragment key={user.id}>
                                <tr onClick={() => handleModalOpen(user)}>
                                    <td>{user.id}</td>
                                    <td>{user.login}</td>
                                    <td>{user.email}</td>
                                    <td>{formatDate(user.dateCreated)}</td>
                                    <td>{formatDate(user.dateUpdated)}</td>
                                    <td>
                                        <button className='blockingBtn' onClick={() => handleBlockingBtnClick(user)}>
                                            {user.isBlocked ? 'Разблок' : 'Блок'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className={user.isDeleted ? 'deleted' : 'not-deleted'}
                                                onClick={() => setStatusDel(user.id, user.isDeleted)}>
                                            {user.isDeleted ? 'Восстановить' : 'Удалить'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className='btnInfo'
                                                onClick={() => handleButtonClick('loginHistory', user.id)}>
                                            Информация
                                        </button>
                                    </td>
                                </tr>
                                {selectedUserId === user.id && (
                                    <tr>
                                        <td colSpan="8">
                                            {selectedComponent === 'loginHistory' && (
                                                <TransactionsHistory id={selectedUserId}/>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            {selectedUser && !selectedUser.isBlocked && showPopup && (
                <div className={showPopup ? "popup" : "hidden"}>
                    <div className="popup-inner">
                        <h4>Заблокировать пользователя
                            ({selectedUser ? `${selectedUser.login} - ${selectedUser.id}` : '-'})</h4>
                        <label htmlFor="blockReason">Причина блокировки:</label>
                        <div>
                            <textarea className="textboyyy" id="blockReason" value={blockReason}
                                      onChange={(e) => setBlockReason(e.target.value)}/>
                        </div>
                        <button className="btnBlock" onClick={handleBlockUser}>Блок.</button>
                        <button className="close" onClick={togglePopup}>Закрыть</button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default AdminMenu;