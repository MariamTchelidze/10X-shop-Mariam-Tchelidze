import * as Yup from "yup";

// Login-ისთვის username-ს ვიღებთ, რეგისტრაციისას კი ელფოსტას ვამოწმებთ.
export const loginSchema = Yup.object({
  fullName: Yup.string().defined(),
  email: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .matches(/^\S+$/, "Username cannot contain spaces.")
    .required("Username is required."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
  confirmPassword: Yup.string().defined(),
});

// რეგისტრაციის ველები უფრო მკაცრად მოწმდება ანგარიშის შექმნამდე.
export const registerSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required."),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Please confirm your password."),
});
