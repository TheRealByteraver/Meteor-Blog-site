T9n.setLanguage('en');

let email = AccountsTemplates.removeField('email');
let password = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
  _id: 'fullname',
  type: 'text',
  displayName: 'Full name',
  placeholder: 'Full name',
  required: true,
  minLength: 3,
  trim: true
});

password.minLength = 3; // for dev purposes only

AccountsTemplates.addField(email);
AccountsTemplates.addField(password);
