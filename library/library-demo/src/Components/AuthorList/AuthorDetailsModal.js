import React, { useState, useEffect } from 'react';
import { Card, Modal, Form } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';

const GET_AUTHOR = gql`
  query GetAuthorByPk($id: Int!) {
    author_by_pk(id: $id) {
      id
      name
      birthdate
      imageurl
      books {
        items {
            imageurl
            title
            publicationdate
        }
      }
    }
  }
`;

function AuthorDetailsModal({ closeModal, authorId }) {
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [imageurl, setImageurl] = useState('');
    const [books, setBooks] = useState([]);

    const { data } = useQuery(GET_AUTHOR, {
        variables: { id: authorId }
    });

    useEffect(() => {
        if (data) {
          setName(data.author_by_pk.name);
          setBirthdate(data.author_by_pk.birthdate);
          setImageurl(data.author_by_pk.imageurl);
            setBooks(data.author_by_pk.books.items);

        }
    }, [data]);

    return (
        <Modal show={true} onHide={() => closeModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Author Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" disabled placeholder="Enter name" value={name} onChange={(event) => setName(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="birthdate">
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control type="date" disabled placeholder="Enter birthdate" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="imageurl">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="text" disabled placeholder="Enter image URL" value={imageurl} onChange={(event) => setImageurl(event.target.value)} />
                    </Form.Group>
                    <div>
                        <br />
                        <h3>Books</h3>
                        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'left', overflow: 'scroll'}}>
                            {//small react bootstrap cards with the details and the image of the book
                                books.map((book) => (
                                    <Card style={{ minWidth: '8rem', width: '8rem', margin: '1rem' }}>
                                        <div style = {{ backgroundColor: '#373940', textAlign: 'center' }}>
                                            <Card.Img variant="top" src={book.imageurl} style={{ width: '5rem' }} />
                                        </div>
                                        <Card.Body>
                                            <Card.Title style={{ fontSize: '0.8rem', margin: '0rem' }}>{book.title}</Card.Title>
                                            <Card.Text>
                                                {book.publicationdate}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))
                            }   
                        </div>
     
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AuthorDetailsModal;