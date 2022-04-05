// сообщения об ошибке когда срабатывает наша валидация
const invalidMessage = (value: string) => `Invalid ${value} format`;

export const EMAIL_MESSAGE = invalidMessage('email');

export const REQUIRE_MESSAGE = 'This field is required';

export const INCORRECT_SYMBOL_MESSAGE = 'Invalid characters used';

export const PASSWORD_CONFIRMATION = 'Password must match' 

export const PASSWORD_SHORT_MESSAGE = (short: number) =>
  `Password must be at least ${short} characters`;
export const PASSWORD_LONG_MESSAGE = (long: number) =>
  `Password must not exceed ${long} characters`;
