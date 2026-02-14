// app/schemas/auth.schema.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: "Minimum 2 characters" }),
  lastName: z.string().min(2, { message: "Minimum 2 characters" }),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(3, { message: "Minimum 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;






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



// import { z } from "zod";

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// export const registerSchema = z
//   .object({
//     username: z.string().min(2),
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
