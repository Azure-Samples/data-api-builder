//import react and useState from react
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Button, } from 'react-bootstrap';
import './AuthorList.css';

import CreateAuthorModal from './CreateAuthorModal';
import AuthorDetailsModal from './AuthorDetailsModal';

const GET_AUTHORS = gql`
    query {
        authors {
            items{
                id
                name
                birthdate
                imageurl
            }
        }
    }
`;

//delete author
const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id: Int!) {
        deleteAuthor(id: $id) {
            id
        }
    }
`;

function AuthorList() {
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAuthorId, setSelectedAuthorId] = useState(0);

    const { loading, getError, data, refetch } = useQuery(GET_AUTHORS, {
        baseUrl: '/data-api/graphql'
    });
    const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
        onCompleted: () => refetch(),
        headers: {
            'X-MS-API-ROLE' : 'admin'
        }
    });


    if (loading) return <p>Loading...</p>;
    if (getError) return <p>Error :{getError.message}</p>;

    return (
        <div className='author-page'>
            <div style={{ textAlign: 'left', margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Authors</h1>
                <div>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Create
                    </Button>
                </div>
            </div>
            <CreateAuthorModal showModal={showModal} setShowModal={setShowModal} refetch={refetch} />
            <div className="author-list">
                {data.authors.items.map(author =>
                    <Card key={author.id} className="author-card" style={{ width: '18rem', margin: '1rem' }}>
                        <div style={{ backgroundColor: '#373940' }}>
                            <Card.Img variant="top" src={author.imageurl} style={{ height: '14rem', width: 'fit-content' }} />
                        </div>
                        <Card.Body>
                            <Card.Title>{author.name}</Card.Title>
                            <Card.Text>
                                Birthdate: {
                                    new Date(author.birthdate).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                }
                            </Card.Text>

                            <Button variant="primary" onClick={() => {
                                setShowDetailsModal(true);
                                setSelectedAuthorId(author.id);
                            }}>
                                Details
                            </Button>


                            <Button variant="danger" onClick={() => {
                                deleteAuthor({ variables: { id: author.id } });
                                refetch();
                            }}>
                                Delete
                            </Button>

                        </Card.Body>
                    </Card>
                )}
                { showDetailsModal &&
                    <AuthorDetailsModal
                        closeModal={() => setShowDetailsModal(false)}
                        authorId={selectedAuthorId}
                    />
                }
            </div>
        </div>
    );
}



export default AuthorList;