import axios from "@/lib/axios";

/* ================= TYPES ================= */

export interface Address {
  country: string;
  city: string;
  addressLine: string;
}

export interface AuthorizedSignatory {
  fullName: string;
  passportNumber: string;
  email: string;
  phone: string;
}

export interface Company {
  _id: string;
  companyName: string;
  category: string;
  crNumber: string;
  vatNumber: string;
  address: Address;
  authorizedSignatory: AuthorizedSignatory;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CompanyResponse {
  success: boolean;
  message?: string;
  company?: Company;
}

export interface CreateCompanyPayload {
  companyName: string;
  category: string;
  crNumber: string;
  vatNumber: string;
  address: Address;
  authorizedSignatory: AuthorizedSignatory;
}

export interface UpdateCompanyPayload {
  companyName?: string;
  category?: string;
  address?: Address;
  authorizedSignatory?: AuthorizedSignatory;
}

/* ================= API CALLS ================= */

/**
 * CREATE company profile
 * POST /company/create
 */
export const createCompanyProfile = async (
  payload: CreateCompanyPayload
): Promise<CompanyResponse> => {
  const { data } = await axios.post<CompanyResponse>("/company/create", payload);
  return data;
};

/**
 * GET company profile (client's own)
 * GET /company/getprofile
 */
export const getMyCompanyProfile = async (): Promise<CompanyResponse> => {
  const { data } = await axios.get<CompanyResponse>("/company/getprofile");
  return data;
};

/**
 * UPDATE company profile
 * PUT /company/editcompany
 */
export const updateMyCompanyProfile = async (
  payload: UpdateCompanyPayload
): Promise<CompanyResponse> => {
  const { data } = await axios.put<CompanyResponse>("/company/editcompany", payload);
  return data;
};

