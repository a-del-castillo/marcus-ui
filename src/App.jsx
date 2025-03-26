import React, { useState } from "react";
import PartList from "./Components/PartList.jsx";
import LoginForm from "./Containers/LoginForm.jsx";
import Configurator from "./Containers/Configurator.jsx";

const backEndRoot = import.meta.env.DEV ? "http://127.0.0.1:3000" : "https://antonio-marcus.onrender.com";
const listsAPIEndpoint = `${backEndRoot}/api/v1`;

// A component to display the CRUD app
const App = () => {
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});

	// Fetch the data from the API
	// const { data, loading } = useFetch(`${listsAPIEndpoint}/parts`);

	/*
	useEffect(() => {
		if (selectedListID) {
			setEditedListName(lists[selectedListID].listName)
			axios.get(`${listsAPIEndpoint}/part/${selectedListID}`)
				.then((res) => {
					lists[selectedListID] = res.data
					setLists({ ...lists })
				})
				.catch((err) => {
					setError(err.response?.data?.message ? err.response.data.message : err.message)
				})
		}
	}, [selectedListID])
	*/
	
	/*
	// Initialize the lists state with the fetched data
	useEffect(() => {
		if (data) {
			setParts(data);
			// formatCategories(data);
			// setSelectedListID(Object.keys(data)[0]);
		}
	}, [data]);
	*/

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
						/>
					</div>
					<div className="module-wrapper">
						<Configurator
							backEndRoot={backEndRoot}
						/>
					</div>
					<div className="module-wrapper">
						<PartList
							backEndRoot={backEndRoot}
						/>
					</div>
				</>
			}
		</div >
	);
};

export default App;