import axios from "@/lib/axios";

export interface AdminKYCDocument {
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | "underReview";
  rejectionReason?: string;
  viewedAt?: string;
  viewedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AdminKYCData {
  _id: string;
  company: {
    _id: string;
    companyName: string;
    category: string;
    crNumber: string; 
    vatNumber: string; 
    address: {
      country: string;
      city: string;
      addressLine: string;
    };
    authorizedSignatory: {
      fullName: string;
      passportNumber: string;
      email: string;
      phone: string;
    };
    user: {
      _id: string;
      fullname: string;
      email: string;
    };
  };
  documents: {
    crLicense?: AdminKYCDocument;
    vatCertificate?: AdminKYCDocument;
    signatoryId?: AdminKYCDocument;
    bankLetter?: AdminKYCDocument;
    proofOfAddress?: AdminKYCDocument;
    sourceOfFunds?: AdminKYCDocument;
  };
  overallStatus: "pending" | "approved" | "rejected" | "underReview";
  createdAt: string;
  updatedAt: string;
}

export interface AdminKYCResponse {
  success: boolean;
  message?: string;
  submissions?: AdminKYCData[];
  kyc?: AdminKYCData;
}

// Get all KYC submissions
export const getAllKYCSubmissions = async (): Promise<AdminKYCResponse> => {
  const response = await axios.get<AdminKYCResponse>("/company/kyc/admin/all");
  return response.data;
};

// Get single client's KYC
export const getClientKYC = async (companyId: string): Promise<AdminKYCResponse> => {
  const response = await axios.get<AdminKYCResponse>(`/company/kyc/admin/${companyId}`);
  return response.data;
};

// Approve document
export const approveKYCDocument = async (
  companyId: string,
  documentType: string
): Promise<AdminKYCResponse> => {
  const response = await axios.put<AdminKYCResponse>(
    `/company/kyc/admin/${companyId}/approve/${documentType}`
  );
  return response.data;
};

export const markKYCDocumentUnderReview = (
  companyId: string,
  documentType: string
) => {
  return axios.put(
    `company/kyc/admin/${companyId}/${documentType}/under-review`
  );
};

// Reject document
export const rejectKYCDocument = async (
  companyId: string,
  documentType: string,
  reason: string
): Promise<AdminKYCResponse> => {
  const response = await axios.put<AdminKYCResponse>(
    `/company/kyc/admin/${companyId}/reject/${documentType}`,
    { reason }
  );
  return response.data;
};

// Get document view URL (for iframe/new tab)
export const getDocumentViewUrl = (companyId: string, documentType: string): string => {
  const token = localStorage.getItem("token");
  const baseUrl = `${axios.defaults.baseURL}/company/kyc/admin/${companyId}/document/${documentType}`;
  return token ? `${baseUrl}?token=${token}` : baseUrl;
};
