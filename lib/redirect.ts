export function redirectToLogin() {
  redirect("/login");
}

export function redirect(path: string) {
  if (typeof window !== "undefined") {
    // @ts-expect-error window ishlatmasa bulmayapti
    window.location = path;
  }
}
