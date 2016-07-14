import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import { Notification } from '../../startup/services/notification.service.js';
import { Credentials } from '../../api/credentials/credentials';

import './edit.html';

import { schema as CredentialsForm } from '../../startup/forms/credentials/CredentialsForm';
import { EncryptionService } from '../../startup/services/encryption.service.js';
import { update } from '../../api/credentials/methods';

Template.credentialsEdit.helpers({
    credentialsForm() {
        return CredentialsForm;
    },
    credentials() {
        var credentialsId = FlowRouter.getParam('credentialsId');
        var credentials = Credentials.findOne(credentialsId);
        if (!credentials) {
            return;
        }
        var masterKey = Session.get('masterKey');
        var plainPassword = EncryptionService.decrypt(credentials.password, masterKey, credentials.iv);

        return {
            domain: credentials.domain,
            identifier: credentials.identifier,
            password: plainPassword
        }
    }
});

AutoForm.addHooks('editCredentials', {
    onSubmit(doc) {
        this.event.preventDefault();
        var self = this;

        var masterKey = Session.get('masterKey');

        if (!masterKey) {
            this.done(new Meteor.Error('Cannot encrypt data. Master key missing'));
            return;
        }

        var credentialsId = FlowRouter.getParam('credentialsId');
        var credential = Credentials.findOne(credentialsId);

        if (!credential) {
            this.done(new Meteor.Error('Credentials not found, could not save'));
            return;
        }

        doc.password = EncryptionService.encrypt(doc.password, masterKey, credential.iv);
        doc.credentialsId = credentialsId;

        update.call(doc, (error) => {
            self.done(error);
        });
    },
    onSuccess() {
        Notification.success('Credentials edited');
        FlowRouter.go('credentials');
    }
});