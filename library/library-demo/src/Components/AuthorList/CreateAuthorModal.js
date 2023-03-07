//import react and useState from react
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button, Modal, Form } from 'react-bootstrap';
import './AuthorList.css';

const CREATE_AUTHOR = gql`
    mutation CreateAuthor($item: CreateAuthorInput!) {
        createAuthor(item: $item) {
            name
            bio
            birthdate
            imageurl
        }
    }
`;

function CreateAuthorModal({ showModal, setShowModal, refetch }) {
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [bio, setBio] = useState('');
    const [imageurl, setImageurl] = useState('');

    const [createAuthor] = useMutation(CREATE_AUTHOR, {
        onCompleted() {
            setShowModal(false);
            refetch();
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        createAuthor({ variables: { item: { name, birthdate, bio, imageurl } } });
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create Author</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(event) => setName(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="birthdate">
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control type="date" placeholder="Enter birthdate" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="bio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control type="text" placeholder="Enter bio" value={bio} onChange={(event) => setBio(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="imageurl">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="text" placeholder="Enter image URL" value={imageurl} onChange={(event) => setImageurl(event.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
  

            </Modal.Body>
        </Modal>
    );
}

export default CreateAuthorModal;