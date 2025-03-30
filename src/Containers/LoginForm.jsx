import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

const LoginForm = (props) => {
    const { backEndRoot, loginData, setLoginData, session_clean, set_session, isLogged } = props;
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(null)

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
                    log_in(data.data)
                    
                }else{
                    setError(data.message);
                    log_off();
                }        
            }
        })
        .catch((err) => {
            setError(err.response?.data?.message ? err.response.data.message : err.message);
        });
    }
  
    return (
        <div className="LoginForm-wrapper">
            {isLogged ? (<div>
                Welcome back {username}<br/><a onClick={handleLogOut} href="#">Sign out</a> 
            </div>) :   
            <form onSubmit={handleSubmit}>
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
                <input className="form-button" type="submit" />
            </form>
            }
        </div>
    );

}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (credentials) => dispatch(login(credentials)),
    };
};

export default connect(null, mapDispatchToProps)(LoginForm);
