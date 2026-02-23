import React from "react";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { usePermission } from "@/hooks/usePermission";
import { type BaseKey } from "@refinedev/core";

type ProtectedCreateButtonProps = {
  resource?: BaseKey;
  meta?: Record<string, unknown>;
} & React.ComponentProps<typeof CreateButton>;

export const ProtectedCreateButton = React.forwardRef<
  React.ComponentRef<typeof CreateButton>,
  ProtectedCreateButtonProps
>(({ resource, ...props }, ref) => {
  const { canAccessCreate } = usePermission();
  const resourceName = (resource as string) || "";

  // Only show button if user has permission for this resource
  if (!resourceName || !canAccessCreate(resourceName)) {
    return null;
  }

  return <CreateButton ref={ref} resource={resource} {...props} />;
});

ProtectedCreateButton.displayName = "ProtectedCreateButton";
