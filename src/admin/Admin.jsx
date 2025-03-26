import React, { useState } from "react";
import LoginForm from "../Containers/LoginForm.jsx";

const backEndRoot = import.meta.env.DEV ? "http://127.0.0.1:3000" : "https://antonio-marcus.onrender.com";
// const listsAPIEndpoint = `${backEndRoot}/api/v1`;

// A component to display the CRUD app
const App = () => {
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});
    console.log("estamos en el admin")

	return (
		<div className="app">
			{
				<>
					<h1>Marcus bikes Admin</h1>
					<hr />
					<div className="module-wrapper">
						<LoginForm 
							backEndRoot={backEndRoot}
							loginData={loginData}
							setLoginData={setLoginData} 
						/>
					</div>
				</>
			}
		</div >
	);
};

export default App;