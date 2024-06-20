import axios from 'axios';
import React, { useState, useEffect } from "react";
import loadingGif from '../../assets/images/loading.gif'
import {Line} from "react-chartjs-2";

function LoginHistoryTable({ id }) {
    const [data, setData] = useState(null);
    const coinIcons = {};
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios.get("https://localhost:7157/Currency/getUserCoinsFull?userId=" + id)
            .then(response => {
                console.log(6, response.data);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    function importAllCoinsIcons(r) {
        r.keys().forEach((key) => (coinIcons[key] = r(key)));
    }
    importAllCoinsIcons(require.context("../../assets/images/cryptoicons_png/128", false, /\.(png|jpe?g|svg)$/));

    function formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + ' B$';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + ' M$';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + ' T$';
        } else {
            return num.toString();
        }
    }

    function formatPercentage(num) {
        const sign = num >= 0 ? '+' : '-'; // определяем знак числа
        const percentage = Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

        return sign + percentage;
    }

    function priceImpact(num) {
        const sign = num >= 0 ? '+' : '-'; // определяем знак числа
        const percentage = Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + '$';

        return sign + percentage;
    }

    const handleTableClick = () => {
        setShowPopup(true);
    };


    const CoinPopup = ({ coinData, onClose }) => {
        const [priceData, setPriceData] = useState(null);

        const lineChartData = {
            labels: ["", "", "", "", "", "", "", "", "", "", ""],
            datasets: [
                {
                    data: priceData,
                    lineTension: 1
                }
            ]
        };

        useEffect(() => {
            const fetchCoinPriceHistory = async () => {
                try {
                    const response = await fetch(`https://localhost:7157/Currency/get-coin-price-history/${coinData}`);
                    const data = await response.json();
                    setPriceData(data.$values);
                } catch (error) {
                    console.error('Error fetching coin price history:', error);
                }
            };

            fetchCoinPriceHistory();
        }, []);

        return (
            <div>
                <Line
                    type="line"
                    width={3}
                    height={3}
                    options={{
                        title: {
                            display: true,
                        },
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                display: false
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        legend: {
                            display: true,
                        }
                    }}
                    data={lineChartData}
                />
            </div>
        );
    };


    return (
        <div className="coinList2">
            <div className="coinListFull2">
                {data ? (
                    <table className="tableCoins">
                        <thead>
                        <tr className='tableHead'>
                            <th>Монета</th>
                            <th>Цена.</th>
                            <th>Полн. назв.</th>
                            <th>Сокр.</th>
                            <th>Цена</th>
                            <th>Кол-во</th>
                            <th>Дневн. объем</th>
                            <th>Изм. цены</th>
                            <th>Проц. изм.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.$values.map(coin => (
                            <tr key={coin.id}>
                                <td>
                                    <img className="coinIcon" src={coinIcons['./' + coin.shortName + '.png']}
                                         alt="icon"/>
                                </td>
                                <td>
                                    <CoinPopup coinData={coin.shortName}/>
                                </td>
                                <td>{coin.fullName}</td>
                                <td>{coin.shortName}</td>
                                <td>{(coin.price).toFixed(5)}$</td>
                                <td>{coin.quantity.toFixed(5)}</td>
                                <td>{formatNumber(coin.dailyVolume)}</td>
                                <td style={{color: coin.dailyImpact < 0 ? 'red' : 'green'}}
                                    onClick={handleTableClick}>{priceImpact(coin.dailyImpact)}</td>
                                <td style={{color: coin.percentagePriceChangePerDay < 0 ? 'red' : 'green'}}
                                    onClick={handleTableClick}>
                                    {formatPercentage(coin.percentagePriceChangePerDay)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='loagingPanel'>
                        <img className="loadingGif" src={loadingGif} alt="loading"/>
                    </div>
                )}
            </div>
            {showPopup && (
                <PriceChangePopup
                    onClose={() => setShowPopup(false)}
                    coinFullName={selectedCoin ? selectedCoin.fullName : ''}
                />
            )}
        </div>
    );
}

export default LoginHistoryTable;

function PriceChangePopup({ onClose, coinFullName }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [randomPrice, setRandomPrice] = useState(null);

    useEffect(() => {
        if (startDate && endDate) {
            generateRandomPrice();
        }
    }, [startDate, endDate]);

    const generateRandomPrice = () => {
        const min = 10;
        const max = 100;
        const randomPrice = Math.floor(Math.random() * (max - min + 1)) + min;
        setRandomPrice(randomPrice);
    };

    return (
        <div className="popupBackground1">
            <div className="popup">
                <h2>{coinFullName}</h2>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                {startDate && endDate ? (
                    <label>Изменение цены: ${randomPrice}</label>
                ) : (
                    <label>Выберите обе даты для генерации цены</label>
                )}
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}