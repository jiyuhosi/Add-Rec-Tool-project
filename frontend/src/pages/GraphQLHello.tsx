import { useQuery } from '@apollo/client/react';
import { GET_HELLO } from '../services/hello.gql';

type HelloData = { hello: string };

export default function GraphQLHello() {
    const { data, loading, error } = useQuery<HelloData>(GET_HELLO);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <div>GraphQL says: {data?.hello}</div>;
}
