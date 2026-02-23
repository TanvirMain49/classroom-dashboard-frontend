import React from "react";
import { Navigate } from "react-router";
import { usePermission } from "@/hooks/usePermission";

interface ProtectedCreateRouteProps {
  resource: string;
  children: React.ReactNode;
}

export const ProtectedCreateRoute: React.FC<ProtectedCreateRouteProps> = ({
  resource,
  children,
}) => {
  const { canAccessCreate } = usePermission();

  // If user cannot access create for this resource, redirect to the list page
  if (!canAccessCreate(resource)) {
    return <Navigate to={`/${resource}`} replace />;
  }

  return <>{children}</>;
};
