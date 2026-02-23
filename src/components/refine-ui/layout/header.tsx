import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  useActiveAuthProvider,
  useLogout,
  useRefineOptions,
} from "@refinedev/core";
import { LogOutIcon, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import type { User } from "@/types/user";

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-16",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-end",
        "z-40",
      )}
    >
      <ThemeToggle />
      <UserDropdown />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-12",
        "shrink-0",
        "items-center",
        "gap-2",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-between",
        "z-40",
      )}
    >
      <SidebarTrigger
        className={cn("text-muted-foreground", "rotate-180", "ml-1", {
          "opacity-0": open,
          "opacity-100": !open || isMobile,
          "pointer-events-auto": !open || isMobile,
          "pointer-events-none": open && !isMobile,
        })}
      />

      <div
        className={cn(
          "whitespace-nowrap",
          "flex",
          "flex-row",
          "h-full",
          "items-center",
          "justify-start",
          "gap-2",
          "transition-discrete",
          "duration-200",
          {
            "pl-3": !open,
            "pl-5": open,
          },
        )}
      >
        <div>{title.icon}</div>
        <h2
          className={cn(
            "text-sm",
            "font-bold",
            "transition-opacity",
            "duration-200",
            {
              "opacity-0": !open,
              "opacity-100": open,
            },
          )}
        >
          {title.text}
        </h2>
      </div>

      <ThemeToggle className={cn("h-8", "w-8")} />
    </header>
  );
}

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const UserDropdown = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const { data: session } = authClient.useSession();
  const user: User | undefined = session?.user;
  // console.log('user: ',user);

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {user?.image && <AvatarImage src={user?.image} alt={user?.name} />}
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-3 p-3 border-b mb-1">
          <div className="flex flex-col gap-1">
            {/* Name with Icon */}
            <div className="flex items-center gap-2">
              <UserCircle2 size={20} />
              <span className="text-xs font-bold text-foreground leading-none">
                {user?.name}
              </span>
            </div>

            {/* Email with Icon */}
            <div className="flex items-center gap-2">
              <Mail size={20} />
              <span className="text-xs text-foreground truncate w-32 leading-none">
                {user?.email}
              </span>
            </div>

            {/* Role with Icon */}
            {user?.role && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="text-xs font-medium text-foreground capitalize leading-none">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </div>
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = "Header";
MobileHeader.displayName = "MobileHeader";
DesktopHeader.displayName = "DesktopHeader";
