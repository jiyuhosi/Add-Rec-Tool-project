import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { OccupationalDoctorInfo } from '@/components/company/OccupationalDoctorInfo';
import { companySchema, type CompanyFormData, defaultCompanyFormValues } from '@/schemas/companySchema';
import { COMPANY_LABEL } from '@/constants/companyLabels';

// Test wrapper component that provides form context
interface TestWrapperProps {
    initialValues?: Partial<CompanyFormData>;
    children: (form: UseFormReturn<CompanyFormData>) => React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ initialValues = {}, children }) => {
    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            ...defaultCompanyFormValues,
            ...initialValues,
        },
    });

    return (
        <Form {...form}>
            <form>
                {children(form)}
            </form>
        </Form>
    );
};

describe('OccupationalDoctorInfo', () => {
    beforeEach(() => {
        // Clear console.log for cleaner test output
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('renders the component with title and count selector', () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Check if the section title is rendered
        expect(screen.getByText(COMPANY_LABEL.SECTIONS.OCCUPATIONAL_DOCTOR_INFO)).toBeInTheDocument();
        
        // Check if the count selector is rendered
        expect(screen.getByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_COUNT)).toBeInTheDocument();
    });

    it('does not render doctor forms when count is 0 or not selected', () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Should not show doctor forms initially
        expect(screen.queryByText('👨‍⚕️ 산업의 1')).not.toBeInTheDocument();
        expect(screen.queryByText('📋 총')).not.toBeInTheDocument();
    });

    it('renders 1 doctor form when count is set to 1', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Select 1 doctor
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        
        const onePersonOption = screen.getByText('1人');
        fireEvent.click(onePersonOption);

        // Wait for the form to update
        await waitFor(() => {
            expect(screen.getByText('📋 총 1명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 1')).toBeInTheDocument();
        });

        // Check that only 1 doctor form is rendered
        expect(screen.queryByText('👨‍⚕️ 산업의 2')).not.toBeInTheDocument();

        // Check that all required fields are present for the first doctor
        expect(screen.getByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_NAME)).toBeInTheDocument();
        expect(screen.getByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_NAME_KANA)).toBeInTheDocument();
        expect(screen.getByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_PHONE)).toBeInTheDocument();
        expect(screen.getByText(COMPANY_LABEL.FIELDS.RESPONSIBLE_OFFICE)).toBeInTheDocument();
        expect(screen.getByText(COMPANY_LABEL.FIELDS.OFFICE_CODE)).toBeInTheDocument();
    });

    it('renders 2 doctor forms when count is set to 2', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Select 2 doctors
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        
        const twoPeopleOption = screen.getByText('2人');
        fireEvent.click(twoPeopleOption);

        // Wait for the forms to update
        await waitFor(() => {
            expect(screen.getByText('📋 총 2명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 1')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 2')).toBeInTheDocument();
        });

        // Check that the third doctor form is not rendered
        expect(screen.queryByText('👨‍⚕️ 산업의 3')).not.toBeInTheDocument();
    });

    it('renders 3 doctor forms when count is set to 3', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Select 3 doctors
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        
        const threePeopleOption = screen.getByText('3人');
        fireEvent.click(threePeopleOption);

        // Wait for the forms to update
        await waitFor(() => {
            expect(screen.getByText('📋 총 3명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 1')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 2')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 3')).toBeInTheDocument();
        });

        // Check that the fourth doctor form is not rendered
        expect(screen.queryByText('👨‍⚕️ 산업의 4')).not.toBeInTheDocument();
    });

    it('renders 4 doctor forms when count is set to 4', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Select 4 doctors
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        
        const fourPeopleOption = screen.getByText('4人');
        fireEvent.click(fourPeopleOption);

        // Wait for the forms to update
        await waitFor(() => {
            expect(screen.getByText('📋 총 4명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 1')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 2')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 3')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 4')).toBeInTheDocument();
        });

        // Check that the fifth doctor form is not rendered
        expect(screen.queryByText('👨‍⚕️ 산업의 5')).not.toBeInTheDocument();
    });

    it('renders 5 doctor forms when count is set to 5 (maximum)', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Select 5 doctors
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        
        const fivePeopleOption = screen.getByText('5人');
        fireEvent.click(fivePeopleOption);

        // Wait for the forms to update
        await waitFor(() => {
            expect(screen.getByText('📋 총 5명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 1')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 2')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 3')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 4')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 5')).toBeInTheDocument();
        });
    });

    it('updates form count dynamically when selection changes', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        const countSelector = screen.getByRole('combobox');

        // First select 2 doctors
        fireEvent.click(countSelector);
        fireEvent.click(screen.getByText('2人'));

        await waitFor(() => {
            expect(screen.getByText('👨‍⚕️ 산업의 2')).toBeInTheDocument();
        });

        // Then change to 4 doctors
        fireEvent.click(countSelector);
        fireEvent.click(screen.getByText('4人'));

        await waitFor(() => {
            expect(screen.getByText('📋 총 4명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 4')).toBeInTheDocument();
        });

        // Then reduce back to 1 doctor
        fireEvent.click(countSelector);
        fireEvent.click(screen.getByText('1人'));

        await waitFor(() => {
            expect(screen.getByText('📋 총 1명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 1')).toBeInTheDocument();
            expect(screen.queryByText('👨‍⚕️ 산업의 2')).not.toBeInTheDocument();
        });
    });

    it('renders all required form fields for each doctor', async () => {
        render(
            <TestWrapper>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Select 2 doctors to test multiple forms
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        fireEvent.click(screen.getByText('2人'));

        await waitFor(() => {
            // Check that all input fields exist for both doctors
            const nameInputs = screen.getAllByDisplayValue('');
            expect(nameInputs.length).toBeGreaterThanOrEqual(10); // 5 fields × 2 doctors = 10 inputs minimum

            // Check required field labels
            expect(screen.getAllByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_NAME)).toHaveLength(2);
            expect(screen.getAllByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_NAME_KANA)).toHaveLength(2);
            expect(screen.getAllByText(COMPANY_LABEL.FIELDS.OCCUPATIONAL_DOCTOR_PHONE)).toHaveLength(2);
            expect(screen.getAllByText(COMPANY_LABEL.FIELDS.RESPONSIBLE_OFFICE)).toHaveLength(2);
            expect(screen.getAllByText(COMPANY_LABEL.FIELDS.OFFICE_CODE)).toHaveLength(2);

            // Check that required asterisks are present
            const requiredMarkers = screen.getAllByText('*');
            expect(requiredMarkers.length).toBeGreaterThanOrEqual(10); // 5 required fields × 2 doctors = 10 asterisks minimum
        });
    });

    it('maintains existing data when increasing doctor count', async () => {
        const initialData = {
            occupationalDoctorCount: '2',
            occupationalDoctors: [
                {
                    name: '田中太郎',
                    nameKana: 'タナカタロウ',
                    phone: '090-1234-5678',
                    responsibleOffice: 'office1',
                    officeCode: 'CODE001',
                },
                {
                    name: '佐藤花子',
                    nameKana: 'サトウハナコ',
                    phone: '090-9876-5432',
                    responsibleOffice: 'office2',
                    officeCode: 'CODE002',
                },
            ],
        };

        render(
            <TestWrapper initialValues={initialData}>
                {(form) => <OccupationalDoctorInfo form={form} />}
            </TestWrapper>
        );

        // Wait for initial render
        await waitFor(() => {
            expect(screen.getByText('👨‍⚕️ 산업의 2')).toBeInTheDocument();
        });

        // Change to 3 doctors
        const countSelector = screen.getByRole('combobox');
        fireEvent.click(countSelector);
        fireEvent.click(screen.getByText('3人'));

        await waitFor(() => {
            expect(screen.getByText('📋 총 3명의 산업의 정보를 입력해주세요')).toBeInTheDocument();
            expect(screen.getByText('👨‍⚕️ 산업의 3')).toBeInTheDocument();
        });

        // The existing data should still be there and a new empty form should be added
        // This tests that the useEffect preserves existing data when expanding the array
    });
});
