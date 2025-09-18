/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

// 企業登録フォームのバリデーションスキーマ
export const companySchema = z
    .object({
        // 企業情報
        companyName: z
            .string()
            .trim()
            .min(1, '企業名は必須です')
            .max(255, '企業名は255文字以内で入力してください')
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        companyNameKana: z
            .string()
            .trim()
            .min(1, '企業名（カナ）は必須です')
            .max(255, '企業名（カナ）は255文字以内で入力してください')
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        companyCode: z
            .string()
            .trim()
            .min(1, '企業コードは必須です')
            .max(255, '企業コードは255文字以内で入力してください')
            .regex(
                /^[A-Z0-9-]+$/,
                '大文字英字、数字、ハイフンで入力してください'
            ),
        contactPersonLastName: z
            .string()
            .trim()
            .min(1, '担当者名（姓）は必須です')
            .max(255, '担当者名（姓）は255文字以内で入力してください')
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        contactPersonFirstName: z
            .string()
            .trim()
            .min(1, '担当者名（名）は必須です')
            .max(255, '担当者名（名）は255文字以内で入力してください')
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        contactPersonLastNameKana: z
            .string()
            .trim()
            .min(1, '担当者名（セイ）は必須です')
            .max(255, '担当者名（セイ）は255文字以内で入力してください')
            .regex(/^[\p{Script=Katakana}ー]+$/u, 'カタカナで入力してください'),
        contactPersonFirstNameKana: z
            .string()
            .trim()
            .min(1, '担当者名（メイ）は必須です')
            .max(255, '担当者名（メイ）は255文字以内で入力してください')
            .regex(/^[\p{Script=Katakana}ー]+$/u, 'カタカナで入力してください'),
        // 電話番号は必須
        phoneNumber: z
            .string()
            .trim()
            .min(1, '電話番号は必須です')
            .regex(/^[0-9]+$/, '数字のみで入力してください')
            .max(255, '電話番号は255文字以内で入力してください'),
        postalCode: z
            .string()
            .trim()
            .min(1, '郵便番号は必須です')
            .regex(/^[0-9]+$/, '数字のみで入力してください')
            .max(255, '郵便番号は255文字以内で入力してください'),
        // 都道府県: JIS コード(01-47)
        prefecture: z
            .string()
            .trim()
            .min(1, '都道府県は必須です')
            .regex(
                /^(0[1-9]|[1-3][0-9]|4[0-7])$/,
                'JIS コード(01-47)を選択してください'
            ),
        city: z
            .string()
            .trim()
            .min(1, '市区町村は必須です')
            .max(255, '市区町村は255文字以内で入力してください'),
        address: z
            .string()
            .trim()
            .min(1, '番地は必須です')
            .regex(/^[0-9―]+$/, '数字、全角ハイフン（―）で入力してください')
            .max(255, '番地は255文字以内で入力してください'),
        // 建物名/部屋番号 任意（空文字許容）/ 最大255 / 許可文字: かな・カナ・漢字・A-Z・全角ハイフン
        buildingName: z.union([
            z.literal(''),
            z
                .string()
                .trim()
                .max(255, '建物名は255文字以内で入力してください')
                .regex(
                    /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Zー]+$/u,
                    'カタカナ、漢字、ひらがな、大文字英字、ハイフンで入力してください'
                ),
        ]),
        // 月: 01-12
        fiscalYearStart: z.string().trim().min(1, '開始月は必須です'),
        fiscalYearEnd: z.string().trim().min(1, '終了月は必須です'),

        // オーナーログイン情報
        loginEmail: z
            .string()
            .trim()
            .min(1, 'ログインIDは必須です')
            .max(254, 'メールアドレスは254文字以内で入力してください')
            .email('有効なメールアドレスを入力してください')
            .refine(email => {
                const atIndex = email.indexOf('@');
                if (atIndex === -1) return true; // .email() will catch this
                const localPart = email.substring(0, atIndex);
                return localPart.length <= 64;
            }, 'メールアドレスのローカル部は64文字以内である必要があります'),
        password: z
            .string()
            .trim()
            .min(6, 'パスワードは6文字以上で入力してください')
            .max(12, 'パスワードは12文字以内で入力してください')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[!-~]{6,12}$/,
                '半角英数字（大文字・小文字・数字を含む）で6〜12文字入力してください。記号は任意です。'
            ),

        // オプション選択
        appIntegration: z.enum(['yes', 'no'], {
            required_error: 'アプリ連携を選択してください',
        }),
        safetyConfirmation: z.enum(['yes', 'no'], {
            required_error: '安否確認を選択してください',
        }),
        // 仕様上 現在は "なし" 固定
        occupationalHealthIntegration: z.literal('no', {
            errorMap: () => ({ message: '現在は「なし」のみ選択可能です' }),
        }),

        // オプション選択（ドクター）
        employeeChatDisplay: z.enum(['show', 'hide'], {
            required_error: '従業員とのチャット表示設定は必須です',
        }),
    })
    // 年度の相関チェック: 終了月 > 開始月（SPEC）
    .refine(
        data => {
            // 年度開始月と終了月の関係を検証
            if (data.fiscalYearStart && data.fiscalYearEnd) {
                const startMonth = parseInt(data.fiscalYearStart, 10);
                const endMonth = parseInt(data.fiscalYearEnd, 10);
                return endMonth > startMonth;
            }
            return true;
        },
        {
            message: '年度終了月は開始月より後でなければなりません',
            path: ['fiscalYearEnd'],
        }
    );

// TypeScript型定義をエクスポート
export type CompanyFormData = z.infer<typeof companySchema>;

// デフォルト値もエクスポート
export const defaultCompanyFormValues: CompanyFormData = {
    companyName: '',
    companyNameKana: '',
    companyCode: '',
    contactPersonLastName: '',
    contactPersonFirstName: '',
    contactPersonLastNameKana: '',
    contactPersonFirstNameKana: '',
    phoneNumber: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    buildingName: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    loginEmail: '',
    password: '',
    appIntegration: 'no',
    safetyConfirmation: 'no',
    occupationalHealthIntegration: 'no',
    employeeChatDisplay: 'hide',
};
