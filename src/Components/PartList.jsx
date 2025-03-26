import React, { useState, useEffect } from "react";
import PartCard from './PartCard.jsx';
import useFetch from "../actions/index.js"

// A component to display a list of books
const PartList = (props) => {
    const { backEndRoot } = props
    const { data, loading } = useFetch(`${backEndRoot}/api/v1/parts`);
    const [parts, setParts] = useState(null);
	const [categories, setCategories] = useState([]);
    const formatCategories = (data) => {
		const tmpCategories = []
		data.forEach((part) => {
			if (!tmpCategories.includes(part.category)) {
				tmpCategories.push(part.category)
			}
		})
		setCategories(tmpCategories)
	}

    useEffect(() => {
		if (data) {
			setParts(data);
			// formatCategories(data);
			// setSelectedListID(Object.keys(data)[0]);
		}
	}, [data]);
	return (
		<div className="part-list">
            { loading ? <p>Loading</p> :
                parts && parts.map((part) => (
                    <PartCard
                        backEndRoot={backEndRoot}
                        key={part.id}
                        part={part}
                    />
                ))
            }
		</div>
	);
};

export default PartList;