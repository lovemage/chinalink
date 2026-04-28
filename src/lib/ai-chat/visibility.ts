export function shouldShowAiChat(pathname: string): boolean {
  return !pathname.startsWith('/checkout')
}

