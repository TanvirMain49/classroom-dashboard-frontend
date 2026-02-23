import { authClient } from "@/lib/auth-client";
import type { User } from "@/types/user";

export const usePermission = () => {
  const { data: session } = authClient.useSession();
  const user: User | undefined = session?.user as User | undefined;

  const userRole = user?.role;

  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';

  const canAccessCreate = (resource: string) => {
    switch (resource) {
      case "subjects":
        return isAdmin || isTeacher;
      case "classes":
        return isAdmin || isTeacher;
      case "departments":
        return isAdmin ; // Only admin can create departments
      default:
        return isAdmin;
    }
  };

  return {
    isAdmin,
    isTeacher,
    isStudent,
    canAccessCreate,
  };
};
