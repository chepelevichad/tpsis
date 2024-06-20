import './BuyCrypto.css';
import usdtIcon from '../../../assets/images/cryptoicons_png/64/usdt.png';
import mainIcon from '../../../assets/images/UP_cryptowallet.png';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


function BuyCryptoForm(props) {
    const { id, login, password, email, creationData, isBlocked, isDeleted, modificationDate, roleId, salt } = props.location.state;
    const [errorMessage, setText] = useState('________________________________________________________________');

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

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchCoinQuantity1();
    };

    const [quantityCoin, setCoinQuantity] = useState();


    useEffect(() => {
        const fetchCoinQuantity = () => {
            axios
                .get(
                    "https://localhost:7157/Currency/getCoinQuantityInUserWallet?userId=" +
                    id +
                    "&coinName=usdt" +
                    "&quantityUSD="
                )
                .then((response) => {
                    setCoinQuantity(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        fetchCoinQuantity();
    }, []);


    const fetchCoinQuantity1 = () => {
        axios
            .get(
                "https://localhost:7157/Currency/getCoinQuantityInUserWallet?userId=" +
                id +
                "&coinName=usdt" +
                "&quantityUSD="
            )
            .then((response) => {
                setCoinQuantity(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
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


    const [quantity, setQuantity] = useState();
    const [userId, setUserId] = useState(id);
    const [coinName, setCoinName] = useState('btc');

    function handleBuy(event) {
        event.preventDefault();

        if (!userId || !coinName || !quantity) {
            setText("Введите количество");
            return;
        }
        setText('Загрузка...');
        axios.post('https://localhost:7157/Transaction/buyCrypto', { userId, coinName, quantity })
            .then(response => {
                console.log("Coinname: " + coinName);
                setText(response.data);
                fetchCoinQuantity1();
            })
            .catch(error => {
                setText(error.response.data);
                console.log(error);
            });
        fetchCoinQuantity1();
    }

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
        getCoinQuantity(event.target.value);
    }

    const getCoinQuantity = (quantityCoin) => {
        axios
            .get(`https://localhost:7157/Transaction/getCoinQuantity/${coinName}/${quantityCoin}`)
            .then((response) => {
                setCoinFinalQuantity(response.data);
            })
            .catch((error) => {
                setCoinFinalQuantity('?');
                console.log(error);
            });
    }

    const [isMasked, setIsMasked] = useState(false);

    const handleMaskBalance = () => {
        setIsMasked(!isMasked);
    };

    const maskedBalance = "*********";
    const [balanceData, setBalanceData] = useState(null);
    const [data, setData] = useState(null);

    const [quantityFinalCoin, setCoinFinalQuantity] = useState('?');

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

    useEffect(() => {
        axios.get(`https://localhost:7157/Transaction/getCoinQuantity/${coinName}/${quantity}`)
            .then(response => {
                console.log(data);
                setCoinFinalQuantity(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get(`https://localhost:7157/Transaction/getCoinQuantity/${coinName}/${quantity}`)
            .then((response) => {
                setCoinFinalQuantity(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [coinName]);


    const coinIcoins = {};
    function importAllCoinsIcons(r) {
        r.keys().forEach((key) => (coinIcoins[key] = r(key)));
    }
    importAllCoinsIcons(require.context("../../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));



    const handleTokenChange = (event) => {
        const selectedCoin = coins.find((coin) => coin.value === event.target.value);
        if (selectedCoin) {
            setCoinName(event.target.value.toLowerCase());
            setIconFinal(coinIcoins['./' + event.target.value.toLowerCase() + '.png'])
        }
    };
    const [iconSecond, setIconFinal] = useState(coinIcoins['./' + coinName + '.png']);


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
                            Купить
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className='sumPanel'>
                                <label>
                                    Отправить:
                                    <br/>
                                    <br/>
                                    <br/>
                                    <input type="number" placeholder="Введите сумму" onChange={handleQuantityChange}/>
                                    <h4>max: {quantityCoin ? quantityCoin.toFixed(5) : 0} USDT</h4>
                                    <img className='usdtIcon' src={usdtIcon} alt="usdt"/>
                                </label>
                            </div>
                            <br/>
                            <div className="coinPanel">
                                <label>
                                    Получить:
                                    <br/>
                                    <br/>
                                    <select className='tokenSelect' onChange={handleTokenChange}>
                                        {coins.map((coin) => (
                                            <option key={coin.value} value={coin.value}>
                                                {coin.label}
                                            </option>
                                        ))}
                                    </select>
                                    <img className='usdtIconSecond' src={iconSecond} alt="coin"/>
                                </label>
                            </div>
                            <div className='ratePanel'>
                                <br/>
                                Вы получите ~ {quantityFinalCoin} {coinName}
                            </div>
                            <h3 className="errorText">{errorMessage}</h3>
                            <br/>
                            <button className='buttonBuy' type="submit" onClick={handleBuy}>Купить</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyCryptoForm;