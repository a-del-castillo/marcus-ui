import React, { useState } from "react";
import PartModal from "./PartModal.jsx"; 

const PartCard = (props) => {
	const { part, backEndRoot, userRole, parts, setParts, addToCart } = props;
    const [showModal, setShowModal] = useState(false);
	const [partData, setPartData] = useState(part);

    const handleClickCard = async (e) => {
        setShowModal(true);
    }

    const handleModalClose = (e) => {
        if( e.target.classList.contains('modal-content-close')) {
            e.preventDefault();
            setShowModal(false);
        }
    }
	
	return (
		<div className="part">
			{ showModal && (
				<PartModal
					backEndRoot={backEndRoot}
					mode='edit'
					userRole={userRole}
					parts={parts}
					partData={partData}
					setPartData={setPartData}
					handleModalClose={handleModalClose}
					setShowModal={setShowModal}
					setParts={setParts}
					addToCart={addToCart}
				/>
			)}
			
			<div onClick={handleClickCard} className="part-info-card-small" >
				<div className="part-name">{part.name}</div>
				<div className="part-image">
					<img height="120vh" width="150vw" src={part.image ? part.image : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}></img>
				</div>
				<div >
					<hr />
				</div>
				<div className="space-between-flex">
					<label className="title-with-icon button edit-color">{part.category}</label>
				</div>
				<div >
					<hr />
				</div>
		
			</div>
		
		</div>
	);
};

export default PartCard;