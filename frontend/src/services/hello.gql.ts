import { gql } from '@apollo/client';

export const GET_HELLO = gql`
    query GetHello {
        hello
    }
`;
