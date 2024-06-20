import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './UserMainMenu.css'
import mainIcon from '../../../assets/images/UP_cryptowallet.png';
import { Link } from 'react-router-dom';
import CoinTable from '../../../components/coinTable/CoinTable.jsx'

function App(props) {
  const id = props.location.state.id;
  console.log("User Id gewt: ", id)
  const [data, setData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const coinIcoins = {};
  const menuIcoins = {};
  const [isMasked, setIsMasked] = useState(false);
  const maskedBalance = "*********";
  const [userName, setUserName] = useState('');

  useEffect(() => {
    try {
      const fetchData = async () => {
        const [coinsResponse, balanceResponse, usernameResponse] = await Promise.all([
          axios.get("https://localhost:7157/Currency/getUserCoinsFull?userId=" + id),
          axios.get("https://localhost:7157/Currency/getUserBalance?userId=" + id),
          axios.get("https://localhost:7157/User/getUserLoginById?id=" + id)
        ]);

        setData(coinsResponse.data);
        setBalanceData(balanceResponse.data || 0);
        setUserName(usernameResponse.data);
      };

      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  function importAllCoinsIcons(r) {
    r.keys().forEach((key) => (coinIcoins[key] = r(key)));
  }
  importAllCoinsIcons(require.context("../../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));

  function importAllMenuIcons(r) {
    r.keys().forEach((key) => (menuIcoins[key] = r(key)));
  }
  importAllMenuIcons(require.context("../../../assets/images/standart_menu_icons", false, /\.(png|jpe?g|svg)$/));

  const handleMaskBalance = () => {
    setIsMasked(!isMasked);
  };

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
          <Link className="MenuCase" to={{pathname: '/menu', state: props.location.state}}><img className="MenuIcon"
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
          <Link className="MenuCase" to={{pathname: '/coins', state: props.location.state}}> <img className="MenuIcon"
                                                                                                  src={menuIcoins['./cryptocurrencies.png']}
                                                                                                  alt="Token icon"></img>Токены</Link>
        </div>
        <div className="MenuCaseItem">
          <Link className="MenuCase" to={{pathname: '/accountMenu', state: props.location.state}}><img
              className="MenuIcon" src={menuIcoins['./user.png']} alt="Account icon"></img>Аккаунт</Link>
        </div>
        <div className="MenuCaseItem">
          <Link className="MenuCase" to={{pathname: '/', state: props.location.state}}><img className="MenuIcon"
                                                                                            src={menuIcoins['./power-off.png']}
                                                                                            alt="Exit icon"></img>Выход</Link>
        </div>
      </div>
      <CoinTable id={id}/>
    </div>
  );
}

export default App;