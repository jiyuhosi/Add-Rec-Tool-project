import { describe, it, expect } from 'vitest';
import { companySchema, type CompanyFormData } from '@/schemas/companySchema';

// Helper to build a fully valid baseline payload
const makeValidPayload = (
    overrides: Partial<CompanyFormData> = {}
): CompanyFormData => ({
    companyName: '株式会社テスト', // 漢字 + カタカナ
    companyNameKana: 'カブシキガイシャテスト',
    companyCode: 'ABC-123',
    contactPersonLastName: '山田',
    contactPersonFirstName: '太郎',
    contactPersonLastNameKana: 'ヤマダ',
    contactPersonFirstNameKana: 'タロウ',
    phoneNumber: '0312345678',
    postalCode: '1234567',
    prefecture: '大阪府',
    city: '大阪市',
    address: '1―2―3', // 全角ハイフン
    buildingName: 'テストビルA', // 大文字Aは許可
    fiscalYearStart: '4',
    fiscalYearEnd: '12',
    loginEmail: 'owner@example.com',
    password: 'Abcdef1',
    appIntegration: 'no',
    safetyConfirmation: 'no',
    occupationalHealthIntegration: 'no',
    employeeChatDisplay: 'hide',
    ...overrides,
});

describe('companySchema validation', () => {
    it('accepts a fully valid payload (appIntegration: no)', () => {
        const payload = makeValidPayload();
        const result = companySchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('accepts a valid payload when appIntegration is yes and required options are set', () => {
        const payload = makeValidPayload({
            appIntegration: 'yes',
            safetyConfirmation: 'yes',
            employeeChatDisplay: 'show',
        });
        const result = companySchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('fails when email is invalid', () => {
        const payload = makeValidPayload({ loginEmail: 'invalid-email' });
        const result = companySchema.safeParse(payload);
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                '有効なメールアドレスを入力してください'
            );
        }
    });

    it('fails when password lacks required character classes', () => {
        // missing uppercase
        let result = companySchema.safeParse(
            makeValidPayload({ password: 'abcdef1' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'パスワードには少なくとも1つの大文字（A-Z）を含めてください。'
            );
        }

        // missing lowercase
        result = companySchema.safeParse(
            makeValidPayload({ password: 'ABCDEF1' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'パスワードには少なくとも1つの小文字（a-z）を含めてください。'
            );
        }

        // missing digit
        result = companySchema.safeParse(
            makeValidPayload({ password: 'Abcdefg' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'パスワードには少なくとも1つの数字（0-9）を含めてください。'
            );
        }
    });

    it('fails when password is too short or too long', () => {
        // too short
        let result = companySchema.safeParse(
            makeValidPayload({ password: 'Ab1' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'パスワードは6文字以上で入力してください'
            );
        }

        // too long
        result = companySchema.safeParse(
            makeValidPayload({ password: 'Abcdef123456789' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'パスワードは12文字以内で入力してください'
            );
        }
    });

    it('fails when password contains non-ASCII characters', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ password: 'Abcdef1あ' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain('半角文字で入力してください');
        }
    });

    it('fails when phoneNumber contains hyphens', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ phoneNumber: '03-1234-5678' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain('数字のみで入力してください');
        }
    });

    it('allows phoneNumber to be omitted (optional field)', () => {
        const payload = makeValidPayload();
        delete (payload as any).phoneNumber; // undefined -> allowed by optional()
        const result = companySchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('fails when phoneNumber is too long', () => {
        const longPhoneNumber = '0'.repeat(256); // > 255 chars
        const result = companySchema.safeParse(
            makeValidPayload({ phoneNumber: longPhoneNumber })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            // Schema message says 15 even though max is 255 in code
            expect(messages).toContain(
                '電話番号は15文字以内で入力してください'
            );
        }
    });

    it('fails when postalCode contains hyphen', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ postalCode: '123-4567' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain('数字のみで入力してください');
        }
    });

    it('fails when address uses ASCII hyphen instead of full-width', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ address: '1-2-3' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                '数字、全角ハイフン（―）で入力してください'
            );
        }
    });

    it('fails when companyName contains Latin letters', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ companyName: 'Test株式会社' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'カタカナ、漢字、ひらがなで入力してください'
            );
        }
    });

    it('fails when companyCode contains lowercase letters', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ companyCode: 'abc-123' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                '大文字英字、数字、ハイフンで入力してください'
            );
        }
    });

    it('fails when Kana-only fields include hiragana', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ companyNameKana: 'かぶしきがいしゃテスト' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain('カタカナで入力してください');
        }
    });

    it('allows buildingName to be empty or undefined, but rejects lowercase latin', () => {
        // empty string should pass (treated as not provided)
        let result = companySchema.safeParse(
            makeValidPayload({ buildingName: '' })
        );
        expect(result.success).toBe(true);

        // undefined should pass as well
        const { buildingName, ...rest } = makeValidPayload();
        result = companySchema.safeParse({
            ...rest,
            buildingName: undefined,
        } as any);
        expect(result.success).toBe(true);

        // lowercase latin should fail
        result = companySchema.safeParse(
            makeValidPayload({ buildingName: 'テストビルa' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                'カタカナ、漢字、ひらがな、大文字英字、ハイフンで入力してください'
            );
        }
    });

    it('enforces fiscal year end to be after start', () => {
        let result = companySchema.safeParse(
            makeValidPayload({ fiscalYearStart: '4', fiscalYearEnd: '4' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain(
                '年度終了月は開始月より後でなければなりません'
            );
        }

        result = companySchema.safeParse(
            makeValidPayload({ fiscalYearStart: '10', fiscalYearEnd: '3' })
        );
        expect(result.success).toBe(false);

        result = companySchema.safeParse(
            makeValidPayload({ fiscalYearStart: '3', fiscalYearEnd: '4' })
        );
        expect(result.success).toBe(true);
    });

    it('flags missing required fields (e.g., prefecture)', () => {
        const result = companySchema.safeParse(
            makeValidPayload({ prefecture: '' })
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message);
            expect(messages).toContain('都道府県は必須です');
        }
    });

    it('fails when required fields are missing', () => {
        const testFields = [
            { field: 'companyName', message: '企業名は必須です' },
            { field: 'companyNameKana', message: '企業名（カナ）は必須です' },
            { field: 'companyCode', message: '企業コードは必須です' },
            {
                field: 'contactPersonLastName',
                message: '担当者名（姓）は必須です',
            },
            {
                field: 'contactPersonFirstName',
                message: '担当者名（名）は必須です',
            },
            {
                field: 'contactPersonLastNameKana',
                message: '担当者名（セイ）は必須です',
            },
            {
                field: 'contactPersonFirstNameKana',
                message: '担当者名（メイ）は必須です',
            },
            { field: 'postalCode', message: '郵便番号は必須です' },
            { field: 'city', message: '市区町村は必須です' },
            { field: 'address', message: '番地は必須です' },
            { field: 'fiscalYearStart', message: '年度開始月は必須です' },
            { field: 'fiscalYearEnd', message: '年度終了月は必須です' },
            { field: 'loginEmail', message: 'ログインIDは必須です' },
        ];

        testFields.forEach(({ field, message }) => {
            const result = companySchema.safeParse(
                makeValidPayload({ [field]: '' } as any)
            );
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map(i => i.message);
                expect(messages).toContain(message);
            }
        });
    });

    it('when appIntegration is yes, missing employeeChatDisplay should raise an error', () => {
        const base = makeValidPayload({
            appIntegration: 'yes',
            safetyConfirmation: 'yes',
        });
        // Remove employeeChatDisplay to trigger object-level refine and enum required_error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employeeChatDisplay, ...rest } = base;
        const result = companySchema.safeParse(rest as any);
        expect(result.success).toBe(false);
        if (!result.success) {
            const byPath = (p: string) =>
                result.error.issues
                    .filter(i => i.path.join('.') === p)
                    .map(i => i.message);
            const empMsgs = byPath('employeeChatDisplay');
            expect(empMsgs.length).toBeGreaterThan(0);
            // Should include at least the enum required_error or the custom refine message
            expect(empMsgs.join('\n')).toMatch(
                /従業員とのチャット表示設定は必須です|アプリ連携選択した場合、従業員とのチャット表示設定は必須です/
            );
        }
    });

    it('validates enum fields properly', () => {
        // Test missing required enum fields
        const requiredEnumFields = [
            {
                field: 'appIntegration',
                message: 'アプリ連携を選択してください',
            },
            {
                field: 'safetyConfirmation',
                message: '安否確認を選択してください',
            },
            {
                field: 'occupationalHealthIntegration',
                message: '産業医連携を選択してください',
            },
            {
                field: 'employeeChatDisplay',
                message: '従業員とのチャット表示設定は必須です',
            },
        ];

        requiredEnumFields.forEach(({ field, message }) => {
            // Remove the field to trigger required_error
            const payload = makeValidPayload();
            delete (payload as any)[field];

            const result = companySchema.safeParse(payload);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map(i => i.message);
                expect(messages).toContain(message);
            }
        });

        // Test invalid enum values (should fail with Zod's default enum error)
        const invalidEnumTests = [
            { field: 'appIntegration', invalidValue: 'maybe' },
            { field: 'safetyConfirmation', invalidValue: 'maybe' },
            { field: 'occupationalHealthIntegration', invalidValue: 'maybe' },
            { field: 'employeeChatDisplay', invalidValue: 'maybe' },
        ];

        invalidEnumTests.forEach(({ field, invalidValue }) => {
            const result = companySchema.safeParse(
                makeValidPayload({ [field]: invalidValue } as any)
            );
            expect(result.success).toBe(false);
        });
    });

    it('validates field length limits', () => {
        const longString = 'a'.repeat(256);

        const fieldsWithLimits = [
            {
                field: 'companyName',
                message: '企業名は255文字以内で入力してください',
            },
            {
                field: 'companyNameKana',
                message: '企業名（カナ）は255文字以内で入力してください',
            },
            {
                field: 'companyCode',
                message: '企業コードは255文字以内で入力してください',
            },
            {
                field: 'contactPersonLastName',
                message: '担当者名（姓）は255文字以内で入力してください',
            },
            {
                field: 'contactPersonFirstName',
                message: '担当者名（名）は255文字以内で入力してください',
            },
            {
                field: 'contactPersonLastNameKana',
                message: '担当者名（セイ）は255文字以内で入力してください',
            },
            {
                field: 'contactPersonFirstNameKana',
                message: '担当者名（メイ）は255文字以内で入力してください',
            },
            {
                field: 'loginEmail',
                message: 'ログインIDは255文字以内で入力してください',
            },
        ];

        fieldsWithLimits.forEach(({ field, message }) => {
            const result = companySchema.safeParse(
                makeValidPayload({ [field]: longString } as any)
            );
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map(i => i.message);
                expect(messages).toContain(message);
            }
        });
    });
});
