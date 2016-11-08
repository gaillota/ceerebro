import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Counts} from 'meteor/tmeasday:publish-counts';

import './users.html';

import {Credentials} from "../../../api/credentials/credentials";

import {activate} from '../../../api/users/methods';
import {toggleStatus} from '../../../api/users/methods';
import {Notification} from "../../../startup/services/notification.service";

Template["admin.users"].onCreated(function adminAccountsCreated() {
    this.subscribe('count.admin.users');
});

Template["admin.users"].helpers({
    users() {
        return Meteor.users.find({
            _id: {
                $ne: Meteor.userId()
            }
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    userConnectionStatus() {
        if (!this.status) {
            return 'gray';
        } else {
            if (this.status.online) {
                return '#5cb85c';
            } else if (this.status.idle) {
                return '#f0ad4e';
            } else {
                return 'gray';
            }
        }
    },
    credentialsCount() {
        return Credentials.find({
            owner: this._id
        }).count();
    },
    emailNotVerified() {
        return !this.emails[0].verified;
    },
    isDisabled() {
        return !!this.disabled;
    }
});

Template["admin.users"].events({
    'click .js-status-toggle'() {
        toggleStatus.call({userId: this._id}, (error) => {
            Notification.error(error.toString);
        });
    },
    'click .js-activate'() {
        activate.call({userId: this._id}, (error) => {
            Notification.error(error.toString);
        });
    }
});