// შესული და რეგისტრირებული მომხმარებლის მონაცემების ტიპებს განსაზღვრავს.
export interface AuthUser {
  username: string;
  fullName: string;
  email: string;
  address: string;
  isLoggedIn: boolean;
}

export interface RegisteredUser {
  fullName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  address: string;
}

// Login-ისა და რეგისტრაციის ფორმის ველებს ერთ საერთო ტიპში აერთიანებს.
export interface LoginFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
