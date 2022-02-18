import './comment.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Comments } from '../../../both';

Template.comment_form.events({
  'submit .js-create-comment'(event, instance) {
    event.preventDefault();

    if (!Meteor.userId) {

      // make the user login first
      Modal.show('login_modal');
      return;
    }

    const content = event.target.content.value;

    // let commentDoc = {
    //   content: content,
    //   articleId: FlowRouter.getParam('articleId'),
    //   createdAt: new Date(),
    //   ownerId: Meteor.userId()
    // };

    // Comments.insert(commentDoc);
    Meteor.call('insertComment', { 
      content: content,
      articleId: FlowRouter.getParam('articleId')
    
      // The following function gets called when the server has finished with
      // the Meteor.call
    }, function(err, res) {
      if (!err) {
        // only clean the form on successful save of the comment
        event.target.content.value = '';
      }
    });
  }
});

Template.comment_list.helpers({
  comments() {
    return Comments.find({ articleId: FlowRouter.getParam('articleId') }, { sort: { createdAt: 1 } });
  }
});
