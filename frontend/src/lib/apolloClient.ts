import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { authService } from '../services/authService';

const uri = `${import.meta.env.VITE_API_URL}/graphql`;

const authLink = setContext((_, { headers }) => {
  const token = authService.getAccessToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const httpLink = new HttpLink({ uri });

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
