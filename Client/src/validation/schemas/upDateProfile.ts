import * as yup from 'yup';

import * as MESSAGES from '../messages';

// схема проверки при изменении пользователя
export const upDateProfileSchema = yup.object().shape({
    displayName: yup
    .string()
    .required(MESSAGES.REQUIRE_MESSAGE),
});
