import { describe, it, expect } from 'vitest';
import { toApiCompanyPayload } from '@/lib/companyMapper';
import { type CompanyFormData } from '@/schemas/companySchema';

const sample: CompanyFormData = {
    companyName: '株式会社テスト',
    companyNameKana: 'カブシキガイシャテスト',
    companyCode: 'AB-12345',
    contactPersonLastName: '山田',
    contactPersonFirstName: '太郎',
    contactPersonLastNameKana: 'ヤマダ',
    contactPersonFirstNameKana: 'タロウ',
    phoneNumber: '09012345678',
    postalCode: '1000005',
    prefecture: '13', // 東京都
    city: '千代田区',
    address: '丸の内 1-1',
    buildingName: 'パレスビル',
    fiscalYearStart: '2',
    fiscalYearEnd: '3',
    loginEmail: 'taro.yamada@example.com',
    password: 'Password123!',
    appIntegration: 'yes',
    safetyConfirmation: 'yes',
    occupationalHealthIntegration: 'no',
    employeeChatDisplay: 'show',
};

describe('toApiCompanyPayload', () => {
    it('maps to SPEC payload exactly', () => {
        const payload = toApiCompanyPayload(sample, {
            addressMode: 'location',
            fiscalKey: 'fiscalYearEndMonth',
        });

        expect(payload).toEqual({
            companyName: '株式会社テスト',
            companyNameKana: 'カブシキガイシャテスト',
            companyCode: 'AB-12345',
            contactName: '山田 太郎',
            contactNameKana: 'ヤマダ タロウ',
            phoneNumber: '09012345678',
            postalCode: '1000005',
            location: {
                prefecture: '東京都',
                city: '千代田区',
                streetAddress: '丸の内 1-1',
                addressLine: 'パレスビル',
            },
            fiscalYearEndMonth: '02-03',
            ownerLoginEmail: 'taro.yamada@example.com',
            ownerLoginPassword: 'Password123!',
            appIntegrationEnabled: true,
            safetyConfirmationEnabled: true,
            occupationalDoctorIntegrationEnabled: false,
            employeeChatEnabled: true,
        });
    });
});
