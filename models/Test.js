var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Test Model
 * ==========
 */
var Test = new keystone.List('Test');

Test.add({
  name: {
    type: Types.Name
  },
});

/**
 * Registration
 */
Test.defaultColumns = 'name';
Test.register();