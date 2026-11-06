// შესული და რეგისტრირებული მომხმარებლის მონაცემების ტიპებს განსაზღვრავს.
export interface AuthUser {
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  isLoggedIn: boolean;
}

export interface RegisteredUser {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  address: string;
  phone?: string;
}

// Login-ისა და რეგისტრაციის ფორმის ველებს ერთ საერთო ტიპში აერთიანებს.
export interface LoginFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
