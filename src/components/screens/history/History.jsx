import styles from './History.css';
import usdtIcon from '../../../assets/images/cryptoicons_png/64/usdt.png';
import mainIcon from '../../../assets/images/UP_cryptowallet.png';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavBar from '../../navBar/NavBar.jsx';
import ConversionHistory from '../../conversions/Conversions';
import DepositHistory from '../../depositHistory/DepositHistory';
import WithdrawHistory from '../../withdrawHistory/WithdrawHistory';
import TransactionsHistory from '../../transactionsHistory/TransactionsHistory';



function History(props) {
    const id = props.location.state.id;
    const [errorMessage, setText] = useState('-----');
    const [quantityCoin, setCoinQuantity] = useState();
    const [receiverId, setRecieverId] = useState(id);
    const [senderId] = useState(id);
    const [coinName, setCoinName] = useState();
    const [quantityForSend, setQuantityForSend] = useState();

    console.log(6, id)

    const [isMasked, setIsMasked] = useState(false);

    const handleMaskBalance = () => {
        setIsMasked(!isMasked);
    };



    const maskedBalance = "*********";
    const [balanceData, setBalanceData] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get("https://localhost:7157/Transaction/getUserConversationsHistory/" + id)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);  // Add 'id' as a dependency




    useEffect(() => {
        axios.get("https://localhost:7157/Currency/getUserBalance?userId=" + id)
            .then(response => {
                console.log(data);
                setBalanceData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const menuIcoins = {};
    function importAllMenuIcons(r) {
        r.keys().forEach((key) => (menuIcoins[key] = r(key)));
    }
    importAllMenuIcons(require.context("../../../assets/images/standart_menu_icons", false, /\.(png|jpe?g|svg)$/));


    const coinIcoins = {};
    function importAllCoinsIcons(r) {
        r.keys().forEach((key) => (coinIcoins[key] = r(key)));
    }
    importAllCoinsIcons(require.context("../../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));


    const handleButtonClick = (component) => {
        setSelectedComponent(component);
    }

    const [selectedComponent, setSelectedComponent] = useState('coversionHistory');

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'coversionHistory':
                return <ConversionHistory id={id} />;
            case 'depositHistory':
                return <DepositHistory id={id} />;
            case 'withdrawMoney':
                return <WithdrawHistory id={id} />;
            case 'transactionsHistory':
                return <TransactionsHistory id={id} />;
            default:
                return <ConversionHistory id={id} />;
        }
    }

    const [userName, setUserName] = useState('');

    useEffect(() => {
        axios.get("https://localhost:7157/User/getUserLoginById?id=" + id)
            .then(response => {
                console.log("Username:" + data);
                setUserName(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container">
            <div className="navBar">
                <div className="navBar">
                    <img className="upIcon" src={mainIcon} alt="UP icon"></img>
                    <div className="loginLbl">
                        <h2>{userName}</h2>
                    </div>
                    <div className="balanceLbl">
                        {balanceData ? (
                            <div>
                                <p>{isMasked ? maskedBalance : balanceData.toFixed(3) + "$"}</p>
                                <button className='btnMaskBalance' onClick={handleMaskBalance}>
                                    {isMasked ? "Показать" : "Скрыть"}
                                </button>
                            </div>
                        ) : (
                            <p>0$</p>
                        )}
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/menu', state: props.location.state}}><img
                            className="MenuIcon"
                            src={menuIcoins['./wallet.png']}
                            alt="Buy icon"></img>Кошелек</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/convertCrypto', state: props.location.state}}><img
                            className="MenuIcon" src={menuIcoins['./two-arrows.png']} alt="Exchange icon"></img>Конвертировать</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/buyCrypto', state: props.location.state}}><img
                            className="MenuIcon" src={menuIcoins['./credit-card.png']}
                            alt="Buy icon"></img>Купить</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/sellCrypto', state: props.location.state}}><img
                            className="MenuIcon" src={menuIcoins['./sell.png']} alt="Buy icon"></img>Продать</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/historyMenu', state: props.location.state}}><img
                            className="MenuIcon" src={menuIcoins['./stake.png']} alt="Sell icon"></img>История</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/sendCrypto', state: props.location.state}}> <img
                            className="MenuIcon" src={menuIcoins['./money.png']} alt="Send icon"></img>Отправить</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/coins', state: props.location.state}}> <img
                            className="MenuIcon"
                            src={menuIcoins['./cryptocurrencies.png']}
                            alt="Token icon"></img>Токены</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/accountMenu', state: props.location.state}}><img
                            className="MenuIcon" src={menuIcoins['./user.png']} alt="Account icon"></img>Аккаунт</Link>
                    </div>
                    <div className="MenuCaseItem">
                        <Link className="MenuCase" to={{pathname: '/', state: props.location.state}}><img
                            className="MenuIcon"
                            src={menuIcoins['./power-off.png']}
                            alt="Exit icon"></img>Выход</Link>
                    </div>
                </div>
            </div>
            <div className='historyPanel'>
                <div className='buttonsBar'>
                    <nav className="menu1">
                        <ul>
                            <button className="btnAccountMenuCase"
                                    onClick={() => handleButtonClick('coversionHistory')}>Конвертации
                            </button>
                            <button className="btnAccountMenuCase"
                                    onClick={() => handleButtonClick('depositHistory')}>Пополнения
                            </button>
                            <button className="btnAccountMenuCase"
                                    onClick={() => handleButtonClick('withdrawMoney')}>Выводы
                            </button>
                            <button className="btnAccountMenuCase"
                                    onClick={() => handleButtonClick('transactionsHistory')}>Транзакции
                            </button>
                        </ul>
                    </nav>
                </div>
                <div className='bottomUserPanel'>
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default History;