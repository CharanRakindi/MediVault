import jwt from 'jsonwebtoken';

/** Cookie flags — override with COOKIE_SECURE / COOKIE_SAMESITE for Docker HTTP or cross-site HTTPS */
function cookieOptions(maxAgeMs) {
  const secure =
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === 'true'
      : process.env.NODE_ENV === 'production';

  const sameSite = process.env.COOKIE_SAMESITE || 'lax';

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: maxAgeMs,
    path: '/',
  };
}

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
};

export const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
};

export const clearTokenCookies = (res) => {
  const base = cookieOptions(0);
  res.cookie('accessToken', '', { ...base, maxAge: 0, expires: new Date(0) });
  res.cookie('refreshToken', '', { ...base, maxAge: 0, expires: new Date(0) });
};
