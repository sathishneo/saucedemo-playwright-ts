// Reads credentials from environment variables, with SauceDemo's public test account as fallback.
export const credentials = {
  username: process.env.SAUCE_USERNAME ?? 'standard_user',
  password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
};
