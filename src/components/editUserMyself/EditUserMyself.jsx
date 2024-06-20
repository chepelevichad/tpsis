import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './EditUserMyself.css';

function EditUserMyself({ id }) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMsg] = useState('_________________________________________________________________________________________________________________________________________________________________');
    const [errorMessagePass, setErrorMsgPass] = useState('');
    const [isPasswordEditable, setPasswordEditable] = useState(false); // Состояние для разблокировки кнопки "Изменить пароль"

    useEffect(() => {
        const intervalId = setInterval(() => {
            setErrorMsgPass('');
        }, 10000);

        // Очистить интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []); // Пере

    function handleEditLogin(event) {
        console.log("id: " + id + "\nlogin: " + login);
        event.preventDefault();
        axios.put('https://localhost:7157/User/editUserLogin', { id, login })
            .then(response => {
                setErrorMsg(response.data);
                console.log(response.data);
            })
            .catch(error => {
                setErrorMsg(error.response.data.message || "Произошла ошибка при отправке запроса.");
                console.error(error);
            });
    }

    function handleEditPassword(event) {
        console.log("id: " + id + "\nPassword: " + password + "\nPasswordRepeat: " + passwordRepeat);
        if(!isPasswordEditable)
        {
            setErrorMsgPass("Сначала введите код верификации");
            return;
        }
        if(password !== passwordRepeat)
        {
            setErrorMsgPass("Пароль не совпадают");
            return;
        }
        if(password.length < 4)
        {
            setErrorMsgPass("Пароль слишком короткий");
            return;
        }
        event.preventDefault();
        axios.put('https://localhost:7157/User/editUserPassword', { id, password, passwordRepeat })
            .then(response => {
                console.log(response.data);
                setErrorMsg(response.data.message);
            })
            .catch(error => {
                setErrorMsg(error.response.data);
                console.error(error);
                return;
            });
        setErrorMsgPass("Пароль успешно изменен");
    }

    const handleSendRestoreCode = async (event) => {
        console.log("id: " + id);
        event.preventDefault();

        const requestBody = {
            "id": id,
            "code": email
        };

        try {
            const response = await axios.post('https://localhost:7157/Email/confirm-restore-password', requestBody);

            if (response.status === 200) {
                setErrorMsgPass("Email подтвержден");
                console.log(response);
            } else {
                // Handle other successful status codes if needed
            }
        } catch (error) {
            if (error.response) {
                setErrorMsgPass("Некорректный код");
                console.error(error.response);
            } else {
                setErrorMsgPass("Ошибка сервера");
                console.error("Error in making the request:", error.message);
            }
        }
    };

    const handleGetRestoreCode = async (event) => {
        console.log("id: " + id);
        event.preventDefault();

        try {
            const response = await axios.post('https://localhost:7157/Email/sendVerificationCode', { id });
            setErrorMsgPass("Код отправлен");
            console.log(response.data);
        } catch (error) {
            setErrorMsgPass(error.response.data.message || "Произошла ошибка при отправке запроса.");
            console.error(error);
        }
    };

    const handleV = async (event) => {
        event.preventDefault();
        const verifyEmailRequest = {
            id: id,
            code: email
        };

        try {
            const response = await axios.post('https://localhost:7157/Email/verifyEmail', verifyEmailRequest);
            setErrorMsgPass("Успех!");
            setPasswordEditable(true); // Разблокировать кнопку "Изменить пароль"
            console.log(response.data);
        } catch (error) {
            setErrorMsgPass("Код неверный!");
            setPasswordEditable(false); // Заблокировать кнопку "Изменить пароль"
            console.error(error);
        }
    };

    return (
        <div className='editPanel'>
            <h2 className='personalDataLbl'>
                Персональные данные
            </h2>
            <div className='errorLbl'>
                <h3 className="errorText">{errorMessage}</h3>
            </div>
            <div className='editContainer'>
                <div className='inputFormLogin'>
                    <div>
                        <div className='editOperationLbl'>
                            <h3>
                                Редактировать имя пользователя
                            </h3>
                        </div>
                        <input className='inputFieldEdit' type="text" placeholder="Введите логин" value={login}
                               onChange={(event) => setLogin(event.target.value)}/>
                    </div>
                    <div>
                        <button className='btnEditLogin' onClick={handleEditLogin}>Изменить логин</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
;
export default EditUserMyself;