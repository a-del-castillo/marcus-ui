import React, { useState } from "react";
import PartList from "./Containers/PartList.jsx";
import LoginForm from "./Containers/LoginForm.jsx";
import Cart from "./Containers/Cart.jsx";
import Configurator from "./Containers/Configurator.jsx";

const backEndRoot = import.meta.env.DEV ? "http://127.0.0.1:3000" : "https://antonio-marcus.onrender.com";

// A component to display the CRUD app
const App = () => {
	const [isLogged, setIsLogged] = useState(false)
	const [userRole, setUserRole] = useState(null)
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});
	const [cartData, setCartData] = useState({
		configs:[],
		parts: []
	})

	const session_clean = () => {
        setLoginData({
            username: "",
            password: ""
        });
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

	const addToCart = (element, type = 'part') => {
		console.log('addToCart', element)
		const tmpConfigs = cartData.configs || []
		let tmpParts = cartData.parts || []
		if (type === 'part') {
			let partAlreadyInCart = false
			tmpParts = cartData.parts.reduce((acc, part) => {
				if (part.id === element.id) {
					partAlreadyInCart = true
					part.quantity += 1
					part.price = parseFloat(element.price) + parseFloat(part.price)
				}
				acc.push(part);
				return acc;
			}, []);
			if (!partAlreadyInCart) {
				tmpParts.push({id: element.id, name: element.name, quantity: 1, price: element.price})				
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

		setCartData({
			configs: tmpConfigs,
			parts: tmpParts
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
						/>
						<Cart 
							backEndRoot={backEndRoot}
							loginData={loginData}
							isLogged={isLogged}
							cartData={cartData}
							setCartData={setCartData}
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