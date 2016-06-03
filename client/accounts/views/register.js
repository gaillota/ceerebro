AutoForm.addHooks('registrationForm', {
    onSubmit: function(doc) {
        this.event.preventDefault();
        var self = this;

        doc.keychain = EncryptionService.setupUserKeychain(doc.password);
        Meteor.call('registerUser', doc, function(error) {
            self.done(error);
        });
    },
    onSuccess: function() {
        toastr.success('Registration successful ! Check your e-mails');
    }
});