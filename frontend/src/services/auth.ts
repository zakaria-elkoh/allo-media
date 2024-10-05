interface UserInfo {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}
interface SignUpResponse {
  success: boolean;
  message: string;
  data: any;
}

import api from "@/api/api";

const signUp = async (userInfo: UserInfo): Promise<SignUpResponse> => {
  const res = await api.post("/api/auth/signup", userInfo);
  console.log(userInfo);
  return res.data;
};

export { signUp };
