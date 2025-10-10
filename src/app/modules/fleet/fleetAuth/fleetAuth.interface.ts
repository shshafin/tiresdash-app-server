export type IFleetLoginUser = {
  email: string;
  password: string;
};

export type IFleetLoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  needsPasswordChange: boolean;
};

export type IFleetRefreshTokenResponse = {
  accessToken: string;
};

export type IFleetChangePassword = {
  oldPassword: string;
  newPassword: string;
};
