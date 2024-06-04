import { PreferenceCategoryList } from "./PreferenceCategoryList";

export interface Friend {
  username: string;
  uid: string;
  profileImageUrl?: string | number;
  preferences?: PreferenceCategoryList[];
}