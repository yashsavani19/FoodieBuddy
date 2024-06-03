import { PreferenceList } from "./PreferenceList";

export interface Friend {
  username: string;
  uid: string;
  profileImageUrl?: string | number;
  preferences?: PreferenceList[];
}