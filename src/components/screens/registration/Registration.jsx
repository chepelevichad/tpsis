import React, { useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import logo from '../authorization/UP_logo.png';

function AuthorizationPage() {
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [login, setLogin] = useState('');
  const [errorMessage, setText] = useState("");
  const [email, setEmail] = useState('');
  const history = useHistory();

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateNew = (event) => {
    event.preventDefault();
    console.log("Login: " + login + "\nPassword: " + password + "\nPasswordRep: " + passwordRepeat);

    if (login.length < 1) {
      setText("Введите login");
      return;
    }

    if (password.length < 1) {
      setText("Введите пароль");
      return;
    }

    if (passwordRepeat.length < 1) {
      setText("Повторите пароль");
      return;
    }

    if (passwordRepeat != password) {
      setText("Пароли не совпадают");
      return;
    }

    if (email.length < 1|| !isEmailValid(email)) {
      setText("Введите корректный email");
      return;
    }
    try {
      axios.post('https://localhost:7157/Authorization/register', { login, password, passwordRepeat, email })
          .then(response => {
            console.log(response)
            if (response.status === 200) {
              const user = response.data;
              setText("Аккаунт успешно создан");
              history.push('/', user);
            } else {
              if (response.data && response.data.message) {
                setText(response.data.message);
              } else {
                setText(`Произошла ошибка: ${response.status}`);
              }
            }
          })
          .catch(error => {
            if (error.response) {
              console.error(error.response.data);
              setText(error.response.data.message || "Произошла ошибка");
            } else if (error.request) {
              console.error(error.request);
              setText("Произошла ошибка при отправке запроса");
            } else {
              console.error('Error', error.message);
              setText("Произошла непредвиденная ошибка");
            }
          });
    } catch (error) {
      console.error(error);
    }

  };

  return (
      <div>
        <img className='logoImg' src={logo} alt="Logo"></img>
        <div className='line'>
          <h1>
            Регистрация
          </h1>
        </div>
        <div className="container11">
          <div className="regForm1">
            <form>
              <div className='regDataPlace'>
                <input className='inputField2' type="text" value={login}
                       onChange={(event) => setLogin(event.target.value)} placeholder="Логин"/>
                <input className='inputField2' type="password" value={password}
                       onChange={(event) => setPassword(event.target.value)} placeholder="Пароль"/>
                <input className='inputField2' type="password" value={passwordRepeat}
                       onChange={(event) => setPasswordRepeat(event.target.value)} placeholder="Повторите пароль"/>
                <input className='inputField2' type="text" value={email}
                       onChange={(event) => setEmail(event.target.value)} placeholder="Email"/>
                <button className='buttonLogin' onClick={handleCreateNew}>Создать</button>
                <div className='createNewAccountLbl'><Link className="MenuCase" to={{pathname: '/',}}>  У меня уже есть
                  аккаунт</Link></div>
                <h3 className="errorText1">{errorMessage}</h3>
              </div>
            </form>
          </div>
          <div className='bottomPanel'>
            &copy;2024 UPCrypto.com. All rights reserved. <a href="http://www.example.com" target="_self">Cookie settings</a>
          </div>
        </div>
      </div>
  );
}

export default AuthorizationPage;
