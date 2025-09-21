# 企業登録仕様 (Company Registration Spec)

提供いただいた要件表をもとに、フロント/UI・検証・データ仕様を統一した仕様書です。BFF/Backend 連携時も本ドキュメントの API キー・型・制約を準拠対象とします。

## フィールド定義

| API キー                             | 型      | 項目名             | 必須 | 表示/UI                       | 説明                   | Validation                                               | 最大数 |
| ------------------------------------ | ------- | ------------------ | ---- | ----------------------------- | ---------------------- | -------------------------------------------------------- | ------ |
| companyName                          | String  | 企業名             | 必須 | テキストエリア                | 会社の正式名称         | カタカナ・漢字・ひらがなのみ/最大 255 文字               | 255    |
| companyNameKana                      | String  | 企業名（カナ）     | 必須 | テキストエリア                | 会社名のフリガナ       | カタカナのみ/最大 255 文字                               | 255    |
| companyCode                          | String  | 企業コード         | 必須 | テキストエリア                | 企業コード             | 半角英大文字・数字・ハイフン/最大 255 文字               | 255    |
| contactName                          | String  | 担当者名           | 必須 | 姓/名の分割テキスト           | 担当者の氏名           | カタカナ・漢字・ひらがな/最大 255 文字 ×2                | 255    |
| contactNameKana                      | String  | 担当者名（カナ）   | 必須 | セイ/メイの分割テキスト       | 担当者氏名のフリガナ   | カタカナ/最大 255 文字 ×2                                | 255    |
| phoneNumber                          | String  | 電話番号           | 任意 | テキストエリア                | 電話番号               | 数字のみ(ハイフン無し)                                   | 255    |
| postalCode                           | String  | 郵便番号           | 必須 | テキスト/入力後に住所自動入力 | 郵便番号               | 数字のみ(ハイフン無し)/入力後 API による住所補完         | -      |
| prefecture                           | String  | 都道府県           | 必須 | プルダウン                    | 都道府県名             | 選択式（形式チェックなし）                               | -      |
| city                                 | String  | 市区町村           | 必須 | テキストエリア                | 市区町村名             | 自動入力可                                               | -      |
| streetAddress                        | String  | 番地               | 必須 | テキストエリア                | 番地                   | 数字・全角ハイフン                                       | -      |
| addressLine                          | String  | 建物部屋番号       | 任意 | テキストエリア                | 建物名、部屋番号など   | カタカナ・漢字・ひらがな・大文字英・全角ハイフン         | -      |
| months                               | String  | 年度設定           | 必須 | プルダウン(開始 MM-終了 MM)   | 事業年度 (例: "02-03") | 終了月 > 開始月                                          | -      |
| ownerLoginEmail                      | String  | ログイン ID        | 必須 | テキストエリア                | ログイン用メール       | メール形式/最大 255 文字                                 | 255    |
| ownerLoginPassword                   | String  | パスワード         | 必須 | テキストエリア                | ログイン用パスワード   | 6-12 文字/英大小・数字各 1 種以上必須/半角のみ/記号任意/ | 12     |
| appIntegrationEnabled                | Boolean | アプリ連携         | 必須 | ラジオ(あり/なし)             | アプリ連携有無         | true/false                                               | -      |
| safetyConfirmationEnabled            | Boolean | 安否確認           | 必須 | ラジオ(あり/なし)             | 安否確認機能の利用有無 | アプリ連携が true の場合のみ表示                         | -      |
| occupationalDoctorIntegrationEnabled | Boolean | 産業医連携         | 必須 | ラジオ(あり/なし)             | 産業医連携の有無       | UI 上は選択肢提示可だが現在は "なし" 固定                | -      |
| employeeChatEnabled                  | Boolean | 従業員とのチャット | 必須 | ラジオ(表示/非表示)           | チャット利用有無       | アプリ連携が true の場合のみ表示                         | -      |

補足:

-   contactName, contactNameKana は UI では分割入力(姓/名, セイ/メイ)だが API では連結文字列にして送信するか、もしくは contactName: { last, first }, contactNameKana: { last, first } のオブジェクトで送る設計のいずれか。現状フロントは分割フィールドを保持しているため、BFF で API 仕様に整形する方針を推奨。
-   months は "MM-MM" 形式。例: 02-03。開始と終了の相関チェック必須。
-   住所の自動入力は郵便番号 →ZipCloud API を想定。

## フロントエンド実装マッピング (現在の実装差分メモ)

現状の `vite/src/schemas/companySchema.ts` および各フォームは以下のキーで保持:

-   companyName, companyNameKana, companyCode
-   contactPersonLastName/FirstName, contactPersonLastNameKana/FirstNameKana
-   phoneNumber, postalCode, prefecture, city, address(= streetAddress), buildingName(= addressLine)
-   補足: prefecture は UI 上は JIS コードの選択だが、フロントのバリデーションではコード形式の検証は行っていません
-   fiscalYearStart, fiscalYearEnd (→ months に変換必要)
-   loginEmail(= ownerLoginEmail), password(= ownerLoginPassword)
-   appIntegration ("yes"/"no") → appIntegrationEnabled(Boolean)へ変換
-   safetyConfirmation ("yes"/"no") → safetyConfirmationEnabled(Boolean)へ変換
-   occupationalHealthIntegration ("yes"/"no") → occupationalDoctorIntegrationEnabled(Boolean)へ変換(現状 UI は "no" 固定)
-   employeeChatDisplay ("show"/"hide") → employeeChatEnabled(Boolean)へ変換

変換例 (BFF での整形推奨):

```
months = `${pad2(fiscalYearStart)}-${pad2(fiscalYearEnd)}`
appIntegrationEnabled = appIntegration === 'yes'
safetyConfirmationEnabled = safetyConfirmation === 'yes'
occupationalDoctorIntegrationEnabled = occupationalHealthIntegration === 'yes'
employeeChatEnabled = employeeChatDisplay === 'show'
addressLine = buildingName
streetAddress = address
ownerLoginEmail = loginEmail
ownerLoginPassword = password
contactName = `${contactPersonLastName} ${contactPersonFirstName}`
contactNameKana = `${contactPersonLastNameKana} ${contactPersonFirstNameKana}`
```

## 入力チェック詳細

-   companyName: `/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]+$/u`、max 255
-   companyNameKana: `/^[\p{Script=Katakana}ー]+$/u`、max 255
-   companyCode: `/^[A-Z0-9-]+$/`、max 255
-   contactName(分割): 同上(各 255)
-   contactNameKana(分割): `/^[\p{Script=Katakana}ー]+$/u` (各 255)
-   phoneNumber: `/^[0-9]+$/` (任意)
-   postalCode: `/^[0-9]+$/`、ZipCloud で住所補完
-   prefecture: 必須（形式チェックなし。UI は JIS コード選択）
-   city: 文字列(自動補完可)
-   streetAddress: `/^[0-9―]+$/`
-   addressLine: `/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Zー]+$/u`
-   months: 開始<終了 (例: 02-03)
-   ownerLoginEmail: email 形式
-   ownerLoginPassword: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[!-~]{6,12}$/`

## 表示ルール

-   safetyConfirmationEnabled, employeeChatEnabled は UI 表示上は appIntegrationEnabled が true のときのみ想定。ただし現行フロントのスキーマでは両項目とも enum により常に選択必須。
-   occupationalDoctorIntegrationEnabled は現行フロントのスキーマでは「あり/なし」を許容（運用上は「なし」を推奨）。

##　 api に送る json
{
"companyName": "株式会社テスト",
"companyNameKana": "カブシキガイシャテスト",
"companyCode": "AB-12345",
"contactName": "山田 太郎",
"contactNameKana": "ヤマダ タロウ",
"phoneNumber": "09012345678",
"postalCode": "1000005",
"location": {
"prefecture": "東京都",
"city": "千代田区",
"streetAddress": "丸の内 1-1",
"addressLine": "パレスビル"
},
"months": "02-03",
"ownerLoginEmail": "taro.yamada@example.com",
"ownerLoginPassword": "Password123!",
"appIntegrationEnabled": true,
"safetyConfirmationEnabled": true,
"occupationalDoctorIntegrationEnabled": false,
"employeeChatEnabled": true,
}

## api endpoint

http://localhost:8000/company

## データフローの推奨 (フロント → BFF → FastAPI)

データフロー (フロント → BFF → FastAPI → MongoDB)

1. フロントエンド (React など)
   • 画面上の入力フォームで値を取得
   • 既存の分割/列挙値で submit
   • 必要に応じてクライアントサイドバリデーション（簡易チェック）を実行

2. BFF (GraphQL / Apollo Server など)
   • 受け取った入力値を 本仕様に沿う API 形式へ整形
   • Zod などでスキーマバリデーション
   • Keycloak からアクセストークンを取得
   • FastAPI 側 API へ認証付きリクエストを送信

3. FastAPI (バックエンド)
   • Pydantic モデルでリクエスト検証
   • DB 保存前のビジネスロジックを実施
   • 重複チェック
   • ユニーク制約
   • パスワード再利用制限 など
   • MongoDB へ保存
   • 成功/失敗レスポンスを返却

4. MongoDB (データ層)
   • 仕様通りにデータを永続化
