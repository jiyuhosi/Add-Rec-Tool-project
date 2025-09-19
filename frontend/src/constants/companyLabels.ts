// 企業登録フォームのラベル定義
export const COMPANY_LABEL = {
    // セクションタイトル
    SECTIONS: {
        COMPANY_INFO: '企業情報',
        OWNER_LOGIN_INFO: 'オーナーログイン情報',
        OPTION: 'オプション選択',
        OCCUPATIONAL_DOCTOR_INFO: '産業医情報',
        DOCTOR_LOGIN_INFO: 'ログイン情報（ドクター）',
        EMPLOYEE_CHAT_OPTIONS: '従業員チャットオプション',
    },

    // フィールドラベル
    FIELDS: {
        // 企業情報セクション
        COMPANY_NAME: '企業名',
        COMPANY_NAME_KANA: '企業名（カナ）',
        COMPANY_CODE: '企業コード',
        CONTACT_PERSON: '担当者名',
        CONTACT_PERSON_LAST_NAME: '担当者名（姓）',
        CONTACT_PERSON_FIRST_NAME: '担当者名（名）',
        CONTACT_PERSON_KANA: '担当者名（カナ）',
        CONTACT_PERSON_LAST_NAME_KANA: '担当者名（セイ）',
        CONTACT_PERSON_FIRST_NAME_KANA: '担当者名（メイ）',
        PHONE_NUMBER: '電話番号',
        POSTAL_CODE: '郵便番号',
        PREFECTURE: '都道府県',
        CITY: '市区町村',
        ADDRESS: '番地',
        BUILDING_NAME: '建物・部屋番号',
        FISCAL_YEAR: '年度設定',
        // オーナーログイン情報セクション
        LOGIN_EMAIL: 'ログインID（メールアドレス）',
        PASSWORD: 'パスワード',
        // オプション選択セクション
        APP_INTEGRATION: 'アプリ連携',
        SAFETY_CONFIRMATION: '安否確認',
        OCCUPATIONAL_HEALTH_INTEGRATION: '産業医連携',
        // 産業医情報セクション
        OCCUPATIONAL_DOCTOR_COUNT: '産業医人数',
        OCCUPATIONAL_DOCTOR_NAME: '産業医名',
        OCCUPATIONAL_DOCTOR_NAME_KANA: '産業医名（カナ）',
        OCCUPATIONAL_DOCTOR_PHONE: '電話番号',
        RESPONSIBLE_OFFICE: '担当事業所',
        OFFICE_CODE: '事業所コード',
        // ログイン情報（ドクター）セクション
        DOCTOR_LOGIN_EMAIL: 'ログインID（メールアドレス）',
        DOCTOR_PASSWORD: 'パスワード',
        // 従業員とのチャット オプション選択
        EMPLOYEE_CHAT_DISPLAY: '従業員とのチャット',
        OCCUPATIONAL_INFO: '産業医情報',
    },

    // ページタイトル
    PAGE_TITLE: '企業登録フォーム',

    // ボタンラベル
    BUTTONS: {
        AUTO_FILL_ADDRESS: '市区町村まで自動入力',
        SUBMIT: '送信する',
        SUBMITTING: '送信中...',
    },

    // プレースホルダー
    PLACEHOLDERS: {
        KATAKANA_KANJI_HIRAGANA: 'カタカナ、漢字、ひらがな',
        HALF_WIDTH_ENGLISH_NUMBERS_HYPHEN: '半角英語、大文字英、数字、ハイフン',
        CONTACT_PERSON_LAST_NAME: '姓',
        CONTACT_PERSON_FIRST_NAME: '名',
        CONTACT_PERSON_LAST_NAME_KANA: 'セイ',
        CONTACT_PERSON_FIRST_NAME_KANA: 'メイ',
        NUMBERS: '数字',
        AUTO_FILL: '自動入力',
        NUMBERS_FULL_WIDTH_HYPHEN: '数字、全角ハイフン',
        KATAKANA_KANJI_HIRAGANA_ENGLISH_HYPHEN:
            'カタカナ、漢字、ひらがな、大文字英、全角ハイフン',
        MONTH_FORMAT: 'MM月',
        EMAIL_FORMAT: 'メールアドレスで使える記号と半角英数字',
        PASSWORD_REQUIREMENTS: '8文字以上、大文字・小文字・数字を含む',
        KATAKANA_ENGLISH_HYPHEN: 'カタカナ、大文字英、全角ハイフン',
        MULTIPLE_SELECTION: 'プルダウン＞チェックボックスで複数選択',
        MULTIPLE_INPUT: '複数入力、入力ボックス複数追加可能',
        DROPDOWN: 'プルダウン',
        COUNT_BASED_DISPLAY: '選択人数に合わせて複数表示',
        VALIDATION_CONTENT: 'バリデーション内容聞く',
    },

    // 選択肢
    OPTIONS: {
        YES: 'あり',
        NO: 'なし',
        SHOW: '表示',
        HIDE: '非表示',
        DOCTOR_COUNT: Array.from({ length: 20 }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1}人`,
        })),
        RESPONSIBLE_OFFICES: [
            { value: 'office1', label: '事業所1' },
            { value: 'office2', label: '事業所2' },
            { value: 'office3', label: '事業所3' },
        ],
    },
} as const;
