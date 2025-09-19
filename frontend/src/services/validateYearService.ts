import type { UseFormReturn } from 'react-hook-form';
import type { CompanyFormData } from '@/schemas/companySchema';

/**
 * Validates that the fiscal year end month comes after the start month
 * @param form - React Hook Form instance
 * @returns boolean - true if valid, false if invalid
 */
export const validateFiscalYear = (
    form: UseFormReturn<CompanyFormData>
): boolean => {
    const startMonth = parseInt(form.getValues('fiscalYearStart') || '0');
    const endMonth = parseInt(form.getValues('fiscalYearEnd') || '0');

    if (startMonth && endMonth && endMonth <= startMonth) {
        form.setError('fiscalYearEnd', {
            type: 'manual',
            message: '終了月は開始月より後の月を選択してください',
        });
        return false;
    } else {
        form.clearErrors('fiscalYearEnd');
        return true;
    }
};
