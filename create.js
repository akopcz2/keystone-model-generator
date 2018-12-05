#!/usr/bin/env node

const MODEL_DIR = './models/' || '' ;
const PROCESS_ARGS = process.argv.slice(2);
const beautify = require('js-beautify').js;
const fs = require('fs');

//Global Helpers
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

async function writeTemplate(templateName, templateData){
    return new Promise((resolve, reject) => {
        fs.writeFile(MODEL_DIR  + `${templateName}.js`, beautify(templateData, { indent_size: 2, space_in_empty_paren: true }), {flag:"w+"}, (err) => {
            if (err) throw err;
            resolve(`Created ${templateName}`);
        });
    });
}

async function createTemplate(val){
    return new Promise((resolve, reject) => {
        val = val.capitalize();
        var modelTemplate = `var keystone = require('keystone');
        var Types = keystone.Field.Types;
        
        /**
         * ${val} Model
         * ==========
         */
        var ${val} = new keystone.List('${val}');
        
        ${val}.add({
            name: { type: Types.Name },
        });
        
        /**
         * Registration
         */
        ${val}.defaultColumns = 'name';
        ${val}.register();`

        writeTemplate(val, modelTemplate)
        resolve (val, modelTemplate);
    });
}

async function processArguments(args){
    const lengthOfArgs = args.length;
    const promises = args.map(createTemplate);
    await Promise.all(promises);
    console.log(`DONE GENERATING ${lengthOfArgs} MODELS`);
}

/** MAIN FUNCTION */
processArguments(PROCESS_ARGS);


















