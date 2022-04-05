import * as yup from 'yup';

import * as MESSAGES from '../messages';


// схема проверки создания чата
export const createChatSchema = yup.object().shape({
    roomName: yup
    .string()
    .required(MESSAGES.REQUIRE_MESSAGE),
});
