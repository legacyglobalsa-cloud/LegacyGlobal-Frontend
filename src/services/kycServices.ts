    import axios from "@/lib/axios";

    export interface KYCUploadData {
    crLicense?: File;
    vatCertificate?: File;
    signatoryId?: File;
    bankLetter?: File;
    proofOfAddress?: File;
    sourceOfFunds?: File;
    }

    export interface KYCDocumentData {
    fileUrl: string;
    status: "pending" | "approved" | "rejected" | "underReview";
    }

    export interface KYCData {
    _id: string;
    company: string;
    documents: {
        crLicense?: KYCDocumentData;
        vatCertificate?: KYCDocumentData;
        signatoryId?: KYCDocumentData;
        bankLetter?: KYCDocumentData;
        proofOfAddress?: KYCDocumentData;
        sourceOfFunds?: KYCDocumentData;
    };
    overallStatus: "pending" | "approved" | "rejected" | "underReview";
    createdAt: string;
    updatedAt: string;
    }

    export interface KYCResponse {
    success: boolean;
    message?: string;
    kyc: KYCData | null;
    }

    export const uploadKYCDocuments = async (documents: KYCUploadData): Promise<KYCResponse> => {
    const formData = new FormData();

    Object.entries(documents).forEach(([key, file]) => {
        if (file) {
        formData.append(key, file);
        }
    });

    const response = await axios.post<KYCResponse>("/company/kyc", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
    };

    export const getKYCStatus = async (): Promise<KYCResponse> => {
    const response = await axios.get<KYCResponse>("/company/kyc");
    return response.data;
    };