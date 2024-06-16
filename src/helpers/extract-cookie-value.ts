export function extractCookieValue(cookiesString: string, cookieName: string) {
  const cookies = cookiesString.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === cookieName) {
      return cookie[1];
    }
  }
}
