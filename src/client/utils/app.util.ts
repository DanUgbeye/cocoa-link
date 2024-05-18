class AppUtils {
  getBaseUrl(): string {
    return typeof window === "undefined"
      ? ""
      : `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? ":" + window.location.port : ""
        }`;
  }
}

export const appUtils = new AppUtils();