import React, { useState, useEffect } from "react";
import PartCard from '../Components/PartCard.jsx';
import useFetch from "../actions/index.js"
import PartModal from "../Components/PartModal.jsx"; 

const PartList = (props) => {
    const { backEndRoot, userRole, addToCart } = props
    const { data, loading } = useFetch(`${backEndRoot}/api/v1/parts`);
    const [parts, setParts] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [partData, setPartData] = useState({});
	const [searchQuery, setSearchQuery] = useState('');
    
	useEffect(() => {
		if (data) {
			setParts(data);
		}
	}, [data]);

	const handleOpenModal = (e) => {
		e.preventDefault()
		setShowModal(true)
	}

	const handleModalClose = (e) => {
        if( e.target.classList.contains('modal-content-close')) {
            e.preventDefault();
            setShowModal(false);
        }
    }

	const handleQueryChange = (e) => {
		setSearchQuery(e.target.value)
	}

	const existsInPart = (part, term ) => {
		const Uterm = term.toUpperCase();
		if (part.name.toUpperCase().includes(Uterm)) return true
		if (part.category.toUpperCase().includes(Uterm)) return true
	}

	return (
		<div className="part-list">
			{ userRole === "admin" && (<div className="addProduct-wrapper"><a href="#" onClick={handleOpenModal}>Create product</a></div>)}
			{ showModal && (
				<PartModal
					addToCart={addToCart}
					backEndRoot={backEndRoot}
					mode='create'
					userRole={userRole}
					parts={parts}
					partData={partData}
					setPartData={setPartData}
					handleModalClose={handleModalClose}
					setShowModal={setShowModal}
					setParts={setParts}
				/>
			)}
		    { loading ? <p>Loading</p> :
				<>
					<div className="searchBar-wrapper">
						<input
							type="text"
							value={searchQuery}
							onChange={handleQueryChange}
							placeholder="Input part name or category"
						/>
					</div>
					{parts && parts.map((part) => (
						existsInPart(part, searchQuery) && (
								<PartCard
									addToCart={addToCart}
									userRole={userRole}
									backEndRoot={backEndRoot}
									key={part.id}
									part={part}
									parts={parts}
									setParts={setParts}
								/>
							) 
						))
					}					
					
				</>
            }
		</div>
	);
};

export default PartList;