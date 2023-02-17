import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Navbar, Nav, Button } from 'react-bootstrap';

import './App.css';

import BookList from './Components/BookList/BookList';
import AuthorList from './Components/AuthorList/AuthorList';

const client = new ApolloClient({
  uri: '/data-api/graphql',
  cache: new InMemoryCache({
    addTypename: false
  })
});

function App() {
  //read token from cookie StaticWebAppsAuthCookie
  let token;

  try{
    token = document.cookie.split(';').find(c => c.trim().startsWith('StaticWebAppsAuthCookie=')).split('=')[1];
  } catch (e) {
    token = null;
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <div className="maxWidth1200Centered" style={{ display: 'flex', padding: '1rem', justifyContent: 'space-between'}}>
            <Navbar.Brand>Library Demo</Navbar.Brand>
            <Nav className="ml-auto">
              { token ?
                  <Button variant="light">
                    <a href='/.auth/logout'>Logout</a>
                  </Button>
                :
                  <Button variant="light">
                    <a href='/.auth/login/github'>Login</a>
                  </Button>
              }
            </Nav>
          </div>
        </Navbar>

        <div className="maxWidth1200Centered">
          <BookList/>
          <AuthorList/>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
