import React, { useState, useEffect } from 'react';
import { Card, Button, } from 'react-bootstrap';
import './BookList.css';
import CreateBookModal from './CreateBookModal';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async (disableLoadState) => {
        if(!disableLoadState) setIsLoading(true);
        try {
            const response = await fetch('/data-api/api/Book');
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setBooks(data.value);
        } catch (error) {
            setError(error);
        }
        setIsLoading(false);
    };

    const deleteBook = async (id) => {
        try {
            const response = await fetch(`/data-api/api/Book/id/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-MS-API-ROLE' : 'admin',
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            await fetchData(true);
        } catch (error) { }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return <p>{error.message}</p>;
    }

    if (isLoading) {
        return <p>Loading ...</p>;
    }

    return (
        <div className='book-page'>
            <div style={{ textAlign: 'left', margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Books</h1>
                <div>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Create
                    </Button>
                </div>
                <CreateBookModal showModal={showModal} setShowModal={setShowModal} refetch={fetchData} />
            </div>
            <div className='book-list'>
                {books.map(book =>
                    <Card key={book.id} style={{ width: '18rem', margin: '1rem' }}>
                        <div style={{ backgroundColor: '#373940' }}>
                            <Card.Img variant="top" src={book.imageurl} style={{ height: '14rem', width: 'fit-content' }} />
                        </div>
                        <Card.Body>
                            <Card.Title>{book.title}</Card.Title>
                            <Card.Text>
                                Author ID: {book.authorId}<br />
                                Genre: {book.genre}<br />
                                Publication Date: {book.publicationdate}
                            </Card.Text>
                            <Button variant="danger" onClick={() => deleteBook(book.id)}>Delete</Button>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BookList;