/**
 * @Author: MaxTan
 * @Description: wonders构建入口文件
 * @Date: 2019/12/16 17:13:52
 */
const base64Conf = require('./build/config/base64.config');
const tohtmlConf = require('./build/config/tohtml.config');
const iconfontConf = require('./build/config/iconfont.config');
const ntsRouterConf = require('./build/config/nts-router.config');
const calendarConf = require('./build/config/calendar.config');
exports.base64Dev = base64Conf.devTask;
exports.base64Build = base64Conf.buildTask;
exports.tohtmlDev = tohtmlConf.devTask;
exports.tohtmlBuild = tohtmlConf.buildTask;
exports.iconfontDev = iconfontConf.devTask;
exports.iconfontBuild = iconfontConf.buildTask;
exports.ntsRouterDev = ntsRouterConf.devTask;
exports.ntsRouterBuild = ntsRouterConf.buildTask;
exports.calendarDev = calendarConf.devTask;
exports.calendarBuild = calendarConf.buildTask;