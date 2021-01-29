const { promisify } = require('util');

module.exports.clone = async function (repo, desc) {
    const download = promisify(require('download-git-repo'));
    const ora = require('ora');

    const process = ora(`项目下载中 loading…………`);
    process.start();

    await download(repo, desc, { clone: true });

    process.succeed();
};
