import axios from 'axios';
import type { UseFormReturn } from 'react-hook-form';
import type { CompanyFormData } from '@/schemas/companySchema';

interface AddressData {
    status: number;
    results?: Array<{
        prefcode: string;
        address2: string;
        address3: string;
    }>;
}

/**
 * Auto-fill address fields based on postal code using zipcloud API
 * @param form - React Hook Form instance
 * @param postalCode - Postal code to search for
 */
export const autoFillAddress = async (
    form: UseFormReturn<CompanyFormData>,
    postalCode?: string
): Promise<void> => {
    const code = postalCode || form.getValues('postalCode');

    if (!code) {
        form.setError('postalCode', {
            type: 'manual',
            message: '郵便番号を入力してください',
        });
        return;
    }

    try {
        // Use zipcloud API to fetch address data
        const response = await axios.get<AddressData>(
            `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`
        );
        const data = response.data;

        if (data.status === 200 && data.results && data.results.length > 0) {
            const addressData = data.results[0];
            form.setValue('prefecture', addressData.prefcode); // e.g., "13" for Tokyo
            form.setValue(
                'city',
                `${addressData.address2} ${addressData.address3}`
            ); // City (e.g., 港区)

            form.clearErrors('postalCode');
        } else {
            form.setError('postalCode', {
                type: 'manual',
                message: '有効な郵便番号を入力してください',
            });
        }
    } catch {
        form.setError('postalCode', {
            type: 'manual',
            message: '住所の取得に失敗しました',
        });
    }
};
