import React, { useState } from "react";
import PartList from "./Containers/PartList.jsx";
import LoginForm from "./Containers/LoginForm.jsx";
import Cart from "./Containers/Cart.jsx";
import Configurator from "./Containers/Configurator.jsx";
import axios from "axios";

const backEndRoot = import.meta.env.DEV ? "http://127.0.0.1:3000" : "https://marcus-api.onrender.com";

// A component to display the CRUD app
const App = () => {
	const [isLogged, setIsLogged] = useState(false)
	const [userRole, setUserRole] = useState(null)
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});
	const [cartData, setCartData] = useState({
		id: null,
		configs:[],
		parts: []
	})

	const session_clean = () => {
        setLoginData({
            username: "",
            password: ""
        });
		setCartData({
			...cartData,
			id: null
		})
		setIsLogged(false)
		setUserRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

    }

    const set_session = (data) => {
        setIsLogged(true);
		setUserRole(data.attributes.role);
        localStorage.setItem("token", data.attributes.token);
        localStorage.setItem("user_id", data.attributes.user_id);
        localStorage.setItem("username", data.attributes.username);
        localStorage.setItem("role", data.attributes.role);
    }

	const addToCart = async (element, type = 'part') => {
		const tmpConfigs = cartData.configs || []
		let tmpParts = cartData.parts || []
		if (type === 'part') {
			console.log('add Part ToCart')
			let partAlreadyInCart = false
			tmpParts = cartData.parts.reduce((acc, part) => {
				if (part.id === element.id) {
					partAlreadyInCart = true
					part.quantity += (element.quantity || 1)
					part.price = parseFloat(element.price) * part.quantity
				}
				acc.push(part);
				return acc;
			}, []);
			if (!partAlreadyInCart) {
				tmpParts.push({id: element.id, name: element.name, quantity: element.quantity || 1, price: element.price})				
			}
		} else {
			const configObject = {
				name:  'Build ' + tmpConfigs.length+1,
				index: tmpConfigs.length+1, 
				price: element.price, 
				quantity: 1,
				parts: element.parts
			}
			tmpConfigs.push(configObject)
		}

		if ( cartData.id ){
			// update in server
			const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            }
			const formattedConfigs = []
			tmpConfigs.forEach( (tmpConfig) =>{
				const tmpPartsList = tmpConfig.parts.map(part => parseInt(part.id, 10))
				tmpConfig.parts = tmpPartsList
				formattedConfigs.push(tmpConfig)
			})
			const order = {
				"status": "paid",
				"parts_ids": tmpParts.map(part => part.id),
				"configs": formattedConfigs
			}
			const result = await axios.patch(`${backEndRoot}/api/v1/orders/${cartData.id}`, {order}, { headers });
			if (result.status === 200) {
			}

		}

		setCartData({
			...cartData,
			configs: tmpConfigs,
			parts: tmpParts
		})
	}

	const removeFromCart = async (e) => {
        const type = e.currentTarget.attributes['data-type'].value
        const index = e.currentTarget.attributes['data-index'].value
        const tmpList = type === 'parts' ? cartData.parts : cartData.configs

        tmpList.splice(index, 1)
 /*       
		if ( cartData.id ){
			const baseData = {
				...cartData,
				[type]:tmpList
			}
			const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            }
			const formattedConfigs = []
			baseData.configs.forEach( (tmpConfig) =>{
				const tmpPartsList = tmpConfig.parts.map(part => parseInt(part.id, 10))
				tmpConfig.parts = tmpPartsList
				formattedConfigs.push(tmpConfig)
			})
			const order = {
				"status": "paid",
				"parts_ids": baseData.parts.map(part => part.id),
				"configs": formattedConfigs
			}
			const result = await axios.patch(`${backEndRoot}/api/v1/orders/${cartData.id}`, {order}, { headers });
		}
*/
        setCartData({
            ...cartData,
            [type]:tmpList
        })
	}

	return (
		<div className="app">
			{
				<>
					<h1>Marcus bikes</h1>
					<hr />
					<div className="module-wrapper">
						<LoginForm 
							backEndRoot={backEndRoot}
							loginData={loginData}
							setLoginData={setLoginData}
							session_clean={session_clean}
							set_session={set_session}
							isLogged={isLogged}
							cartData={cartData}
							setCartData={setCartData}
							userRole={userRole}
						/>
						<Cart 
							backEndRoot={backEndRoot}
							loginData={loginData}
							isLogged={isLogged}
							cartData={cartData}
							setCartData={setCartData}
							removeFromCart={removeFromCart}
						/>
					</div>
					<div className="module-wrapper">
						<Configurator
							backEndRoot={backEndRoot}
							addToCart={addToCart}
						/>
					</div>
					<div className="module-wrapper">
						<PartList
							userRole={userRole}
							backEndRoot={backEndRoot}
							addToCart={addToCart}
						/>
					</div>
				</>
			}
		</div >
	);
};

export default App;