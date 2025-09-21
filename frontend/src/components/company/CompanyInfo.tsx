import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { type CompanyFormData } from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';
import { BasicCompanyFields } from '@/components/company/companyInfo/BasicCompanyFields';
import { ContactPersonFields } from '@/components/company/companyInfo/ContactPersonFields';
import { PhoneFields } from '@/components/company/companyInfo/PhoneFields';
import { AddressFields } from '@/components/company/companyInfo/AddressFields';
import { FiscalYearFields } from '@/components/company/companyInfo/FiscalYearFields';

interface CompanyInfoProps {
    form: UseFormReturn<CompanyFormData>;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ form }) => {
    return (
        <div>
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    {COMPANY_LABEL.SECTIONS.COMPANY_INFO}
                </h2>
            </div>
            <BasicCompanyFields form={form} />
            <ContactPersonFields form={form} />
            <PhoneFields form={form} />
            <AddressFields form={form} />
            <FiscalYearFields form={form} />
        </div>
    );
};
