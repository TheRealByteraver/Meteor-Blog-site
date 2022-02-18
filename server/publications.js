import { Articles, Comments } from '../both';
import { check } from 'meteor/check';
// import { escapeSelector } from 'jquery';

// Meteor publications are a bit like Meteor methods in the sense that you
// can decide what to publish, based on which user is connected, IF a user
// is logged in at all, etc.

Meteor.publish('articles.list', function(skip, limit) {
  // In a publication we return the database cursor, not the data itself,
  // so there is no .fetch() after find()

  check(skip, Number);
  check(limit, Number);

  const articleCursor = Articles.find({}, { 
    fields: { content: 0 },
    sort: { createdAt: -1 },
    skip: skip,
    limit: limit
  });

  // Get all id's from authors
  const arrayArticle = articleCursor.fetch();

  const arrayOwnerId = arrayArticle.map(article => article.ownerId);

  const arrayUniqueOwnerId = Array.from(new Set(arrayOwnerId));

  Counts.publish(this, 'articlesCount', Articles.find({}));

  return [
    // we do not need the contents of the articles, only the title, authorId & createdAt
    articleCursor,
    Meteor.users.find({_id: { $in: arrayUniqueOwnerId }}, 
      { fields: { profile: 1 } }) // do not send password, e-mail, etc. to the client
  ];
});

Meteor.publish('article.single', function(articleId) {
  check(articleId, String);

    const articleCursor = Articles.find({ _id: articleId });
    const commentCursor = Comments.find({ articleId: articleId });

    // get the _id's of the 'comment' authors:
    const arrayComment = commentCursor.fetch();
    const arrayOwnerId = arrayComment.map(comment => comment.ownerId);

    // we add the _id of the author of the article:
    const article = articleCursor.fetch().find(article => article._id === articleId);
    arrayOwnerId.push(article.ownerId);

    const arrayUniqueOwnerId = Array.from(new Set(arrayOwnerId));
    return [
      articleCursor,
      commentCursor,
      Meteor.users.find({ _id: { $in: arrayUniqueOwnerId } }, 
        { fields: { profile: 1 } }) // do not send password, e-mail, etc. to the client
    ];
});