var jch;
(function (jch) {
    var core = jch.Core;
    var jRegexTester;
    (function (jRegexTester) {
        /**
         * 返回所有匹配结果
         *
         * @export
         * @param {RegExp} reg 正则表达式
         * @param {string} input 输入字符串
         * @returns {RegExpExecArray[]} 返回所有结果
         */
        function matchs(reg, input) {
            if (input === void 0) { input = ""; }
            var result = [];
            var execArr = null;
            reg.lastIndex = 0;
            if (!(reg instanceof RegExp)) {
                throw new Error("Not RegExp");
            }
            if (input.length == 0) {
                return result;
            }
            if (reg.global) {
                while ((execArr = reg.exec(input)) != null) {
                    result.push(execArr);
                    //当正则为一个或多个空匹配，时会导致exec函数死循环
                    if (checkNullArray(execArr)) {
                        break;
                    }
                }
            }
            else {
                result.push(reg.exec(input));
            }
            return result;
            function checkNullArray(arr) {
                var isNull = true;
                $.each(arr, function (i, s) {
                    if (s != null && s.length > 0) {
                        isNull = false;
                        return false;
                    }
                });
                return isNull;
            }
        }
        jRegexTester.matchs = matchs;
        /**
         * 替换字符串
         *
         * @export
         * @param {RegExp} reg 正则表达式
         * @param {string=""} input 输入字符串
         * @param {string=""} replaceStr 替换字符串
         * @param {replaceMode} replacemode 替换模式
         * @returns {string} 返回替换后字符串
         */
        function replace(reg, input, replaceStr, replacemode) {
            if (input === void 0) { input = ""; }
            if (replaceStr === void 0) { replaceStr = ""; }
            if (replacemode === void 0) { replacemode = replaceMode.includeNoMatch; }
            var result = "";
            if (!(reg instanceof RegExp))
                throw new Error("Not RegExp");
            if (input.length == 0)
                return result;
            if (replacemode === replaceMode.includeNoMatch) {
                return input.replace(reg, replaceStr);
            }
            else if (replacemode === replaceMode.excludeNoMatch) {
                input.replace(reg, function (matchStr) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    //若正则为 .(.)(.) ，则函数参数1为整个匹配到的三个字符串，参数2为分组1内容，参数3为分组2内容，参数4为起始位置，参数5为源字符串
                    //若正则为 . ，则函数参数1为整个匹配到的三个字符串，参数4为起始位置，参数5为源字符串
                    //换言之，至少有3个参数，参数1是固定的，为匹配到的字符串，参数倒数第1是源字符串，参数倒数第二位匹配位置，其余中间是分组内容
                    var groups = args.slice(0, args.length - 2);
                    var index = args[args.length - 2];
                    var src = args[args.length - 1];
                    result += matchStr.replace(reg, replaceStr);
                    // console.log(result);
                    return "";
                });
                return result;
            }
        }
        jRegexTester.replace = replace;
        //----------------------工具函数-------------------------------
        /**
         * 获取换行符枚举对应的换行符号
         * @param  {newLineChar} enumNewLine 换行符枚举
         * @returns string
         */
        function getNewLineChar(enumNewLine) {
            switch (enumNewLine) {
                case newLineChar.CRLF: {
                    return "\r\n";
                }
                case newLineChar.CR: {
                    return "\r";
                }
                case newLineChar.LF: {
                    return "\n";
                }
                default: {
                    throw new Error("newLine Enum Error");
                }
            }
        }
        jRegexTester.getNewLineChar = getNewLineChar;
        //------------------------------枚举----------------------------
        /**
         * 正则替换模式
         *
         * @enum {number}
         */
        var replaceMode;
        (function (replaceMode) {
            /**
             * 替换后包含未匹配字符串（默认）
             */
            replaceMode[replaceMode["includeNoMatch"] = 0] = "includeNoMatch";
            /**
             * 替换后不包含未匹配字符串
             */
            replaceMode[replaceMode["excludeNoMatch"] = 1] = "excludeNoMatch";
        })(replaceMode = jRegexTester.replaceMode || (jRegexTester.replaceMode = {}));
        /**
         * jRegexTester的工作模式
         *
         * @enum {number}
         */
        var workMode;
        (function (workMode) {
            /**
             * 匹配查找模式
             */
            workMode[workMode["match"] = 0] = "match";
            /**
             * 替换模式
             */
            workMode[workMode["replace"] = 1] = "replace";
        })(workMode = jRegexTester.workMode || (jRegexTester.workMode = {}));
        /**
         * 换行符枚举
         *
         * @enum {number}
         */
        var newLineChar;
        (function (newLineChar) {
            /**
             * 回车换行\r\n(windows)
             */
            newLineChar[newLineChar["CRLF"] = 0] = "CRLF";
            /**
             * 回车\r(Mac)
             */
            newLineChar[newLineChar["CR"] = 1] = "CR";
            /**
             * 换行\n(Linux)
             */
            newLineChar[newLineChar["LF"] = 2] = "LF";
        })(newLineChar = jRegexTester.newLineChar || (jRegexTester.newLineChar = {}));
        /**
         * 正则表达式选项
         *
         * @enum {number}
         */
        var RegExpOption;
        (function (RegExpOption) {
            /**
             * 全局匹配
             */
            RegExpOption[RegExpOption["global"] = 0] = "global";
            /**
             * 忽略大小写
             */
            RegExpOption[RegExpOption["ignoreCase"] = 1] = "ignoreCase";
            /**
             * 多行模式
             */
            RegExpOption[RegExpOption["multiline"] = 2] = "multiline";
        })(RegExpOption = jRegexTester.RegExpOption || (jRegexTester.RegExpOption = {}));
    })(jRegexTester = jch.jRegexTester || (jch.jRegexTester = {}));
})(jch || (jch = {}));
