import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import mainIcon from '../../../assets/images/UP_cryptowallet.png';
import { Link } from 'react-router-dom';
import loadingGif from '../../../assets/images/loading.gif'
import './Coins.css'; // Импортируем CSS файл
import { Line } from 'react-chartjs-2';
import {render} from "@testing-library/react";
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js';

function App(props) {
  const { id } = props.location.state;
  const [data, setData] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  const [isMasked, setIsMasked] = useState(false);
  const maskedBalance = "*********";
  const [searchTerm, setSearchTerm] = useState('');
  const coinIcoins = {};
  const menuIcoins = {};
  const [selectedCoin, setSelectedCoin] = useState(null);

  const getCachedCoinData = () => {
    const cachedData = sessionStorage.getItem('cachedCoinData');
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const timestamp = parsedData.timestamp;
        const currentTime = new Date().getTime();
        if (currentTime - timestamp < 10 * 60 * 1000) {
          return parsedData.data;
        }
      } catch (error) {
        console.error('Error parsing cached coin data:', error);
      }
    }
    return null;
  };

  const saveCoinToCache = (coinData, expirationTimeInMinutes) => {
    console.log("saveCoinToCache");
    const currentTime = new Date().getTime();
    const expirationTime = expirationTimeInMinutes * 60 * 1000; // Преобразуем минуты в миллисекунды
    const dataToSave = JSON.stringify({ data: coinData, timestamp: currentTime, expiration: expirationTime });
    sessionStorage.setItem('cachedCoinData', dataToSave);
    console.log("saveCoinToCache1", dataToSave);
  };

// Inside your useEffect for fetching coin data
  useEffect(() => {
    let coins = getCachedCoinData()
    console.log("coins", coins);
    if(coins){
      setData(coins);
      return;
    }
    console.log(2);
    axios.get("https://localhost:7157/Currency/getCurrenciesList")
        .then(response => {
          setData(response.data);
          console.log(2, response);
          saveCoinToCache(response.data);
        })
        .catch(error => {
          console.log(error);
        });
  }, []);

  useEffect(() => {
    axios.get("https://localhost:7157/Currency/getUserBalance?userId=" + id)
      .then(response => {
        console.log(response);
        setBalanceData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function formatNumber(num) {
    if (num >= 1e9) { // если число больше или равно 1 миллиарду
      return (num / 1e9).toFixed(2) + ' B$'; // делим на 1 миллиард, округляем до 2 знаков после запятой и добавляем букву B
    } else if (num >= 1e6) { // если число больше или равно 1 миллиону
      return (num / 1e6).toFixed(2) + ' M$'; // делим на 1 миллион, округляем до 2 знаков после запятой и добавляем букву M
    } else if (num >= 1e3) { // если число больше или равно 1 тысяче
      return (num / 1e3).toFixed(2) + ' T$'; // делим на 1 тысячу, округляем до 2 знаков после запятой и добавляем букву T
    } else { // если число меньше 1 тысячи
      return num.toString(); // возвращаем число в строковом формате
    }
  }

  function formatPercentage(num) {
    const sign = num >= 0 ? '+' : '-'; // определяем знак числа
    const percentage = Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'; // получаем процентное значение и форматируем его с помощью toLocaleString()

    return sign + percentage; // возвращаем число с знаком "+" или "-"
  }

  function priceImpact(num) {
    const sign = num >= 0 ? '+' : '-'; // определяем знак числа
    const percentage = Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + '$'; // получаем процентное значение и форматируем его с помощью toLocaleString()

    return sign + percentage; // возвращаем число с знаком "+" или "-"
  }
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios.get("https://localhost:7157/User/getUserLoginById?id=" + id)
      .then(response => {
        console.log(response);
        setUserName(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const filteredCoins = data && data.$values
      ? data.$values.filter(coin => coin.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      : [];


  function calculateIndicator(coin) {
    const weightDailyImpact = 40;
    const weightPriceChange = 30;
    const weightVolumeChange = 30;

    const weightedDailyImpact = (coin.dailyImpact / 100) * weightDailyImpact;
    const weightedPriceChange = (coin.percentagePriceChangePerDay / 100) * weightPriceChange;
    const weightedVolumeChange = (coin.dailyVolume / 100) * weightVolumeChange;

    const totalWeightedValue = weightedDailyImpact + weightedPriceChange + weightedVolumeChange;

    return totalWeightedValue >= 0 ? 'buy' : 'sell';
  }

  const openCoinPopup = (shortName) => {
    const coinData = data.$values.find(coin => coin.shortName === shortName);
    if (coinData) {
      setSelectedCoin(coinData);
    } else {
      console.error(`Coin with shortName '${shortName}' not found in data.`);
    }
  };

    const CoinPopup = ({ coinData, onClose }) => {
        const [priceData, setPriceData] = useState(null);
        console.log(coinData.shortName)
        useEffect(() => {
            const fetchCoinPriceHistory = async () => {
                try {
                    const response = await fetch(`https://localhost:7157/Currency/get-coin-price-history/${coinData.fullName}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    setPriceData(data.$values);
                } catch (error) {
                    console.error('Error fetching coin price history:', error);
                }
            };

            fetchCoinPriceHistory();
        }, []);

        const lineChartData = {
            labels: ["", "", "", "", "", "", "", "", "", ""],
            datasets: [
                {
                    data: priceData,
                    label: "All time",
                    borderColor: "#3333ff",
                    fill: true,
                    lineTension: 0.5
                }
            ]
        };

        return (
            <div className="popupBackground">
                <div className="popup">
                    <div className="popupContent">
                        <Line
                            type="line"
                            width={800}
                            height={300}
                            options={{
                                title: {
                                    display: true,
                                    text: `Price Chart for ${coinData.name}`,
                                    fontSize: 20
                                },
                                legend: {
                                    display: true,
                                    position: "top"
                                }
                            }}
                            data={lineChartData}
                        />
                        <button className="closeButton" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
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
      <div className='coinListPanel'>
        <div className='searchCoinBar'>
          <div className='searchPanel'>
            <input className='inputField1' type="text" placeholder="Введите название монеты" value={searchTerm}
                   onChange={handleSearch}/>
          </div>
        </div>
          {selectedCoin && (
              <CoinPopup coinData={selectedCoin} onClose={() => setSelectedCoin(null)} />
          )}

          <div className="coinListFull">
          {data && data.$values ? (
              <table className="tableCoins1">
                <thead>
                <tr className='tableHead'>
                  <th>Монета</th>
                  <th>Полн. назв.</th>
                  <th>Сокр.</th>
                  <th>Цена</th>
                  <th>Дневн. объем</th>
                  <th>Изм. цены</th>
                  <th>Проц. изм.</th>
                  <th>Анализ</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(filteredCoins) ? filteredCoins.map(coin => (
                    <tr key={`${coin.id}-${coin.shortName}`}>
                      <td>
                        <img
                            className="coinIcon"
                            src={coinIcoins['./' + coin.fullName + '.png']}
                            alt="icon"
                            onClick={() => openCoinPopup(coin.shortName)}
                        />
                      </td>
                      <td>{coin.shortName}</td>
                      <td>{coin.fullName}</td>
                      <td>{(coin.price) + '$'}</td>
                      <td>{formatNumber(coin.dailyVolume)}</td>
                      <td style={{color: coin.dailyImpact < 0 ? 'red' : 'green'}}>{priceImpact(coin.dailyImpact)}</td>
                      <td>{formatPercentage(coin.percentagePriceChangePerDay)}</td>
                      <td style={{color: calculateIndicator(coin) === 'buy' ? 'green' : 'red'}}>
                        {calculateIndicator(coin)}
                      </td>
                    </tr>
                )) : null}
                </tbody>
              </table>
          ) : (
              <div>
                <img className="loadingGif" src={loadingGif} alt="loading"/>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;