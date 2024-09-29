import { PROFILE_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { mergePayloadWithStoreId } from "services/utils/localStorageData.service";

interface ISendOTP {
  username: string;
}

interface IVerifyOTP {
  username?: string;
  otp: string;
}

interface IChangePassword {
  old_password: string;
  new_password: string;
  cnf_new_password: string;
}

export const AccountSettingService = {
  getBasicInfo: async (authUserId: string): Promise<any> =>
    await apiIns.get(PROFILE_SERVICE + "users/get-profile-by/" + authUserId),

  updateProfile: async (profilePayload: any): Promise<any> =>
    await apiIns.put(PROFILE_SERVICE + "users/update-profile", profilePayload),

  removeProfilePicture: async (id: string): Promise<any> =>
    await apiIns.put(PROFILE_SERVICE + "users/remove-profile-image-by/" + id),

  changePassword: async (changePassPayload: IChangePassword): Promise<any> =>
    await apiIns.put(
      PROFILE_SERVICE + "users/change-password",
      mergePayloadWithStoreId(changePassPayload)
    ),

  sendOTP: async (otpPayload: ISendOTP): Promise<any> =>
    await apiIns.put(PROFILE_SERVICE + "users/send-otp", otpPayload),

  verifyOTP: async (verifyOtpPayload: IVerifyOTP): Promise<any> =>
    await apiIns.put(PROFILE_SERVICE + "users/verify-otp", verifyOtpPayload),
};
