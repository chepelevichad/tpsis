import React, { useState } from 'react';
import axios from "axios";
import './ServicePage.css';


const PaymentPage = ({ serviceName, serviceDescription, senderId, coinName, quantityForSend }) => {
    const [paymentCode, setPaymentCode] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(10);

    const handlePaymentCodeChange = (event) => {
        setPaymentCode(event.target.value);
    };

    const handlePayment = () => {
        if (!senderId || !coinName || !quantityForSend) {
            //setText("Введите данные");
            return;
        }
        //setText('Загрузка...');
        axios.post('https://localhost:7157/Transaction/sendCrypto', { receiverId: "b0e369e8-a4fa-4ffa-86d4-2f69ccd90404", senderId, coinName : "usdt", paymentAmount })
            .then(response => {
                //setText(response.data);
            })
            .catch(error => {
                //setText(error.response.data);
                console.log(error);
            });
    }

    return (
        <div>
            <div>
                <h2>{serviceName}</h2>
                <p>Описание сервиса: {serviceDescription}</p>
            </div>

            <div>
                <label>
                    Код оплаты:
                    <input type="text" value={paymentCode} onChange={handlePaymentCodeChange}/>
                </label>
            </div>

            <div>
                <p>Сумма к оплате: 10 usdt</p>
            </div>

            <button className="qwertgf" onClick={handlePayment}>Оплатить</button>
        </div>
    );
};

export default PaymentPage;