import { describe, it, expect } from 'vitest';
import { companySchema, type CompanyFormData } from '@/schemas/companySchema';

const makeValid = (
    overrides: Partial<CompanyFormData> = {}
): CompanyFormData => ({
    companyName: '株式会社テスト',
    companyNameKana: 'カブシキガイシャテスト',
    companyCode: 'AB-12345',
    contactPersonLastName: '山田',
    contactPersonFirstName: '太郎',
    contactPersonLastNameKana: 'ヤマダ',
    contactPersonFirstNameKana: 'タロウ',
    phoneNumber: '09012345678',
    postalCode: '1000005',
    prefecture: '13',
    city: '千代田区',
    address: '1―1',
    buildingName: '',
    fiscalYearStart: '02',
    fiscalYearEnd: '03',
    loginEmail: 'taro.yamada@example.com',
    password: 'Password123!',
    appIntegration: 'yes',
    safetyConfirmation: 'yes',
    occupationalHealthIntegration: 'no',
    employeeChatDisplay: 'show',
    ...overrides,
});

describe('companySchema (Zod)', () => {
    it('accepts a valid payload', () => {
        const result = companySchema.safeParse(makeValid());
        expect(result.success).toBe(true);
    });

    it('requires phoneNumber to be numeric and non-empty', () => {
        expect(
            companySchema.safeParse(makeValid({ phoneNumber: '' })).success
        ).toBe(false);
        expect(
            companySchema.safeParse(makeValid({ phoneNumber: '09012345678' }))
                .success
        ).toBe(true);
        expect(
            companySchema.safeParse(makeValid({ phoneNumber: '090-1234-5678' }))
                .success
        ).toBe(false);
    });

    it('enforces prefecture JIS code (01-47)', () => {
        expect(
            companySchema.safeParse(makeValid({ prefecture: '00' })).success
        ).toBe(false);
        expect(
            companySchema.safeParse(makeValid({ prefecture: '48' })).success
        ).toBe(false);
        expect(
            companySchema.safeParse(makeValid({ prefecture: '01' })).success
        ).toBe(true);
    });

    it('enforces fiscal months format and relation (end > start)', () => {
        expect(
            companySchema.safeParse(
                makeValid({ fiscalYearStart: '02', fiscalYearEnd: '02' })
            ).success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ fiscalYearStart: '12', fiscalYearEnd: '01' })
            ).success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ fiscalYearStart: '01', fiscalYearEnd: '02' })
            ).success
        ).toBe(true);
    });

    it('requires fiscal year start and end months', () => {
        expect(
            companySchema.safeParse(makeValid({ fiscalYearStart: '' })).success
        ).toBe(false);
        expect(
            companySchema.safeParse(makeValid({ fiscalYearEnd: '' })).success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ fiscalYearStart: '', fiscalYearEnd: '' })
            ).success
        ).toBe(false);
    });

    it('requires prefecture to be selected', () => {
        expect(
            companySchema.safeParse(makeValid({ prefecture: '' })).success
        ).toBe(false);
        expect(
            companySchema.safeParse(makeValid({ prefecture: '13' })).success
        ).toBe(true);
    });

    it('validates scripts for names', () => {
        // ASCII should fail for Japanese-only fields
        expect(
            companySchema.safeParse(makeValid({ companyName: 'ABC' as any }))
                .success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ contactPersonLastNameKana: 'YAMADA' as any })
            ).success
        ).toBe(false);
    });

    it('validates companyCode (uppercase alnum-hyphen) and max length', () => {
        expect(
            companySchema.safeParse(makeValid({ companyCode: 'ab-123' as any }))
                .success
        ).toBe(false);
        const long = 'A'.repeat(256);
        expect(
            companySchema.safeParse(makeValid({ companyCode: long as any }))
                .success
        ).toBe(false);
    });

    it('validates postalCode (numeric only)', () => {
        expect(
            companySchema.safeParse(makeValid({ postalCode: 'ABC' as any }))
                .success
        ).toBe(false);
    });

    it('validates address uses fullwidth dash (―), not ASCII hyphen', () => {
        expect(
            companySchema.safeParse(makeValid({ address: '1-1' as any }))
                .success
        ).toBe(false);
        expect(
            companySchema.safeParse(makeValid({ address: '1―1' })).success
        ).toBe(true);
    });

    it('validates buildingName allowed chars and max', () => {
        expect(
            companySchema.safeParse(makeValid({ buildingName: 'パレスビル' }))
                .success
        ).toBe(true);
        expect(
            companySchema.safeParse(
                makeValid({ buildingName: 'palace' as any })
            ).success
        ).toBe(false);
        const longName = 'ア'.repeat(256);
        expect(
            companySchema.safeParse(
                makeValid({ buildingName: longName as any })
            ).success
        ).toBe(false);
    });

    it('validates email max and format', () => {
        expect(
            companySchema.safeParse(
                makeValid({ loginEmail: 'not-an-email' as any })
            ).success
        ).toBe(false);
        const longLocal = `${'a'.repeat(250)}@a.co`;
        expect(
            companySchema.safeParse(makeValid({ loginEmail: longLocal as any }))
                .success
        ).toBe(false);
    });

    it('validates password policy and length', () => {
        expect(
            companySchema.safeParse(makeValid({ password: 'Test1!' })).success
        ).toBe(true);
        expect(
            companySchema.safeParse(
                makeValid({ password: 'noupper123!' as any })
            ).success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ password: 'NOLOWER123!' as any })
            ).success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ password: 'NoDigits!!!!' as any })
            ).success
        ).toBe(false);
        expect(
            companySchema.safeParse(
                makeValid({ password: 'Password123!x' as any })
            ).success
        ).toBe(false); // 13 chars
    });

    it('forces occupationalHealthIntegration to "no"', () => {
        expect(
            companySchema.safeParse(
                makeValid({ occupationalHealthIntegration: 'no' })
            ).success
        ).toBe(true);
        expect(
            companySchema.safeParse(
                makeValid({
                    occupationalHealthIntegration: 'yes' as unknown as any,
                })
            ).success
        ).toBe(false);
    });
});
