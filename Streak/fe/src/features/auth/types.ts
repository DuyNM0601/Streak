// Khớp với JSON mà POST /auth/google trả về (AuthModel ở BE).
export type AuthSession = {
  accessToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};
