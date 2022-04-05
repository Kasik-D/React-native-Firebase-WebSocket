import * as yup from 'yup';

import * as MESSAGES from '../messages';
import * as REGEX from '../regex';

const PASSWORD_MIN = 6;
const PASSWORD_MAX = 30;

// схема проверки при изменении пароля
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(PASSWORD_MIN, MESSAGES.PASSWORD_SHORT_MESSAGE(PASSWORD_MIN))
    .max(PASSWORD_MAX, MESSAGES.PASSWORD_LONG_MESSAGE(PASSWORD_MAX))
    .matches(REGEX.PASSWORD_REGEX, MESSAGES.INCORRECT_SYMBOL_MESSAGE)
    .required(MESSAGES.REQUIRE_MESSAGE),
});
