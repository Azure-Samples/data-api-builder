import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './BookList.css';

function CreateBookModal({ showModal, setShowModal, refetch }) {
    const [title, setTitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [genre, setGenre] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const createBookRequest = async () => {
        try {
            const response = await fetch('/data-api/api/Book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MS-API-ROLE' : 'admin',
                },
                body: JSON.stringify({
                    title,
                    authorId,
                    genre,
                    publicationdate: publicationDate,
                    imageurl: imageUrl
                })
            });
            const data = await response.json();
            if (response.ok) {
                setShowModal(false);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await createBookRequest();
        refetch();
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create Author</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" value={title} onChange={(event) => setTitle(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="authorId">
                        <Form.Label>Author ID</Form.Label>
                        <Form.Control type="text" placeholder="Enter author ID" value={authorId} onChange={(event) => setAuthorId(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="genre">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control type="text" placeholder="Enter genre" value={genre} onChange={(event) => setGenre(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="publicationDate">
                        <Form.Label>Publication Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter publication date" value={publicationDate} onChange={(event) => setPublicationDate(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="imageUrl">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="text" placeholder="Enter image URL" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateBookModal;
