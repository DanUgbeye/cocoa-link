import { User } from "@/types";

class AppUtils {
  getBaseUrl(): string {
    return typeof window === "undefined"
      ? ""
      : `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? ":" + window.location.port : ""
        }`;
  }

  getUserInitials(user?: User) {
    if (!user) return "";

    const [firstname, lastname] = user.name.split(" ");
    let initials = firstname[0];

    if (lastname) {
      initials += lastname[0];
    } else {
      initials += firstname[1];
    }

    return initials.toUpperCase();
  }
}

export const appUtils = new AppUtils();
