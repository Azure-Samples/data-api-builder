import { gql, useQuery } from "@apollo/client";
import client from "./apollo-client";

const gql_functions = {
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
            }`
        });
        return data.articles.items
    },
    create_article: async (title, body) => {
        console.log(title, body);
    }

}

export default gql_functions;