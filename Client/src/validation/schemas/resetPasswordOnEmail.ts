import * as yup from 'yup';

import * as MESSAGES from '../messages';

// схема проверки при изменении почты
export const resetPasswordOnEmailSchema = yup.object().shape({
    email: yup
    .string()
    .email(MESSAGES.EMAIL_MESSAGE)
    .required(MESSAGES.REQUIRE_MESSAGE),
});
