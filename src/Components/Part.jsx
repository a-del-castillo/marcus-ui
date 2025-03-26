import React, { useState } from "react";
import { Edit, DeleteForever, Clear, Save } from "@mui/icons-material";

// A component to display a single book
const Part = (props) => {
    // const { part, onDelete, onUpdate, editableCard } = props
	const { part } = props
    const [editMode, setEditMode] = useState(false);
    const editableCard = false
	// const [newTitle, setNewTitle] = useState(book.title);
	// const [newAuthor, setNewAuthor] = useState(book.author);
	// const [newStatus, setNewStatus] = useState(book.status);
    /*
	const handleDelete = () => {
		onDelete(book.isbn);
	};

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleSave = (e) => {
		e.preventDefault();
		onUpdate(book.isbn, newTitle, newAuthor, newStatus, book.image);
		setEditMode(false);
	};

	const handleCancel = () => {
		setEditMode(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "title") {
			setNewTitle(value);
		} else if (name === "author") {
			setNewAuthor(value);
		} else if (name === "status") {
			setNewStatus(value);
		}
	};


        "id": 1,
        "name": "Full-suspension",
        "category": "frame",
        "price": "130.0",
        "available": "true",
        "extra_props": {},
        "created_at": "2025-03-23T16:40:40.811Z",
        "updated_at": "2025-03-23T16:40:40.811Z"

    */
	return (
		<div className="part">
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
				<div className={editableCard ? "part-info-card" : "part-info-card-small"} >
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

export default Part;