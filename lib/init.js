const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk');
const { clone } = require('./download');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const stat = fs.stat;

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

/*
 * 复制目录中的所有文件包括子目录
 * @param{ string } 需要复制的目录
 * @param{ string } 复制到指定的目录
 */
const copy = function (src, dst) {
    // 同步写法
    // 读取目录中的所有文件/目录
    let result = fs.readdirSync(src);

    result.forEach(function (path) {
        let _src = src + '/' + path,
            _dst = dst + '/' + path,
            readable,
            writable;
        let st = fs.statSync(_src);
        if (st) {
            // 判断是否为文件
            if (st.isFile()) {
                // 创建读取流
                readable = fs.createReadStream(_src);
                // 创建写入流
                writable = fs.createWriteStream(_dst);
                // 通过管道来传输流
                readable.pipe(writable);
            } else if (st.isDirectory()) {
                // 如果是目录则递归调用自身
                createProject(_src, _dst, copy);
            }
        } else {
            console.log(chalk.red('read file status error!'));
            throw st;
        }
    });

    // 异步写法
    // 读取目录中的所有文件/目录
    // fs.readdir(src, function (err, paths) {
    //     if (err) {
    //         throw err;
    //     }
    //     paths.forEach(function (path) {
    //         let _src = src + '/' + path,
    //             _dst = dst + '/' + path,
    //             readable,
    //             writable;
    //         stat(_src, function (err, st) {
    //             if (err) {
    //                 throw err;
    //             }
    //             // 判断是否为文件
    //             if (st.isFile()) {
    //                 // 创建读取流
    //                 readable = fs.createReadStream(_src);
    //                 // 创建写入流
    //                 writable = fs.createWriteStream(_dst);
    //                 // 通过管道来传输流
    //                 readable.pipe(writable);
    //             }
    //             // 如果是目录则递归调用自身
    //             else if (st.isDirectory()) {
    //                 createProject(_src, _dst, copy);
    //             }
    //         });
    //     });
    // });
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
const createProject = function (src, dst, callback) {
    // 同步写法
    let floderStatus = fs.existsSync(dst);
    if (floderStatus) {
        //目录已存在
        callback(src, dst);
    } else {
        //目录不存在
        fs.mkdirSync(dst);
        callback(src, dst);
    }

    // 异步写法
    // fs.exists(dst, function (exists) {
    //     // 已存在
    //     if (exists) {
    //         callback(src, dst);
    //     }
    //     // 不存在
    //     else {
    //         fs.mkdir(dst, function () {
    //             callback(src, dst);
    //         });
    //     }
    // });
};

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
            if (answer.state === 'vue') {
                //创建vue项目模版
                log(`>>>>>> 创建vuemap项目 ${answer.name}`);

                // 从模版创建项目
                const process = ora(`项目创建中 ->->->-> Loading…………`);
                process.start();
                createProject(path.join(__dirname, './../templates/vuemap'), answer.name, copy);
                process.text = `项目创建完成 ->->->-> Successed！`;
                process.succeed();

                // 从github拉取项目
                // await clone('https://github.com:xuqwCloud/vuemap#main', answer.name);

                // //自动安装依赖
                // log(`>>>>>> 安装依赖`);
                // await npmRun(['install'], answer.name);

                log(`
>>>>>> 项目创建成功！！！
>>>>>> 按如下命令启动项目

To get start:
=====================

    cd ${answer.name}
    npm install
    npm run serve

=====================
                `);
            } else if (answer.state === 'react') {
                //创建react项目模版
                log(`>>>>>> 创建reactmap项目 ${answer.name}`);

                // 从模版创建项目
                const process = ora(`项目创建中 Loading…………`);
                process.start();
                createProject(path.join(__dirname, './../templates/reactmap'), answer.name, copy);
                process.text = `项目创建完成 ->->->-> Successed！`;
                process.succeed();

                // 从github拉取项目
                //await clone('https://github.com:xuqwCloud/reactmap#main', answer.name);

                // //自动安装依赖
                // log(`>>>>>> 安装依赖`);
                // await npmRun(['install'], answer.name);

                log(`
>>>>>> 项目创建成功！！！
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
