'use strict';
var assert = require('yeoman-assert');
//var helpers = require('yeoman-test');
var testHelper = require('./testHelper');
//var generatorFullname = testHelper.mixins.getGeneratorFullname(); // generator-mcfly-ng2
var generatorShortname = testHelper.mixins.getGeneratorShortname(); // mcfly-ng2

describe(generatorShortname + ':ngux', function() {
    var targetname = 'dashboard';
    var clientFolder = 'client';
    var componentname = 'my dummy';

    var config = testHelper.getYoRc({
        clientFolder: clientFolder
    });

    before(function(done) {
        var self = this;
        testHelper.runGenerator('ngux')
            .withArguments([targetname, componentname])
            .inTmpDir(function(dir) {
                // setting up expected files
                testHelper.createFolderStructure(config, dir, clientFolder, targetname);
            })
            .on('ready', function(generator) {
                self.generator = generator;
            })
            .on('end', done);
    });

    it('creates expected files', function() {
        var pathdir = clientFolder + '/scripts/dashboard/components/my-dummy/';

        var expectedFiles = [
            pathdir + 'myDummy.ts',
            pathdir + 'myDummy.ngux',
            pathdir + 'myDummy.spec.ts'
        ];

        assert.file(expectedFiles);

        var expectedContents = [
            [pathdir + 'myDummy.ts', /export class MyDummy/],
            [pathdir + 'myDummy.ts', /selector: 'MyDummy'/],
            [pathdir + 'myDummy.ts', /require\(\'\.\/ngux\/myDummy\.js\'\);/],
            [pathdir + 'myDummy.spec.ts', /import {MyDummy} from '\.\/myDummy';/],
            [pathdir + 'myDummy.spec.ts', /return tcb.createAsync\(MyDummy\)/],
            [pathdir + 'myDummy.ngux', /ng:Selector="MyDummy"/]

        ];
        assert.fileContent(expectedContents);

    });

    it('exposes valid client targets and client modules', function() {
        var configOptions = this.generator.configOptions;
        var clientModules = configOptions.clientModules;
        var clientTargets = configOptions.clientTargets;
        assert.objectContent(clientModules, ['app', 'common', 'dashboard', 'dummy', 'tata', 'toto']);
        assert.objectContent(clientTargets, ['app', 'tata', 'toto']);
    });
});
