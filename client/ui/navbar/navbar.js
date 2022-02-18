import './navbar.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.navbar.events({
  'click .js-open-login-modal'(event, instance) {
    Modal.show('login_modal');
  },
  'click .js-logout'(event, instance) {
    Meteor.logout();
  },
  'click .js-goto-create-article'(event, instance) {
    if (Meteor.userId()) {
      FlowRouter.go('/article/create');
    } else {
      // 'Session' is a global variable per user
      Session.set('redirection', '/article/create');
      Modal.show('login_modal');
    }
  }
});

Template.login_modal.onCreated(function() {
  // we use this.autorun instead of Tracker.autorun to link the computation 
  // to the template. Because of that, the autorun/ computation will stop
  // automatically when the template is destroyed.
  this.autorun(() => {
    if (Meteor.userId()) {
      Modal.hide('login_modal');
      if (Session.get('redirection')) {
        FlowRouter.go(Session.get('redirection'));
        Session.set('redirection', undefined);
      }
    }
  });
});