import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyPage from '@/pages/Company';

// Mock apollo useMutation from the specific path used in the code
vi.mock('@apollo/client/react', () => ({
    useMutation: vi.fn(),
}));

// Bypass zod validation to focus on onSubmit mapping/behavior
vi.mock('@hookform/resolvers/zod', () => ({
    zodResolver: () => async (values: any) => ({ values, errors: {} }),
}));

// Mock the GraphQL document export (we only need the type)
vi.mock('@/services/company/createCompany.gql', () => ({
    CREATE_COMPANY: {},
}));

// Mock the form child components to simplify DOM and avoid filling full form
vi.mock('@/components/company', () => ({
    CompanyInfo: ({ form }: any) => (
        <div>
            <label>
                Company Name
                <input
                    name="companyName"
                    data-testid="companyName"
                    onChange={e => form.setValue('companyName', e.target.value)}
                />
            </label>
            <label>
                Company Name Kana
                <input
                    name="companyNameKana"
                    data-testid="companyNameKana"
                    onChange={e =>
                        form.setValue('companyNameKana', e.target.value)
                    }
                />
            </label>
            <label>
                Company Code
                <input
                    name="companyCode"
                    data-testid="companyCode"
                    onChange={e => form.setValue('companyCode', e.target.value)}
                />
            </label>
            <label>
                Last Name
                <input
                    name="contactPersonLastName"
                    data-testid="lastName"
                    onChange={e =>
                        form.setValue('contactPersonLastName', e.target.value)
                    }
                />
            </label>
            <label>
                First Name
                <input
                    name="contactPersonFirstName"
                    data-testid="firstName"
                    onChange={e =>
                        form.setValue('contactPersonFirstName', e.target.value)
                    }
                />
            </label>
            <label>
                Last Name Kana
                <input
                    name="contactPersonLastNameKana"
                    data-testid="lastNameKana"
                    onChange={e =>
                        form.setValue(
                            'contactPersonLastNameKana',
                            e.target.value
                        )
                    }
                />
            </label>
            <label>
                First Name Kana
                <input
                    name="contactPersonFirstNameKana"
                    data-testid="firstNameKana"
                    onChange={e =>
                        form.setValue(
                            'contactPersonFirstNameKana',
                            e.target.value
                        )
                    }
                />
            </label>
            <label>
                Phone
                <input
                    name="phoneNumber"
                    data-testid="phoneNumber"
                    onChange={e => form.setValue('phoneNumber', e.target.value)}
                />
            </label>
            <label>
                Postal
                <input
                    name="postalCode"
                    data-testid="postalCode"
                    onChange={e => form.setValue('postalCode', e.target.value)}
                />
            </label>
            <label>
                Prefecture
                <input
                    name="prefecture"
                    data-testid="prefecture"
                    onChange={e => form.setValue('prefecture', e.target.value)}
                />
            </label>
            <label>
                City
                <input
                    name="city"
                    data-testid="city"
                    onChange={e => form.setValue('city', e.target.value)}
                />
            </label>
            <label>
                Address
                <input
                    name="address"
                    data-testid="address"
                    onChange={e => form.setValue('address', e.target.value)}
                />
            </label>
            <label>
                Building
                <input
                    name="buildingName"
                    data-testid="buildingName"
                    onChange={e =>
                        form.setValue('buildingName', e.target.value)
                    }
                />
            </label>
            <label>
                FY Start
                <input
                    name="fiscalYearStart"
                    data-testid="fiscalYearStart"
                    onChange={e =>
                        form.setValue('fiscalYearStart', e.target.value)
                    }
                />
            </label>
            <label>
                FY End
                <input
                    name="fiscalYearEnd"
                    data-testid="fiscalYearEnd"
                    onChange={e =>
                        form.setValue('fiscalYearEnd', e.target.value)
                    }
                />
            </label>
        </div>
    ),
    OwnerLoginInfo: ({ form }: any) => (
        <div>
            <label>
                Email
                <input
                    name="loginEmail"
                    data-testid="loginEmail"
                    onChange={e => form.setValue('loginEmail', e.target.value)}
                />
            </label>
            <label>
                Password
                <input
                    name="password"
                    data-testid="password"
                    onChange={e => form.setValue('password', e.target.value)}
                />
            </label>
        </div>
    ),
    Option: ({ form }: any) => (
        <div>
            <label>
                App Integration Yes
                <input
                    type="radio"
                    name="appIntegration"
                    value="yes"
                    data-testid="appIntegrationYes"
                    onChange={() => form.setValue('appIntegration', 'yes')}
                />
            </label>
            <label>
                App Integration No
                <input
                    type="radio"
                    name="appIntegration"
                    value="no"
                    data-testid="appIntegrationNo"
                    onChange={() => form.setValue('appIntegration', 'no')}
                />
            </label>

            <label>
                Safety Yes
                <input
                    type="radio"
                    name="safetyConfirmation"
                    value="yes"
                    data-testid="safetyYes"
                    onChange={() => form.setValue('safetyConfirmation', 'yes')}
                />
            </label>
            <label>
                Safety No
                <input
                    type="radio"
                    name="safetyConfirmation"
                    value="no"
                    data-testid="safetyNo"
                    onChange={() => form.setValue('safetyConfirmation', 'no')}
                />
            </label>

            <label>
                OH Yes
                <input
                    type="radio"
                    name="occupationalHealthIntegration"
                    value="yes"
                    data-testid="ohYes"
                    onChange={() =>
                        form.setValue('occupationalHealthIntegration', 'yes')
                    }
                />
            </label>
            <label>
                OH No
                <input
                    type="radio"
                    name="occupationalHealthIntegration"
                    value="no"
                    data-testid="ohNo"
                    onChange={() =>
                        form.setValue('occupationalHealthIntegration', 'no')
                    }
                />
            </label>
        </div>
    ),
    employeeChatOptions: ({ form }: any) => (
        <div>
            <label>
                Chat Show
                <input
                    type="radio"
                    name="employeeChatDisplay"
                    value="show"
                    data-testid="chatShow"
                    onChange={() =>
                        form.setValue('employeeChatDisplay', 'show')
                    }
                />
            </label>
            <label>
                Chat Hide
                <input
                    type="radio"
                    name="employeeChatDisplay"
                    value="hide"
                    data-testid="chatHide"
                    onChange={() =>
                        form.setValue('employeeChatDisplay', 'hide')
                    }
                />
            </label>
        </div>
    ),
}));

// Spy on alert
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Pull in the mocked useMutation for configuring resolves per-test
import { useMutation } from '@apollo/client/react';

const fillHappyPath = () => {
    fireEvent.change(screen.getByTestId('companyName'), {
        target: { value: '株式会社テスト' },
    });
    fireEvent.change(screen.getByTestId('companyNameKana'), {
        target: { value: 'カブシキガイシャテスト' },
    });
    fireEvent.change(screen.getByTestId('companyCode'), {
        target: { value: 'ABC-123' },
    });
    fireEvent.change(screen.getByTestId('lastName'), {
        target: { value: '山田' },
    });
    fireEvent.change(screen.getByTestId('firstName'), {
        target: { value: '太郎' },
    });
    fireEvent.change(screen.getByTestId('lastNameKana'), {
        target: { value: 'ヤマダ' },
    });
    fireEvent.change(screen.getByTestId('firstNameKana'), {
        target: { value: 'タロウ' },
    });
    fireEvent.change(screen.getByTestId('phoneNumber'), {
        target: { value: '0312345678' },
    });
    fireEvent.change(screen.getByTestId('postalCode'), {
        target: { value: '1000001' },
    });
    fireEvent.change(screen.getByTestId('prefecture'), {
        target: { value: '東京都' },
    });
    fireEvent.change(screen.getByTestId('city'), {
        target: { value: '千代田区' },
    });
    fireEvent.change(screen.getByTestId('address'), {
        target: { value: '1―1' },
    });
    fireEvent.change(screen.getByTestId('buildingName'), {
        target: { value: 'ABCビル' },
    });
    fireEvent.change(screen.getByTestId('fiscalYearStart'), {
        target: { value: '2' },
    });
    fireEvent.change(screen.getByTestId('fiscalYearEnd'), {
        target: { value: '3' },
    });
    fireEvent.change(screen.getByTestId('loginEmail'), {
        target: { value: 'owner@example.com' },
    });
    fireEvent.change(screen.getByTestId('password'), {
        target: { value: 'Aa1234' },
    });
    fireEvent.click(screen.getByTestId('appIntegrationYes'));
    fireEvent.click(screen.getByTestId('safetyYes'));
    // EmployeeChatOptions rendered when appIntegration === 'yes'
    fireEvent.click(screen.getByTestId('chatShow'));
};

describe('CompanyPage submit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('maps form values and calls createCompany, then alerts and resets on success', async () => {
        const mutateFn = vi.fn().mockResolvedValue({
            data: {
                createCompany: {
                    id: '1',
                    companyCode: 'ABC-123',
                },
            },
        });
        (useMutation as unknown as Mock).mockReturnValue([
            mutateFn,
            { loading: false },
        ]);

        render(<CompanyPage />);

        fillHappyPath();

        fireEvent.click(screen.getByRole('button', { name: /送信/ }));

        await waitFor(() => {
            expect(mutateFn).toHaveBeenCalledTimes(1);
        });

        const variables = (mutateFn.mock.calls[0]?.[0] as any).variables;
        expect(variables).toBeTruthy();
        expect(variables.input).toMatchObject({
            companyName: '株式会社テスト',
            companyNameKana: 'カブシキガイシャテスト',
            companyCode: 'ABC-123',
            contactName: '山田太郎',
            contactNameKana: 'ヤマダタロウ',
            phoneNumber: '0312345678',
            postalCode: '1000001',
            location: {
                prefecture: '東京都',
                city: '千代田区',
                streetAddress: '1―1',
                addressLine: 'ABCビル',
            },
            months: '02-03',
            ownerLoginEmail: 'owner@example.com',
            ownerLoginPassword: 'Aa1234',
            appIntegrationEnabled: true,
            safetyConfirmationEnabled: true,
            occupationalDoctorIntegrationEnabled: false,
            employeeChatEnabled: true,
        });

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                '企業情報が正常に登録されました'
            );
        });
    });

    it('shows error alert if mutation throws', async () => {
        const mutateFn = vi.fn().mockRejectedValue(new Error('boom'));
        (useMutation as unknown as Mock).mockReturnValue([
            mutateFn,
            { loading: false },
        ]);

        render(<CompanyPage />);

        fillHappyPath();

        fireEvent.click(screen.getByRole('button', { name: /送信/ }));

        await waitFor(() => {
            // No success alert
            expect(alertSpy).not.toHaveBeenCalled();
            // Error is logged to console
            expect(consoleErrorSpy).toHaveBeenCalled();
            const call = (consoleErrorSpy.mock.calls[0] || [])[1] as string;
            expect(String(call)).toContain('boom');
        });
    });

    it('alerts when company code is duplicated', async () => {
        const err = new Error('Company code already exists');
        (err as any).graphQLErrors = [
            { message: 'Company code already exists' },
        ];
        const mutateFn = vi.fn().mockRejectedValue(err);
        (useMutation as unknown as Mock).mockReturnValue([
            mutateFn,
            { loading: false },
        ]);

        render(<CompanyPage />);

        fillHappyPath();

        fireEvent.click(screen.getByRole('button', { name: /送信/ }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('企業コードは既に存在します');
        });
    });
});
