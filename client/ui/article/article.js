import { Articles } from '../../../both';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './article.html';

Template.article_create_form.events({
  'submit .js-create-article'(event, instance) {
    event.preventDefault();
    const title = event.target.title.value;
    const content = event.target.content.value;

    Meteor.call('insertArticle', { title: title, content: content }, 

      // "res" contains whatever value the method 'insertArticle' returned
      function(err, res) {
        if (!err) {
          // only clean forms on successful Meteor.call
          event.target.title.value = '';
          event.target.content.value = '';

          FlowRouter.go('/article/:articleId', { articleId: res });
        }
      }
    );
  }
});

const NUM_ARTICLE_IN_PAGE = 5;

Template.article_list.onCreated(function() {
  this.autorun(() => {
    let currentPage = +FlowRouter.getParam('page') || 1;
    let skip = (currentPage - 1) * NUM_ARTICLE_IN_PAGE;
  
    // Don't use Meteor.subscribe here. "This" refers to the instance
    // of the template. 'articles.list' is the name of the publication
    // as defined in the server side Meteor.publish statement.
    this.subscribe('articles.list', skip, NUM_ARTICLE_IN_PAGE); //page 0, 5 results  
  });
});

Template.article_list.helpers({
  articles() {
    return Articles.find({}, { sort: { createdAt: -1 } }).fetch();
  },
  pages() {
    const articlesCount = Counts.get('articlesCount');

    // have at least one page, unless there are zero articles:
    const pagesCount = Math.ceil(articlesCount / NUM_ARTICLE_IN_PAGE);

    let currentPage = +FlowRouter.getParam('page') || 1;
    let pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push({ index: i, active: i === currentPage });
    }
    return pages;
  }
});

Template.article_page.onCreated(function() {
  this.subscribe('article.single', FlowRouter.getParam('articleId'));
});

Template.article_page.helpers({
  article() {
    return Articles.findOne({ _id: FlowRouter.getParam('articleId') });
  }
});

Template.article_edit_form.onCreated(function() {
  this.subscribe('article.single', FlowRouter.getParam('articleId'));
});

Template.article_edit_form.helpers({
  article() {
    return Articles.findOne({ _id: FlowRouter.getParam('articleId') });
  }
});

Template.article_edit_form.events({
  'submit .js-edit-article'(event, instance) {
    event.preventDefault();

    const title = event.target.title.value;
    const content = event.target.content.value;

    // Articles.update({ _id: FlowRouter.getParam('articleId') }, 
    //   { $set: { title: title, content: content } });
    Meteor.call('updateArticle', 
      { id: FlowRouter.getParam('articleId'), title: title, content: content },
      function(err, res) {
        if (!err) {
          // only redirect on successful Meteor.call
          FlowRouter.go('/article/:articleId', 
            { articleId: FlowRouter.getParam('articleId') }
          );
        }
      }
    );
  },
  'click .js-delete-article'(event, instance) {
    // Articles.remove({ _id: FlowRouter.getParam('articleId') });
    Meteor.call('removeArticle', FlowRouter.getParam('articleId'),
      function(err, res) {
        if (!err) {
          // only redirect on successful Meteor.call
          FlowRouter.go('/');
        }
      }
    );
  }
});