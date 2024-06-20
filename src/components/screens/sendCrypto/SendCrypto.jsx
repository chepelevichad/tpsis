import './SendCrypto.css';
import usdtIcon from '../../../assets/images/cryptoicons_png/64/usdt.png';
import mainIcon from '../../../assets/images/UP_cryptowallet.png';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavBar from '../../navBar/NavBar.jsx';



function BuyCryptoForm(props) {
    const { id, login, password, email, creationData, isBlocked, isDeleted, modificationDate, roleId, salt } = props.location.state;
    const [errorMessage, setText] = useState('________________________________________________________________');
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const coins = [
        { value: "BTC", label: "Bitcoin - BTC" },
        { value: "ETH", label: "Ethereum - ETH" },
        { value: "USDT", label: "Tether - USDT" },
        { value: "BNB", label: "Binance Coin - BNB" },
        { value: "SOL", label: "Solana - SOL" },
        { value: "ADA", label: "Cardano - ADA" },
        { value: "XRP", label: "XRP - XRP" },
        { value: "DOT", label: "Polkadot - DOT" },
        { value: "DOGE", label: "Dogecoin - DOGE" },
        { value: "UNI", label: "Uniswap - UNI" },
        { value: "LUNA", label: "Terra - LUNA" },
        { value: "LINK", label: "Chainlink - LINK" },
        { value: "AVAX", label: "Avalanche - AVAX" },
        { value: "MATIC", label: "Polygon - MATIC" },
        { value: "SHIB", label: "Shiba Inu - SHIB" },
        { value: "ATOM", label: "Cosmos - ATOM" },
        { value: "FIL", label: "Filecoin - FIL" },
        { value: "XTZ", label: "Tezos - XTZ" },
        { value: "LTC", label: "Litecoin - LTC" },
        { value: "FTT", label: "FTX Token - FTT" },
        { value: "ALGO", label: "Algorand - ALGO" },
        { value: "VET", label: "VeChain - VET" },
        { value: "EOS", label: "EOS - EOS" },
        { value: "TRB", label: "Tellor - TRB" },
        { value: "KSM", label: "Kusama - KSM" },
        { value: "CAKE", label: "PancakeSwap - CAKE" },
        { value: "TFUEL", label: "Theta Fuel - TFUEL" },
        { value: "SUSHI", label: "SushiSwap - SUSHI" },
        { value: "DCR", label: "Decred - DCR" },
        { value: "FET", label: "Fetch.ai - FET" }
    ];

    const menuIcoins = {};
    function importAllMenuIcons(r) {
        r.keys().forEach((key) => (menuIcoins[key] = r(key)));
    }
    importAllMenuIcons(require.context("../../../assets/images/standart_menu_icons", false, /\.(png|jpe?g|svg)$/));

    const [receiverId, setRecieverId] = useState(id);
    const [senderId] = useState(id);
    const [coinName, setCoinName] = useState('btc');
    const [quantityForSend, setQuantityForSend] = useState();

    const handleTokenChange = (event) => {
        const selectedCoin = coins.find((coin) => coin.value === event.target.value);
        if (selectedCoin) {
            setCoinName(selectedCoin.value.toLowerCase());
            setIconFinal(coinIcoins['./' + event.target.value.toLowerCase() + '.png'])
            getCoinQuantityInUserWallet(event.target.value.toLowerCase());
        }
    }

    const handleRecieverIdChange = (event) => {
        setRecieverId(event.target.value)
    }

    function handleConvert(event) {
        if (!receiverId || !senderId || !coinName || !quantityForSend) {
            setText("Введите данные");
            return;
        }
        setText('Загрузка...');
        event.preventDefault();
        axios.post('https://localhost:7157/Transaction/sendCrypto', { receiverId, senderId, coinName, quantityForSend })
            .then(response => {
                setText(response.data);
            })
            .catch(error => {
                console.log(error);
                if (error.response) {
                    // Если сервер вернул ответ с кодом ошибки
                    setText(`Не удалось совершить транзакцию`);
                } else if (error.request) {
                    // Если запрос был отправлен, но не получен ответ
                    setText('Нет ответа от сервера');
                } else {
                    // Если произошла ошибка при настройке запроса
                    setText('Ошибка настройки запроса');
                }
                console.error(error);
            });
    }

    const handleQuantityChange = (event) => {
        setQuantityForSend(event.target.value)
    }

    const [isMasked, setIsMasked] = useState(false);

    const handleMaskBalance = () => {
        setIsMasked(!isMasked);
    };

    const maskedBalance = "*********";
    const [balanceData, setBalanceData] = useState(null);
    const [data, setData] = useState(null);

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

    const coinIcoins = {};
    function importAllCoinsIcons(r) {
        r.keys().forEach((key) => (coinIcoins[key] = r(key)));
    }
    importAllCoinsIcons(require.context("../../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));

    const [iconSecond, setIconFinal] = useState(coinIcoins['./' + coinName + '.png']);
    const [quantityMaxCoin, setCoinMaxQuantity] = useState();

    const handleMaxLblClick = (event) => {
        console.log("quantityMaxCoin: " + quantityMaxCoin);
        setCoinMaxQuantity(quantityMaxCoin);
    }

    const getCoinQuantityInUserWallet = (coin) => {
        console.log("userId: " + id + "\ncoinName: " + coin);
        axios
            .get("https://localhost:7157/Currency/getCoinQuantityInUserWallet?userId=" + id + "&coinName=" + coin)
            .then((response) => {
                setCoinMaxQuantity(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
                        className="MenuIcon" src={menuIcoins['./credit-card.png']} alt="Buy icon"></img>Купить</Link>
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
            <div className="buingPanel">
            <div className="panel">
                    <div className="buy-crypto-form">
                        <h1 className='mainLbl'>
                            Отправить криптовалюту
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className='firstCoinPanel'>
                                <label>
                                    Отправить:
                                    <br />
                                    <br />
                                    <select className="selectInput" onChange={handleTokenChange}>
                                        {coins.map((coin) => (
                                            <option key={coin.value} value={coin.value}>
                                                {coin.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <br />
                                <label>
                                    <img className='usdtIcon' src={iconSecond} alt="coin" />
                                    <input type="number" placeholder="Введите сумму" onChange={handleQuantityChange} />
                                    <br />
                                    <br />
                                    <h4 onClick={handleMaxLblClick}>max: {quantityMaxCoin ? quantityMaxCoin : 0}</h4>
                                </label>
                            </div>
                            <br />
                            <div className="secondCoinPanel">
                                <label>
                                    UP-Id получателя:
                                    <br />
                                    <br />
                                    <br />
                                    <input className='recieverIdInput' placeholder="Введите UP-id получателя" onChange={handleRecieverIdChange} />
                                </label>
                            </div>
                            <div className='ratePanel'>
                                <br />
                                Будте внимательны! Отменить действие невозможно
                            </div>
                            <h3 className="errorText">{errorMessage}</h3>
                            <br />
                            <button className='buttonBuy' type="submit" onClick={handleConvert}>Отправить</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyCryptoForm;