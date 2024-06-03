export interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: Date;
  userProfileImage: string | number;
  username: string;
}
