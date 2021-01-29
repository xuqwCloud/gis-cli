#!/usr/bin/env node

const program = require('commander');

//定义版本号
program.version(require('./../package.json').version);

//定义项目创建命令
program.command('create').description('create project!').action(require('./../lib/init'));

program.parse(process.argv);
