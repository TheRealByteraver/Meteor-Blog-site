import { Articles, Comments, articleUpsertSchema } from './collections';
import { check } from 'meteor/check';
import { commentInsertSchema } from '.';

Meteor.methods({
  insertArticle(article) {

    // perform type checking using the _check_ package:
    articleUpsertSchema.validate(article);

    // this is now obsolete:
    // check(article, {
    //   title: String,
    //   content: String
    // });

    if (!this.userId) {
      throw new Meteor.Error('not-connected', 
        'You need to login before you can publish an article');
    }

    let articleDoc = {
      title: article.title,
      content: article.content,
      createdAt: new Date(),

      // It is faster/ easier to use this.userId than it is to use 
      // Meteor.userId(). NEVER get the userId from the client (from 
      // the browser) as this would permit user spoofing.
      ownerId: this.userId 
    };

    // return the _id of the inserted article:
    return Articles.insert(articleDoc); 
  },
  updateArticle(article) {

    articleUpsertSchema.validate(article);
    // check(article, {
    //   id: String,
    //   title: String,
    //   content: String
    // });

    if (!this.userId) {
      throw new Meteor.Error('not-connected', 
        'You need to login before you can update an article');
    }

    const articleFound = Articles.findOne({ _id: article.id });
    if (articleFound.ownerId !== this.userId) {
      throw new Meteor.Error('unauthorized', 
        'Only the original author is allowed to edit the article');
    }

    Articles.update(
      { _id: article.id }, 
      { $set: { title: article.title, content: article.content } }
    );
  },
  removeArticle(articleId) {
    check(articleId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-connected', 
        'You need to login before you can delete an article');
    }

    const articleFound = Articles.findOne({ _id: articleId });
    if (articleFound.ownerId !== this.userId) {
      throw new Meteor.Error('unauthorized', 
        'Only the original author is allowed to delete the article');     
    }

    Articles.remove({ _id: articleId });
  },
  insertComment(comment) {

    commentInsertSchema.validate(comment);
    // check(comment, {
    //   content: String,
    //   articleId: String
    // });

    if (!this.userId) {
      throw new Meteor.Error('not-connected', 
        'You need to login before you can add a comment');
    }

    let commentDoc = {
      content: comment.content,
      articleId: comment.articleId,
      createdAt: new Date(),
      ownerId: this.userId
    };

    Comments.insert(commentDoc);
  }
  

});
