import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import UserOrders from "../Components/UserOrders.jsx"
import axios from "axios";

const LoginForm = (props) => {
    const { backEndRoot, loginData, setLoginData, session_clean, set_session, isLogged, cartData, setCartData, userRole } = props;
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(null);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [retrieveOrders, setRetrieveOrders] = useState(true);
    const log_off = () => {
        setUsername(null)
        session_clean()
    }

    const log_in = (data) => {
        setUsername(data.attributes.username);
        set_session(data);
    }
    
    const fetchLoggedInUser = async () => {
        if (localStorage.token && localStorage.token !== "null") {
            const token = localStorage.token;
            await axios.get(`${backEndRoot}/auto-login`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                if ( res.status === 200) {
                    const {data} = res
                    log_in(data.data)
                }else {
                    log_off();
                }
            })
            .catch((err) => {
                console.log(err.response?.data?.message ? err.response.data.message : err.message);
            });
        }else{
            log_off();
        }
    }

    if (localStorage.token && localStorage.token !== "null" && !isLogged) {
        fetchLoggedInUser()
    }

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogOut = (e) => {
        e.preventDefault();
        log_off()  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(loginData);
        setLoginData({
            username: "",
            password: ""
        });
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        setShowSignIn(true)
    }

    const handleSignInCancel = (e) => {
        e.preventDefault();
        setShowSignIn(false)
    }

    const retrieveCustomerCart = async () => {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
        }
        const response = await axios.get(`${backEndRoot}/api/v1/orders/show_current`, { headers });
        
        if (response.status === 200 && response.data.order ){
            const orderId = response.data.order.id;
            
            setCartData({
                id: orderId,
                configs: response.data.configs.concat(cartData.configs),
                parts: response.data.parts.concat(cartData.parts)
            })

        }
    }

    const handleSignUpClick = async (e) => {
        e.preventDefault();
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
        const user = {
            username:loginData.username,
            password:loginData.password
        }
        const response = await axios.post(`${backEndRoot}/api/v1/users`, user, { headers });
        
        if (response.status === 200){
            await login(user);
            setShowSignIn(false);
        }else{
            alert('Error '+ response.error)
        }
    }

    const login = async (credentials) => {
        const username = credentials.username;
        const password = credentials.password;
        const creds = { password, username };

        axios.post(
                `${backEndRoot}/session`,
                    creds
            )
        .then((res) => {
            if ( res.status === 200) {
                const {data} = res
                if (data.status !== "error") {
                    log_in(data.data);
                    retrieveCustomerCart()
                }else{
                    setError(data.message);
                    log_off();
                }        
            }
        })
        .catch((err) => {
            setError(err.response?.data?.message ? err.response.data.message : err.message);
        });
    };

    const handleViewOrders = (e) => {
        setShowOrders(true);
        e.preventDefault();
    };

    const handleUserModalClose = (e) => {
        if( e.target.classList.contains('modal-content-close')) {
            e.preventDefault();
            setShowOrders(false);
        }
    }
  
    const retrieveUsersOrders = async () => {
        const token = localStorage.token;
        
        const response = await axios.get(`${backEndRoot}/api/v1/orders`,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        setRetrieveOrders(false)
        setUserOrders(response.data)
    } 

    if (userRole === 'admin' && retrieveOrders === true) {
        retrieveUsersOrders()
    }

    return (
        <>
        {showOrders && (
            <UserOrders
                handleUserModalClose={handleUserModalClose}
                userOrders={userOrders}
                backEndRoot={backEndRoot}
                retrieveUsersOrders={retrieveUsersOrders}
            />
        )}
        <div className="LoginForm-wrapper">
            
            {isLogged ? (<div>
                Welcome {username}<br/>
                { (userRole === 'admin') && (<span><a onClick={handleViewOrders} href="#">Manage user orders</a><br/></span>) }
                <a onClick={handleLogOut} href="#">Sign out</a>
            </div>) :
            <form onSubmit={handleSubmit}>
                {showSignIn && (
                <div className="sign-in-wrapper">
                    <h3>Sign up</h3>
                    {error && <div>
                        <span>{error}</span>
                    </div>}
                    <label htmlFor="loginUsername">Username: </label>
                    <input
                        type="text"
                        id="loginUsername"
                        name="username"
                        value={loginData.username}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor="loginPassword">Password: </label>
                    <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                    />
                    <br />
                    <input className="form-button" type="button" value="Sign up" onClick={handleSignUpClick} /><a className="sign-in-link" onClick={handleSignInCancel} href="#">Cancel</a>
                </div>
                )}
                <h3>Login</h3>
                {error && <div>
                    <span>{error}</span>
                </div>}
                <label htmlFor="loginUsername">Username: </label>
                <input
                    type="text"
                    id="loginUsername"
                    name="username"
                    value={loginData.username}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor="loginPassword">Password: </label>
                <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                />
                <br />
                <input className="form-button" type="submit" /><a className="sign-in-link" onClick={handleSignIn} href="#">Sign up</a>
            </form>
            }
        </div></>
    );

}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (credentials) => dispatch(login(credentials)),
    };
};

export default connect(null, mapDispatchToProps)(LoginForm);
