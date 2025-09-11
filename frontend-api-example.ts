/**
 * 회사 API 연동 예제
 * React/TypeScript에서 사용할 수 있는 API 클라이언트
 */

// API 베이스 URL
const API_BASE_URL = 'http://localhost:8000';

// 회사 데이터 타입 정의
interface RoomLocation {
    building: string;
    roomNo: string;
}

interface Location {
    postalCode: string;
    prefecture: string;
    address: string;
    roomLocation: RoomLocation;
}

interface TelephoneNo {
    number: string;
    type: 'MOBILE' | 'HOME' | 'WORK';
    isPrimary: boolean;
}

interface DisplayNameMap {
    en: string;
    ja: string;
}

interface CompanyInput {
    code: string;
    location: Location[];
    telephoneNo: TelephoneNo[];
    contactPersonFamilyName: string;
    contactPersonMail: string;
    mainHrAdmin: string;
    medicalCheckupStartDate: string;
    medicalCheckupEndDate: string;
    offices: string[];
    departments: string[];
    displayNameMap: DisplayNameMap;
    designations: string[];
    status: 'ACTIVE' | 'INACTIVE';
}

interface CompanyRequest {
    companyInputs: CompanyInput[];
}

interface CompanyResponse {
    id: string;
    code: string;
    status: string;
    message: string;
}

// API 클라이언트 클래스
class CompanyApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * 여러 회사 추가
     */
    async addCompanies(
        companyRequest: CompanyRequest
    ): Promise<CompanyResponse[]> {
        const response = await fetch(`${this.baseUrl}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyRequest),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 단일 회사 추가
     */
    async addSingleCompany(
        companyInput: CompanyInput
    ): Promise<CompanyResponse> {
        const response = await fetch(`${this.baseUrl}/companies/single`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyInput),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 모든 회사 조회
     */
    async getCompanies(): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/companies`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.companies;
    }

    /**
     * 특정 회사 조회
     */
    async getCompanyByCode(code: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/companies/${code}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 회사 정보 업데이트
     */
    async updateCompany(
        code: string,
        companyInput: Partial<CompanyInput>
    ): Promise<CompanyResponse> {
        const response = await fetch(`${this.baseUrl}/companies/${code}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyInput),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 회사 삭제
     */
    async deleteCompany(code: string): Promise<CompanyResponse> {
        const response = await fetch(`${this.baseUrl}/companies/${code}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

// 사용 예제
export const companyApiClient = new CompanyApiClient();

// React 컴포넌트에서 사용하는 예제
export const useCompanyApi = () => {
    const addCompany = async (companyData: CompanyInput) => {
        try {
            const result = await companyApiClient.addSingleCompany(companyData);
            console.log('회사 추가 성공:', result);
            return result;
        } catch (error) {
            console.error('회사 추가 실패:', error);
            throw error;
        }
    };

    const getCompanies = async () => {
        try {
            const companies = await companyApiClient.getCompanies();
            console.log('회사 목록:', companies);
            return companies;
        } catch (error) {
            console.error('회사 목록 조회 실패:', error);
            throw error;
        }
    };

    return {
        addCompany,
        getCompanies,
    };
};

// 폼 데이터 예제
export const sampleCompanyData: CompanyInput = {
    code: 'SAMPLE_COMPANY_001',
    location: [
        {
            postalCode: '123-4567',
            prefecture: '東京都',
            address: '渋谷区渋谷1-1-1',
            roomLocation: {
                building: 'サンプルビル',
                roomNo: '101',
            },
        },
    ],
    telephoneNo: [
        {
            number: '03-1234-5678',
            type: 'WORK',
            isPrimary: true,
        },
    ],
    contactPersonFamilyName: '田中',
    contactPersonMail: 'tanaka@sample.com',
    mainHrAdmin: '佐藤',
    medicalCheckupStartDate: '2024-04-01',
    medicalCheckupEndDate: '2024-09-30',
    offices: [],
    departments: [],
    displayNameMap: {
        en: 'Sample Company Ltd.',
        ja: 'サンプル会社株式会社',
    },
    designations: [],
    status: 'ACTIVE',
};

export default CompanyApiClient;
