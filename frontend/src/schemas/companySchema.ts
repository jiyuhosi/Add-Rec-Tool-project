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
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        companyNameKana: z
            .string()
            .trim()
            .min(1, '企業名（カナ）は必須です')
            .regex(/^[\p{Script=Katakana}ー]+$/u, 'カタカナで入力してください'),
        companyCode: z
            .string()
            .trim()
            .min(1, '企業コードは必須です')
            .regex(
                /^[A-Z0-9-]+$/,
                '大文字英字、数字、ハイフンで入力してください'
            ),
        contactPersonLastName: z
            .string()
            .trim()
            .min(1, '担当者名（姓）は必須です')
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        contactPersonFirstName: z
            .string()
            .trim()
            .min(1, '担当者名（名）は必須です')
            .regex(
                /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u,
                'カタカナ、漢字、ひらがなで入力してください'
            ),
        contactPersonLastNameKana: z
            .string()
            .trim()
            .min(1, '担当者名（セイ）は必須です')
            .regex(/^[\p{Script=Katakana}ー]+$/u, 'カタカナで入力してください'),
        contactPersonFirstNameKana: z
            .string()
            .trim()
            .min(1, '担当者名（メイ）は必須です')
            .regex(/^[\p{Script=Katakana}ー]+$/u, 'カタカナで入力してください'),
        phoneNumber: z
            .string()
            .trim()
            .min(1, '電話番号は必須です')
            .regex(/^[0-9]+$/, '数字のみで入力してください'),
        postalCode: z
            .string()
            .trim()
            .min(1, '郵便番号は必須です')
            .regex(/^[0-9]+$/, '数字のみで入力してください'),
        prefecture: z.string().trim().min(1, '都道府県は必須です'),
        city: z.string().trim().min(1, '市区町村は必須です'),
        address: z
            .string()
            .trim()
            .min(1, '番地は必須です')
            .regex(/^[0-9―]+$/, '数字、全角ハイフン（―）で入力してください'),
        buildingName: z
            .string()
            .optional()
            .refine(
                val =>
                    !val ||
                    /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Zー]+$/u.test(
                        val
                    ),
                'カタカナ、漢字、ひらがな、大文字英字、ハイフンで入力してください'
            ),
        fiscalYearStart: z.string().trim().min(1, '年度開始月は必須です'),
        fiscalYearEnd: z.string().trim().min(1, '年度終了月は必須です'),

        // オーナーログイン情報
        loginEmail: z
            .string()
            .trim()
            .min(1, 'ログインIDは必須です')
            .email('有効なメールアドレスを入力してください'),
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
        occupationalHealthIntegration: z.enum(['yes', 'no'], {
            required_error: '産業医連携を選択してください',
        }),

        // 産業医情報（現在は未使用のため削除）

        // オプション選択（ドクター）
        employeeChatDisplay: z.enum(['show', 'hide'], {
            required_error: '従業員とのチャット表示設定は必須です',
        }),
    })
    .refine(
        data => {
            // アプリ連携ありの場合、安否確認は必須
            if (data.appIntegration === 'yes' && !data.employeeChatDisplay) {
                return false;
            }
            return true;
        },
        {
            message: 'アプリ連携選択した場合、安否確認は必須です',
            path: ['safetyConfirmation'],
        }
    )
    .refine(
        data => {
            // アプリ連携ありかつ産業医連携ありの場合、従業員とのチャット設定は必須
            if (data.appIntegration === 'yes' && !data.employeeChatDisplay) {
                return false;
            }
            return true;
        },
        {
            message:
                'アプリ連携選択した場合、従業員とのチャット表示設定は必須です',
            path: ['employeeChatDisplay'],
        }
    )
    // 産業医情報の検証は現在未使用
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
