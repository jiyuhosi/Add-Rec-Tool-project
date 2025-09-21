import { describe, it, expect } from 'vitest';
import { mapFormToCompanyCreateInput } from '@/mappers/company/mapFormToInput';
import { type CompanyFormData } from '../../schemas/companySchema';

const baseForm: CompanyFormData = {
    companyName: '大阪商事',
    companyNameKana: 'オオサカショウジ',
    companyCode: 'OSK-001',
    contactPersonLastName: '山田',
    contactPersonFirstName: '太郎',
    contactPersonLastNameKana: 'ヤマダ',
    contactPersonFirstNameKana: 'タロウ',
    phoneNumber: '0612345678',
    postalCode: '5300001',
    prefecture: '大阪府',
    city: '大阪市北区',
    address: '梅田1-1-1',
    buildingName: 'XXビル 10F',
    fiscalYearStart: '2',
    fiscalYearEnd: '3',
    loginEmail: 'owner@example.com',
    password: 'Abc123!',
    appIntegration: 'yes',
    safetyConfirmation: 'yes',
    occupationalHealthIntegration: 'no',
    employeeChatDisplay: 'show',
};

describe('mapFormToCompanyCreateInput', () => {
    it('maps core fields correctly', () => {
        const input = mapFormToCompanyCreateInput(baseForm);
        expect(input.companyName).toBe('大阪商事');
        expect(input.companyCode).toBe('OSK-001');
        expect(input.contactName).toBe('山田太郎');
        expect(input.contactNameKana).toBe('ヤマダタロウ');
        expect(input.postalCode).toBe('5300001');
        expect(input.location.prefecture).toBe('大阪府');
        expect(input.location.streetAddress).toBe('梅田1-1-1');
        expect(input.location.addressLine).toBe('XXビル 10F');
    });

    it('pads and concatenates fiscal months to MM-MM', () => {
        const input = mapFormToCompanyCreateInput(baseForm);
        expect(input.months).toBe('02-03');
    });

    it('maps flags from enums to booleans', () => {
        const input = mapFormToCompanyCreateInput(baseForm);
        expect(input.appIntegrationEnabled).toBe(true);
        expect(input.safetyConfirmationEnabled).toBe(true);
        expect(input.occupationalDoctorIntegrationEnabled).toBe(false);
        expect(input.employeeChatEnabled).toBe(true);
    });

    it('omits optional fields when blank', () => {
        const form = { ...baseForm, phoneNumber: '', buildingName: '' };
        const input = mapFormToCompanyCreateInput(form);
        expect(input.phoneNumber).toBeUndefined();
        expect(input.location.addressLine).toBeUndefined();
    });
});
