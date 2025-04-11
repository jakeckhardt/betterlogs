import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email({key: 'email', message: 'Invalid email format'})
        .required({key: 'email', message: 'Email is required'})
    }
);
