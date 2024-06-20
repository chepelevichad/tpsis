import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServisesTable.css';
import loadingGif from '../../assets/images/loading.gif';
import apple from '../../assets/images/companiesIcons/apple.png';
import bc from '../../assets/images/companiesIcons/burger.png';
import sigma from '../../assets/images/companiesIcons/sigma.png';
import pubg from '../../assets/images/companiesIcons/pubg.png';
import maxler from '../../assets/images/companiesIcons/maxler.png';
import rockstar from '../../assets/images/companiesIcons/rockstar.png';
import skyline from '../../assets/images/companiesIcons/skyline.png';

function LoginHistoryTable({ id }) {
    const [data, setData] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [previousService, setPreviousService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setText] = useState('________________________________________________________________');

    useEffect(() => {
        axios.get("https://localhost:7157/Service")
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
                setError("Error fetching service data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleServiceSelection = (service) => {
        setPreviousService(selectedService); // Store the previous service
        setSelectedService(service);
    };

    const handleBack = () => {
        setSelectedService(previousService); // Go back to the previous service
    };

    const handlePayment = () => {
        axios.post('https://localhost:7157/Transaction/sendCrypto', { "receiverId": "630aa273-f326-4346-9bc6-ac313ca9b207", "senderId" : id, "coinName" : "usdt", "quantityForSend": 10 })
            .then(response => {
                setText(response.data);
            })
            .catch(error => {
                setText(error.response.data);
                console.log(error);
            });
    }

    return (
        <div>
            {loading &&
                <div className='loadingPanel'><img className="loadingGif" src={loadingGif} alt="loading"/></div>}
            {error && <div>Error: {error}</div>}
            <div className="selectedServiceContainer">
                {selectedService ? (
                    <div className="qwer">
                    <div>
                        <img className="serviceIcon" src={selectedService.photoName === 'apple.png' ? apple :
                            selectedService.photoName === 'burger.png' ? bc :
                                selectedService.photoName === 'sigma.png' ? sigma :
                                    selectedService.photoName === 'pubg.png' ? pubg :
                                        selectedService.photoName === 'maxler.png' ? maxler :
                                            selectedService.photoName === 'rockstar.png' ? rockstar :
                                                selectedService.photoName === 'skyline.png' ? skyline : ''}
                             alt={`Icon for ${selectedService.name}`}/>

                        <div>
                            <h2>{selectedService.name}</h2>
                        </div>
                        <div className="selectedServiceContent test-service">
                            <h4>{selectedService.about}</h4>
                        </div>
                        <div>
                            <p>Сумма к оплате: 10 usdt</p>
                        </div>

                        <h3 className="errorText">{errorMessage}</h3>

                        <button className="qwertgf" onClick={handlePayment}>Оплатить</button>
                        <button className="qwertgf" onClick={handleBack}>Назад</button>
                    </div>
                    </div>
                ) : (
                    <div className="tableContainer">
                        <table className="tableServices">
                            <thead>
                            <tr className='tableHead'>
                                <th>Сервис</th>
                                <th>Название</th>
                                <th>Перейти</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data && data.map(service => (
                                <tr key={service.id}>
                                    <td className="serviceIconColumn">
                                        {service.photoName === 'apple.png' &&
                                            <img className="serviceIcon" src={apple} alt={`Icon for ${service.name}`}/>}
                                        {service.photoName === 'burger.png' &&
                                            <img className="serviceIcon" src={bc} alt={`Icon for ${service.name}`}/>}
                                        {service.photoName === 'sigma.png' &&
                                            <img className="serviceIcon" src={sigma} alt={`Icon for ${service.name}`}/>}
                                        {service.photoName === 'pubg.png' &&
                                            <img className="serviceIcon" src={pubg} alt={`Icon for ${service.name}`}/>}
                                        {service.photoName === 'maxler.png' &&
                                            <img className="serviceIcon" src={maxler}
                                                 alt={`Icon for ${service.name}`}/>}
                                        {service.photoName === 'rockstar.png' &&
                                            <img className="serviceIcon" src={rockstar}
                                                 alt={`Icon for ${service.name}`}/>}
                                        {service.photoName === 'skyline.png' &&
                                            <img className="serviceIcon" src={skyline}
                                                 alt={`Icon for ${service.name}`}/>}
                                    </td>
                                    <td className="nameColumn">{service.name}</td>
                                    <td className="buttonColumn">
                                        <button className="chinazes" onClick={() => handleServiceSelection(service)}>
                                            Перейти
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginHistoryTable;