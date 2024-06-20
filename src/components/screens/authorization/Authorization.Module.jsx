import styles from './Authorization.css'
import logo from './UP_logo.png'
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';


function LoginPage() {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [login, setUsername] = useState('');
  const history = useHistory();

    function handleLogin(event) {
        event.preventDefault();
        console.log("Starting login process...");

        if (!validateLogin(login)) {
            console.log("Login validation failed.");
            setErrorMessage('Введите логин');
            return;
        }

        if (!validatePassword(password)) {
            console.log("Password validation failed.");
            setErrorMessage('Введите пароль');
            return;
        }

        console.log("Login and password validation succeeded. Attempting to log in...");
        loginUser();
    }

    function validateLogin(login) {
        console.log("Validating login...");
        return login.length > 0;
    }

    function validatePassword(password) {
        console.log("Validating password...");
        return password.length > 0;
    }

    async function loginUser() {
        console.log("Logging in user...");
        try {
            const response = await axios.post('https://localhost:7157/Authorization/login', { login, password });
            console.log("Login successful. Handling response...");
            handleResponse(response.data);
        } catch (error) {
            console.error("Login failed. Handling error...");
            handleError(error);
        }
    }

    function handleResponse(user) {
        console.log("Handling login response...");
        if (user.roleId === 1) {
            console.log("User is regular user. Redirecting to menu...");
            history.push('/menu', user);
        } else if (user.roleId === 2) {
            console.log("User is admin. Getting admin token...");
            handleAdminLogin(user);
        }
    }

    function handleAdminLogin(user) {
        console.log("Handling admin login...");
        axios.post(`https://localhost:7157/Admin/getToken/${user.email}`)
            .then(response => {
                console.log("Admin token received. Setting cookie and redirecting to admin menu...");
                const token = response.data.token;
                Cookies.set('token', token, { expires: 7 });
                history.push('/adminMenu', user);
            })
            .catch(error => {
                console.error("Failed to get admin token. Error:", error);
            });
    }

    function handleError(error) {
        console.error("Error occurred during login:", error);
        const errorMessage = error.response.data.message || 'Произошла ошибка при авторизации.';
        setErrorMessage(errorMessage);
    }



    return (
      <div>
        <img className='logoImg' src={logo} alt="Logo"></img>
        <div className='line'>
          <h1>
            Авторизация
          </h1>
        </div>
        <div className="container">
          <div className="loginForm">
            <form onSubmit={handleLogin}>
              <div className='loginDataPlace'>
                <label>
                  Имя пользователя:
                  <input className='inputField2' type="text" value={login} onChange={(event) => setUsername(event.target.value)} placeholder="Логин" />
                </label>
                <label>
                  Пароль:
                  <input className='inputField2' type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Пароль" />
                </label>
                <button className='buttonLogin' onClick={handleLogin}>Войти</button>
                <div className='createNewAccountLbl1'>Нет аккаунта? <Link className="MenuCase" to={{ pathname: '/registration', }}>Cоздайте новый</Link></div>
                <div className='errorMsgForm'>
                  {errorMessage && <h3 className="errorText">{errorMessage}</h3>}
                </div>
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

export default LoginPage;
