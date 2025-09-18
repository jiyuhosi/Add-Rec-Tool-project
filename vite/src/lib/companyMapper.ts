import type { CompanyFormData } from '@/schemas/companySchema';
import { getPrefectureNameByCode } from '@/constants/prefectures';

type MapperOptions = {
    /**
     * 住所の出力形式
     * - 'location': { location: { prefecture, city, streetAddress, addressLine } } (SPEC の API サンプル準拠)
     * - 'flat'    : { prefecture, city, streetAddress, addressLine }
     */
    addressMode?: 'location' | 'flat';
    /**
     * 事業年度のキー名
     * - 'months'             : months: "MM-MM"（仕様のフィールド定義）
     * - 'fiscalYearEndMonth' : fiscalYearEndMonth: "MM-MM"（SPEC の API サンプル例）
     */
    fiscalKey?: 'months' | 'fiscalYearEndMonth';
};

const pad2 = (v: string | number) => String(v).padStart(2, '0');

/**
 * 事業年度 (開始月-終了月) を "MM-MM" 形式で生成
 * バリデーション: 数値であること / 終了月 > 開始月（SPEC: 終了月 > 開始月）
 */
const buildMonths = (start: string | number, end: string | number) => {
    const s = Number(start);
    const e = Number(end);
    if (Number.isNaN(s) || Number.isNaN(e))
        throw new Error('Invalid fiscal months');
    if (e <= s) throw new Error('Fiscal year end must be greater than start');
    return `${pad2(s)}-${pad2(e)}`;
};

export function toApiCompanyPayload(
    form: CompanyFormData,
    opts: MapperOptions = {
        addressMode: 'location',
        fiscalKey: 'fiscalYearEndMonth',
    }
) {
    // 年度: フロントの fiscalYearStart/fiscalYearEnd → "MM-MM" に整形（例: 02-03）
    const months = buildMonths(form.fiscalYearStart, form.fiscalYearEnd);

    // アプリ連携等の列挙値を Boolean へ変換（SPEC: yes/no, show/hide → true/false）
    // 表示ルール: appIntegrationEnabled が true のときのみ safety/employeeChat を有効
    const appIntegrationEnabled = form.appIntegration === 'yes';
    const safetyConfirmationEnabled =
        appIntegrationEnabled && form.safetyConfirmation === 'yes';
    // 産業医連携: 現状は仕様上 "なし" 固定
    const occupationalDoctorIntegrationEnabled = false;
    const employeeChatEnabled =
        appIntegrationEnabled && form.employeeChatDisplay === 'show';

    // 都道府県: JIS コード(01-47) → 名称へ変換できる場合は名称を採用（SPEC 準拠）
    const prefectureName =
        getPrefectureNameByCode(form.prefecture) ?? form.prefecture;

    const base = {
        // 企業名（カタカナ・漢字・ひらがなのみ/最大255）
        companyName: form.companyName,
        // 企業名（カナ）（カタカナのみ/最大255）
        companyNameKana: form.companyNameKana,
        // 企業コード（半角英大文字・数字・ハイフン/最大255）
        companyCode: form.companyCode,
        // 担当者名：姓/名 を連結して API へ（各 最大255）
        contactName:
            `${form.contactPersonLastName} ${form.contactPersonFirstName}`.trim(),
        // 担当者名（カナ）：セイ/メイ を連結（カタカナ/各 最大255）
        contactNameKana:
            `${form.contactPersonLastNameKana} ${form.contactPersonFirstNameKana}`.trim(),
        // 電話番号（数字のみ推奨）
        phoneNumber: form.phoneNumber,
        // 郵便番号（数字のみ/ZipCloud で住所補完）
        postalCode: form.postalCode,
        // ログイン ID（メール形式/最大255）
        ownerLoginEmail: form.loginEmail,
        // パスワード（6-12 文字/英大小・数字を各1種以上/半角のみ/記号任意）
        ownerLoginPassword: form.password,
        // アプリ連携（必須/true|false）
        appIntegrationEnabled,
        // 安否確認（appIntegrationEnabled=true のときのみ有効/true|false）
        safetyConfirmationEnabled,
        // 産業医連携（現状は "なし" 固定だが将来拡張可/true|false）
        occupationalDoctorIntegrationEnabled,
        // 従業員とのチャット（appIntegrationEnabled=true のときのみ有効/true|false）
        employeeChatEnabled,
    } as const;

    const addressFlat = {
        // 都道府県名（JIS コードから名称へ変換済み）
        prefecture: prefectureName,
        // 市区町村（自動補完可/最大255）
        city: form.city,
        // 番地（数字・全角ハイフン/最大255）
        streetAddress: form.address,
        // 建物部屋番号（カタカナ・漢字・ひらがな・大文字英・全角ハイフン/最大255）
        addressLine: form.buildingName ?? '',
    } as const;

    // 事業年度キー名の選択（months もしくは fiscalYearEndMonth）。値は "MM-MM"
    const fiscal =
        opts.fiscalKey === 'months'
            ? { months }
            : { fiscalYearEndMonth: months };

    // 住所形式の選択（フラット or location ネスト）
    const withAddress =
        opts.addressMode === 'flat'
            ? { ...addressFlat }
            : { location: addressFlat };

    return { ...base, ...withAddress, ...fiscal };
}

export type ApiCompanyPayload = ReturnType<typeof toApiCompanyPayload>;
