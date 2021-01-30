const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk');
const { clone } = require('./download');
const inquirer = require('inquirer');

//定义打印方法
const log = (content) => console.log(chalk.green(content));

//运行命令行
const npmRun = async (args, name) => {
    return new Promise((resolve) => {
        const runner = require('child_process').spawn('npm.cmd', args, {
            stdio: 'inherit',
            cwd: name,
        });
        runner.on('close', function () {
            resolve();
        });
    });
};

//交互命令
const question = [
    {
        name: 'conf',
        type: 'confirm',
        message: '是否创建新项目？',
    },
    {
        name: 'name',
        message: '请输入项目名称：',
        when: (res) => Boolean(res.conf),
    },
    {
        type: 'list',
        message: '请选择项目框架：',
        name: 'state',
        choices: ['Vue', 'React'],
        filter: function (val) {
            return val.toLowerCase();
        },
        when: (res) => Boolean(res.conf),
    },
];

module.exports = async () => {
    //打印欢迎界面
    clear();
    const data = await figlet('Welcome to CDMAP');
    log(data);

    //终端交互
    log(`>>>>>> 项目配置`);
    inquirer
        .prompt(question)
        .then(async (answer) => {
            console.log(answer.name);
            if (answer.state === 'vue') {
                //拉取vue项目模版
                log(`>>>>>> 创建vuemap项目 ${answer.name}`);
                await clone('https://github.com:xuqwCloud/vuemap#main', answer.name);

                // //自动安装依赖
                // log(`>>>>>> 安装依赖`);
                // await npmRun(['install'], answer.name);

                log(`
>>>>>> 依赖安装完成
>>>>>> 按如下命令启动项目

To get start:
=====================

    cd ${answer.name}
    npm install
    npm run serve

=====================
                `);
            } else if (answer.state === 'react') {
                //拉取react项目模版
                log(`>>>>>> 创建reactmap项目 ${answer.name}`);
                await clone('https://github.com:xuqwCloud/reactmap#main', answer.name);

                // //自动安装依赖
                // log(`>>>>>> 安装依赖`);
                // await npmRun(['install'], answer.name);

                log(`
>>>>>> 依赖安装完成
>>>>>> 按如下命令启动项目

To get start:
=====================

    cd ${answer.name}
    npm install
    npm start

=====================
            `);
            }
        })
        .catch((err) => {
            console.log(`错误原因：${err}`);
        });
};
