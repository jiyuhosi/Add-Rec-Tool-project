import type { CompanyFormData } from '../../schemas/companySchema';
import type { CompanyCreateInput } from '../../services/company/createCompany.gql';

export function mapFormToCompanyCreateInput(
    data: CompanyFormData
): CompanyCreateInput {
    const contactName = `${data.contactPersonLastName}${data.contactPersonFirstName}`;
    const contactNameKana = `${data.contactPersonLastNameKana}${data.contactPersonFirstNameKana}`;

    const fiscalYearStartMM = String(
        parseInt(data.fiscalYearStart, 10)
    ).padStart(2, '0');
    const fiscalYearEndMM = String(parseInt(data.fiscalYearEnd, 10)).padStart(
        2,
        '0'
    );
    const months = `${fiscalYearStartMM}-${fiscalYearEndMM}`;

    return {
        companyName: data.companyName,
        companyNameKana: data.companyNameKana,
        companyCode: data.companyCode,
        contactName,
        contactNameKana,
        phoneNumber: data.phoneNumber || undefined,
        postalCode: data.postalCode,
        location: {
            prefecture: data.prefecture,
            city: data.city,
            streetAddress: data.address,
            addressLine: data.buildingName || undefined,
        },
        months,
        ownerLoginEmail: data.loginEmail,
        ownerLoginPassword: data.password,
        appIntegrationEnabled: data.appIntegration === 'yes',
        safetyConfirmationEnabled: data.safetyConfirmation === 'yes',
        occupationalDoctorIntegrationEnabled:
            data.occupationalHealthIntegration === 'yes',
        employeeChatEnabled: data.employeeChatDisplay === 'show',
    };
}
