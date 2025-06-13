export type LoginDTO = {
  email: string;
  password: string;
};

export type LoginResponseDTO = {
  user: {
    sub: string;
    email: string;
    isAdmin: boolean;
  };
  token: string;
  refreshToken: string;
};

export type RefreshTokenDTO = {
  refreshToken: string;
  userId: string;
};

export type RefreshTokenResponseDTO = {
  accessToken: string;
};
