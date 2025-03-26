import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const fetchData = async () => {
		try {
			const response = await axios.get(url);
			setData(response.data);
			setLoading(false);
		} catch (err) {
			setError(err.response?.data?.message ? err.response.data.message : err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [url]);

	return { data, loading, error };
}

export const formatPrice = (price) => {
  let ESEuro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  return ESEuro.format(price)
}

export const usePost = (url, params) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const fetchData = async () => {
		try {
			const response = await axios.post(url, params);
			setData(response.data);
			setLoading(false);
		} catch (err) {
			setError(err.response?.data?.message ? err.response.data.message : err.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [url, params]);

	return { data, loading, error };
}

export default useFetch;