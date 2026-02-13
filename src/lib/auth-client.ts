import { BACKEND_BASE_URL, USER_ROLES } from "@/constants";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: new URL("auth", BACKEND_BASE_URL).toString(),
    user: {
        additionalField:{
            role: {
                type: USER_ROLES,
                required: true,
                defaultValue: 'student',
                input: true,
            },
            department: {
                type: 'string',
                required: false,
                input: true,
            },
            imageCldPubId: {
                type: 'string',
                required: false,
                input: true,
            }
        }
    }
})