import React, { useState } from "react";
import { Edit, DeleteForever, Clear, Save } from "@mui/icons-material";
import { formatPrice } from "../actions/index.js"
import axios from "axios";


const PartCard = (props) => {
    // const { part, onDelete, onUpdate, editableCard } = props
	const { part, backEndRoot } = props;
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const editableCard = false;
    const [fullPart, setFullPart] = useState(null);
    const handleClickCard = async (e) => {
        if (!fullPart) {
            const response = await axios.get(`${backEndRoot}/api/v1/parts/${part.id}`);
			setFullPart(response.data);
        }
        setShowModal(true);
    }

    const handleModalClose = (e) => {
        if( e.target.classList.contains('modal-content-close')) {
            e.preventDefault();
            setShowModal(false);
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
    }
	
	return (
		<div className="part">
            {showModal && (<div className="part-modal modal-content-close" onClick={handleModalClose}>
                <div className="part-modal-content-wrapper">
                    <a className="part-modal-content-close-icon modal-content-close" href="#">X</a>
                    <div className="part-modal-content">
                        <div className="part-modal-content-details">
                            <span>Part name: {fullPart?.part.name} <br/></span>
                            {fullPart?.part.price && (<span>Price: {formatPrice(fullPart?.part.price)}<br/></span>)}
                            <span>Availability: {fullPart?.part.available ? "In stock" : "Temporarily out of stock"}<br/></span>
                            <span>Category: {fullPart?.part.category}<br/></span>
                            {Object.values(fullPart?.part.extra_props).length > 0 && (<span>Details: {fullPart?.part.extra_props}</span>)}<br/>
                            {fullPart?.incompatibilities.length > 0 && (<div>
                                <span>Incompatible with:</span><br/>
                                { fullPart?.incompatibilities.map((incompatible) => (
                                incompatible.part_1.id === fullPart.part.id ? (<span>{incompatible.part_2.name} ({incompatible.part_2.category})<br/></span>) : (<span>{incompatible.part_1.name} ({incompatible.part_1.category})<br/></span>) 
                                ))}
                            </div>)}
                            {fullPart?.pricemodifiers.length > 0 && (<div>
                                <span>Price detail:</span><br/>
                                { fullPart?.pricemodifiers.map((pricemod) => (
                                    <span>{formatPrice(pricemod.price)} when paired with {pricemod.variator_part.name} ({pricemod.variator_part.category})<br/></span>
                                ))}
                            </div>)}
                        </div>
                        <div className="add-part-to-cart"><a onClick={handleAddToCart} href="#">Add to cart</a> </div>
                    </div>
                </div>
            </div>)}
			{editMode ? (
				<div className="part-info-card">
					<div>
						<img height="200vh" width="150vw" src={part.image ? part.image : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}></img>
					</div>
					<>
						<div >
							<hr />
						</div>
						<div className="space-between-flex">
							<label className="title-with-icon button add-color" onClick={handleSave}>
								<Save fontSize="medium"></Save>Save</label>
							<label className="title-with-icon button delete-color" onClick={handleCancel}>
								<Clear fontSize="medium"></Clear>Cancel
							</label>
						</div>
						<div >
							<hr />
						</div>
					</>
					<form onSubmit={handleSave}>
						<div>
							<label><b>Title: </b>
								<input
									type="text"
									name="title"
									value={newTitle}
									onChange={handleChange}
								/>
							</label>
						</div>
						<div>
							<label><b>Author: </b></label>
							<input
								type="text"
								name="author"
								value={newAuthor}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label><b>Status: </b></label>
							<select name="status" value={newStatus} onChange={handleChange}>
								<option value="Unread">Unread</option>
								<option value="In Progress">In Progress</option>
								<option value="Finished">Finished</option>
							</select>
						</div>
					</form>
				</div>
			) : (
				<div onClick={handleClickCard} className={editableCard ? "part-info-card" : "part-info-card-small"} >
					<div className="part-name">{part.name}</div>
                    <div className="part-image">
						<img height={editableCard ? "200vh" : "50vh"} width={editableCard ? "150vw" : "30vh"} src={part.image ? part.image : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}></img>
					</div>

					{editableCard &&
						<>
							<div >
								<hr />
							</div>
							<div className="space-between-flex">
								<label className="title-with-icon button edit-color" onClick={handleEdit}>
									<Edit fontSize="medium">
									</Edit>
									Edit
								</label>
								<label className="title-with-icon button delete-color" onClick={handleDelete}>
									<DeleteForever fontSize="medium"></DeleteForever>
									Delete
								</label>
							</div>
							<div >
								<hr />
							</div>
						</>
					}
					<div >
						<p>{editableCard && <b>Title:</b>} {part.title}</p>
						<p>{editableCard && <b>Author:</b>} {part.author}</p>
						{editableCard && <p><b>Status:</b> {part.status}</p>}
					</div>

				</div>
			)}
		</div>
	);
};

export default PartCard;