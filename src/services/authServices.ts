import axios from "@/lib/axios";

export interface UserProfile {
  fullname: string;
  email: string;
}

export interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

export interface SocketTokenResponse {
  success: boolean;
  token: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get<ProfileResponse>("/auth/profile");
  return response.data;
};

export const getSocketToken = async (): Promise<string> => {
  const response = await axios.get<SocketTokenResponse>("/auth/socket-token");
  return response.data.token;
};