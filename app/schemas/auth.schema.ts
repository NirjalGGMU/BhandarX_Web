// app/schemas/auth.schema.ts


// import { z } from "zod";

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// export const registerSchema = z
//   .object({
//     name: z.string().min(2),
//     email: z.string().email(),
//     password: z.string().min(6),
//     confirmPassword: z.string(),
//   })
//   .refine((d) => d.password === d.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// export type LoginData = z.infer<typeof loginSchema>;
// export type RegisterData = z.infer<typeof registerSchema>;



import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z
  .object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
