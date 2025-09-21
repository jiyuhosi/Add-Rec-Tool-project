import { gql } from '@apollo/client';

export const CREATE_COMPANY = gql`
    mutation CreateCompany($input: CompanyCreateInput!) {
        createCompany(input: $input) {
            companyCode
        }
    }
`;

export type LocationInput = {
    prefecture: string;
    city: string;
    streetAddress: string;
    addressLine?: string | null;
};

export type CompanyCreateInput = {
    companyName: string;
    companyNameKana: string;
    companyCode: string;
    contactName: string;
    contactNameKana: string;
    phoneNumber?: string | null;
    postalCode: string;
    location: LocationInput;
    months: string; // "MM-MM" e.g., "02-03"
    ownerLoginEmail: string;
    ownerLoginPassword: string;
    appIntegrationEnabled: boolean;
    safetyConfirmationEnabled: boolean;
    occupationalDoctorIntegrationEnabled: boolean;
    employeeChatEnabled: boolean;
};

export type CreateCompanyResult = {
    createCompany: {
        id: string;
        companyCode: string;
    };
};
