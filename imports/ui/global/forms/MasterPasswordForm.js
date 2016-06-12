import { SimpleSchema } from 'aldeed:simple-schema';

MasterPasswordForm = new SimpleSchema({
    password: {
        type: String,
        label: "Your password",
        autoform: {
            type: "password",
            autofocus: true
        }
    }
});