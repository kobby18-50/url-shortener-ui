import * as yup from 'yup'

export const urlValidationSchema = yup.object({
     longUrl: yup
    .string()
    .required("Url is required")
    .min(10, "Url must be at least 10 characters")
    .url('Enter a valid url')
})