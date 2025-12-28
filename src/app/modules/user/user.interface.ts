export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  isActive?:string;
  
  auths?: "Google" | "Facebook";
  role: "Admin" | "User";
  booking:string,

}
