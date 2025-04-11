import * as yup from "yup";

export const signupSchema = yup.object().shape({
    firstName: yup
        .string()
        .required('First name is required'),
    lastName: yup
        .string()
        .required('Last name is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*])(?=.{8,})/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    }
);
