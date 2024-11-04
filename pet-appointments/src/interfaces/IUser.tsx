export default interface IUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLoginAt: string | null;
  petNames: string[];
  token?: string;  // Add this optional property
}

export interface IAuthUser extends IUser {
  token: string;  // This makes token required
}