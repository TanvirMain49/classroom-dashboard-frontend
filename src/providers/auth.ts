import { AuthProvider } from "@refinedev/core";
import { SignUpPayload, User } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  register: async ({
    email,
    password,
    name,
    role,
    image,
    imageCldPubId,
  }: SignUpPayload) => {
    try {
      // console.log("Cheek Name is present or not: ", name);
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
        image,
        imageCldPubId,
      } as SignUpPayload);
      if (error) {
        console.log("Register failed", error);
        return {
          success: false,
          error: {
            name: "Register failed",
            message:
              error?.message || "Unable to create account. Please try again.",
          },
        };
      }

      // Store user data
      if (!data?.user) {
        return {
          success: false,
          error: {
            name: "Register failed",
            message: "User data missing from response.",
          },
        };
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      console.log("Register error: ", e);
      return {
        success: false,
        error: {
          name: "Register error",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },

  login: async ({ email, password, providerName }) => {
    try {
      if (providerName === "google") {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "http://localhost:5173/",
        });
        return {
          success: true,
        };
      }
      if (providerName === "github") {
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "http://localhost:5173/",
        });
        return {
          success: true,
        };
      }
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
      });
      if (error) {
        return {
          success: false,
          error: {
            name: "Login failed.",
            message: error?.message || "Please try again",
          },
        };
      }

      if (!data?.user) {
        return {
          success: false,
          error: {
            name: "Login failed",
            message: "User data missing from response.",
          },
        };
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      console.log("Login error: ", e);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Please try again later.",
        },
      };
    }
  },

  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },

  check: async () => {
    const user = localStorage.getItem("user");

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };
  },

  getPermissions: async () => {
    const getStoredUser = (): User | null => {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      try {
        return JSON.parse(raw) as User;
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    };

    const parsedUser = getStoredUser();
    if (!parsedUser) return null;

    return {
      role: parsedUser.role,
    };
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      image: parsedUser.image,
      role: parsedUser.role,
      imageCldPubId: parsedUser.imageCldPubId,
    };
  },

};
