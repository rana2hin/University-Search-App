export interface University {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  website: string;
  state: string;
}

export enum MailingStatus {
  GOOD = "Good time to Mail",
  BAD = "Not a good time",
  SLEEPING = "They might be Sleeping",
}