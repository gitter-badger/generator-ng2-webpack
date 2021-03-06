'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var mixinLodash = require('../../libs/mixinLodash');
var mixinBeautify = require('../../libs/mixinBeautify');
var mixinFile = require('../../libs/mixinFile');
var mixinNotifier = require('../../libs/mixinNotifier');
var mixinInspector = require('../../libs/mixinInspector');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        // applying mixins
        mixinLodash.extend(this);
        mixinBeautify.extend(this);
        mixinFile.extend(this);
        mixinNotifier.extend(this);
        mixinInspector.extend(this);

        // Registering file transforms
        this.mixins.beautifyJson();

        this.appname = this.appname || path.basename(process.cwd());
        this.appname = this.mixins.dasherize(this.appname);

        //******* arguments ***********
        // To access arguments later use this.argumentName
        this.argument('appname', {
            desc: 'The application name',
            type: String,
            optional: true,
            required: false,
            defaults: this.appname
        });

        this.appname = this.mixins.dasherize(this.appname);
        // ***** arguments ********

        // ****** options *********
        // To access options later use this.options.optionName
        this.option('skip-install', {
            desc: 'Skip the bower and node installations',
            type: Boolean,
            defaults: false
        });

    },

    initializing: function() {
        var done = this.async();
        var self = this;
        this.pkg = this.mixins.readJsonFile('../../package.json', __dirname);
        this.mixins.notifyUpdate(this.pkg, function(message) {
            if (message) {
                self.log(message);
            }
            done();
        });

    },

    prompting: function() {

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the awesome ' + chalk.yellow(this.mixins.getGeneratorShortname()) + ' generator!'));
        this.log('Out of the box I create an Angular 2 application.\n');
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'What is your the name of your project?',
            default: this.mixins.dasherize(this.appname)
        }, {
            type: 'input',
            name: 'clientFolder',
            message: 'In which folder would you like your scripts?',
            default: 'src'
        }];
        this.prompt(prompts, function(answers) {
            this.answers = answers;
            this.appname = this.answers.appname ? this.mixins.dasherize(this.answers.appname) : this.mixins.dasherize(this.appname);
            // To access answers later use this.answers.someAnswer;
            this.answers.clientFolder = this.mixins.dasherize(this.answers.clientFolder);
            this.answers.targetname = this.mixins.dasherize(this.answers.targetname);
            done();
        }.bind(this));
    },

    configuring: function() {
        this.config.set('filenameCase', this.filenameCase);
        this.config.set('filenameSuffix', this.filenameSuffix);
        this.config.set('appname', this.appname);
        this.config.set('clientFolder', this.answers.clientFolder);
        this.composeWith(this.mixins.getGeneratorShortname() + ':target', {
            //args: this.options.target ? [this.options.target] : null,
            options: {
                clientFolder: this.config.get('clientFolder') // passing the client folder for first run
            }
        });
    },

    writing: function() {

        this.mixins.createDirSync(this.destinationPath(this.answers.clientFolder));
        //this.mixins.createDirSync('test');
        //this.fs.write(this.destinationPath('test/.gitignore'), '');

        this.fs.copy(
            this.templatePath('typings'),
            this.destinationPath('typings')
        );

        this.fs.copyTpl(
            this.templatePath('_editorconfig'),
            this.destinationPath('.editorconfig')
        );

        this.fs.copyTpl(
            this.templatePath('_eslintignore'),
            this.destinationPath('.eslintignore')
        );

        this.fs.copyTpl(
            this.templatePath('_eslintrc.json'),
            this.destinationPath('.eslintrc.json')
        );

        this.fs.copyTpl(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore')
        );

        this.fs.copyTpl(
            this.templatePath('_jsbeautifyrc'),
            this.destinationPath('.jsbeautifyrc')
        );

        this.fs.copyTpl(
            this.templatePath('_npmrc'),
            this.destinationPath('.npmrc')
        );

        this.fs.copyTpl(
            this.templatePath('_nvmrc'),
            this.destinationPath('.nvmrc')
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'), {
                appname: this.appname,
                clientFolder: this.answers.clientFolder
            }
        );

        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath('README.md'), {
                appname: this.appname
            }
        );

        this.fs.copyTpl(
            this.templatePath('_travis.yml'),
            this.destinationPath('.travis.yml')
        );

        this.fs.copyTpl(
            this.templatePath('_tsconfig.json'),
            this.destinationPath('tsconfig.json'), {
                clientFolder: this.answers.clientFolder
            }
        );
        this.fs.copyTpl(
            this.templatePath('karma.conf.js'),
            this.destinationPath('karma.conf.js')
        );

        this.fs.copyTpl(
            this.templatePath('protractor.conf.js'),
            this.destinationPath('protractor.conf.js')
        );

        this.fs.copyTpl(
            this.templatePath('tslint.json'),
            this.destinationPath('tslint.json')
        );

        this.fs.copyTpl(
            this.templatePath('typedoc.json'),
            this.destinationPath('typedoc.json')
        );

        this.fs.copyTpl(
            this.templatePath('typings.json'),
            this.destinationPath('typings.json')
        );

        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        );



    },

    conflicts: function() {

    },

    install: function() {
        this.npmInstall(null, {
            skipInstall: this.options['skip-install']
        });
    }
});
