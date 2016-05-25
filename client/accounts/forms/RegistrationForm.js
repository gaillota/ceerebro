RegistrationForm = new SimpleSchema({
    username: {
        type: String,
        label: "Username",
        min: 3,
        max: 20
    },
    email: {
        type: String,
        label: "E-mail address",
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
            type: "email"
        }
    },
    password: {
        type: String,
        label: "Master password / Account password",
        min: 5,
        autoform: {
            type: "password"
        }
    },
    confirm: {
        type: String,
        label: "Confirm password",
        autoform: {
            type: "password"
        },
        custom: function() {
            if (this.value !== this.field('password').value) {
                return 'passwordMismatch';
            }
        }
    }
});