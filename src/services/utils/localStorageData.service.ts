import { LocalStorageService } from "./local-storage.service";

export const userData: any = LocalStorageService.get("user_data");
// export const storeId = userData?.store_id;

export const mergeBodyWithStoreId = (payload: any) => {
  return {
    ...payload,
    body: {
      ...payload.body,
      // storeId,
    },
  };
};

export const mergePayloadWithStoreId = (payload: any) => {
  return {
    ...payload,
    // storeId,
  };
};
