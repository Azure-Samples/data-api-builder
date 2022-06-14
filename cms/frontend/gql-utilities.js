import { gql, useQuery } from "@apollo/client";
import client from "./apollo-client";

const gql_functions = {

    get_statuses: async () => {
        const { data } = await client.query({
            query: gql`
                query getStatuses {
                    statuses {
                        items {
                            id,
                            name
                        }
                }
            }`
        });
        return data.statuses.items;
    },
    get_articles: async () => {
        const { data } = await client.query({
            query: gql`
            {
                articles {
                    items {
                        id,
                        title,
                        body,
                        status
                    } 
                }
            }`,
            context: {
                headers: {
                    "x-ms-api-role":"me."
                }
            }
        });
        return data.articles.items
    },
    get_users: async () => {
        const { data } = await client.query({
            query: gql`
            query getUsers {
                users {
                    items {
                    guid,
                    fname,
                    lname,
                    email
                    }
                }
            }`
        });
        return data.users.items;
    },

    create_article: async (title, body) => {
        const { data } = await client.mutate({
            mutation: gql`
            mutation CreateArticle {
                createArticle( item: {
                    title: "${title}",
                    body: """${body}""",
                    status: 2,
                }
                )
                 {
                    id
                 }
            }`
        });
        return data;
    },
    create_user: async (guid, fname, lname, email) => {
        const { data } = await client.mutate({
            mutation: gql`
            mutation CreateUser {
            createUser(item: {
                guid: ${guid},
                fname: "${fname}",
                lname: "${lname}",
                email: "${email}"
            }
            ) {
                guid
            }
        }`
        });
        return data;
    },

    update_article: async (id, title, body, status) => {
        const { data } = await client.mutate({
            mutation: gql`
            mutation UpdateArticle {
            updateArticle( id: ${id}, item: {
                title: "${title}"
              })
              {
                id
              }
            }`
        });
        return data;

    },
    update_user: async (guid, fname, lname, email) => {
        const { data } = await client.mutate({
            mutation: gql`
            mutation UpdateUser {
              updateUser(guid: ${guid}, item: {
                fname: "${fname}"
              }) 
              {
                guid
              }
            }`
        });
        return data;

    },

    delete_article: async (id) => {
        const { data } = await client.mutate({
            mutation: gql`
            mutation DeleteArticle {
              deleteArticle(id: ${id}) {
                id
              }
            }`
        });
        return data;
    },
    delete_user: async (guid) => {
        const { data } = await client.mutate({
            mutation: gql`
            mutation DeleteUser {
              deleteUser(guid: ${guid}) {
                guid
              }
            }`
        });
        return data;

    }
    
}

export default gql_functions;