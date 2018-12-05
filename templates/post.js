

module.exports = function(value, name){
    switch(value === 'post' && !name) {
        case true:
            var modelTemplate = `var keystone = require('keystone');
                var Types = keystone.Field.Types;
            
                var Post = new keystone.List('Post', {
                    autokey: { from: 'name', path: 'key', unique: true },
                });
            
                Post.add({
                    name: { type: String, required: true },
                    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
                    author: { type: Types.Relationship, ref: 'User', index: true },
                    publishedDate: { type: Types.Date, index: true },
                    image: { type: Types.CloudinaryImage },
                    content: {
                        brief: { type: Types.Html, wysiwyg: true, height: 150 },
                        extended: { type: Types.Html, wysiwyg: true, height: 400 },
                    },
                    categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
                });
            
                Post.schema.virtual('content.full').get(function () {
                    return this.content.extended || this.content.brief;
                });
            
                Post.relationship({ path: 'comments', ref: 'PostComment', refPath: 'post' });
            
                Post.track = true;
                Post.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%';
                Post.register();`
                return modelTemplate;
            break;
        case false:
            var modelTemplate = `var keystone = require('keystone');
            var Types = keystone.Field.Types;
        
            var ${val} = new keystone.List('${val}', {
                autokey: { from: 'name', path: 'key', unique: true },
            });
        
            ${val}.add({
                name: { type: String, required: true },
                state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
                author: { type: Types.Relationship, ref: 'User', index: true },
                publishedDate: { type: Types.Date, index: true },
                image: { type: Types.CloudinaryImage },
                content: {
                    brief: { type: Types.Html, wysiwyg: true, height: 150 },
                    extended: { type: Types.Html, wysiwyg: true, height: 400 },
                },
                categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
            });
        
            ${val}.schema.virtual('content.full').get(function () {
                return this.content.extended || this.content.brief;
            });
        
            ${val}.relationship({ path: 'comments', ref: 'PostComment', refPath: '${val}' });
        
            ${val}.track = true;
            ${val}.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%';
            ${val}.register();`
            return modelTemplate;
            break;
        default:
            return;
    }

}



class TemplateDefaults {

    value = value.toLowerCase();
    name = name.toLowerCase();

    constructor(value, name){
        this.value = value;
        this.name = name;
    }
    capitalize(value,name){
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    default(value, name){
        `var keystone = require('keystone');
        var Types = keystone.Field.Types;
        
        /**
         * ${value} Model
         * ==========
         */
        var ${value} = new keystone.List('${value}');
        
        ${value}.add({
            name: { type: Types.Name },
        });
        
        /**
         * Registration
         */
        ${value}.defaultColumns = 'name';
        ${value}.register();`

    }
    async  writeTemplate(templateName, templateData){
        return new Promise((resolve, reject) => {
            fs.writeFile(MODEL_DIR  + `${templateName}.js`, beautify(templateData, { indent_size: 2, space_in_empty_paren: true }), {flag:"w+"}, (err) => {
                if (err) throw err;
                resolve(`Created ${templateName}`);
            });
        });
    }

}


module.exports = ( value, name ) => { return new TemplateDefaults( value, name ) }