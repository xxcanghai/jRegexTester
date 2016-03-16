namespace jch {
    const core = jch.Core;
    export module jRegexTester {

        /**
         * 返回所有匹配结果
         * 
         * @export
         * @param {RegExp} reg 正则表达式
         * @param {string} input 输入字符串
         * @returns {RegExpExecArray[]} 返回所有结果
         */
        export function matchs(reg: RegExp, input: string = ""): RegExpExecArray[] {
            var result: RegExpExecArray[] = [];
            var execArr: RegExpExecArray = null;
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
            } else {
                result.push(reg.exec(input));
            }

            return result;

            function checkNullArray(arr: string[]) {
                var isNull: boolean = true;
                $.each(arr, function(i: number, s: string) {
                    if (s != null && s.length > 0) {
                        isNull = false;
                        return false;
                    }
                });
                return isNull;
            }
        }


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
        export function replace(reg: RegExp, input: string = "", replaceStr: string = "", replacemode: replaceMode = replaceMode.includeNoMatch): string {
            var result: string = "";

            if (!(reg instanceof RegExp)) throw new Error("Not RegExp");
            if (input.length == 0) return result;

            if (replacemode === replaceMode.includeNoMatch) {
                return input.replace(reg, replaceStr);
            }
            else if (replacemode === replaceMode.excludeNoMatch) {
                input.replace(reg, (matchStr: string, ...args: any[]) => {
                    //若正则为 .(.)(.) ，则函数参数1为整个匹配到的三个字符串，参数2为分组1内容，参数3为分组2内容，参数4为起始位置，参数5为源字符串
                    //若正则为 . ，则函数参数1为整个匹配到的三个字符串，参数4为起始位置，参数5为源字符串
                    //换言之，至少有3个参数，参数1是固定的，为匹配到的字符串，参数倒数第1是源字符串，参数倒数第二位匹配位置，其余中间是分组内容
                    var groups: string[] = args.slice(0, args.length - 2);
                    var index = args[args.length - 2];
                    var src = args[args.length - 1];
                    result += matchStr.replace(reg, replaceStr);
                    // console.log(result);

                    return "";
                });
                return result;
            }
        }


        //----------------------工具函数-------------------------------

        /**
         * 获取换行符枚举对应的换行符号
         * @param  {newLineChar} enumNewLine 换行符枚举
         * @returns string
         */
        export function getNewLineChar(enumNewLine: newLineChar): string {
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
        //------------------------------枚举----------------------------

        /**
         * 正则替换模式
         * 
         * @enum {number}
         */
        export enum replaceMode {
            /**
             * 替换后包含未匹配字符串（默认）
             */
            includeNoMatch = 0,
            /**
             * 替换后不包含未匹配字符串
             */
            excludeNoMatch
        }


        /**
         * jRegexTester的工作模式
         * 
         * @enum {number}
         */
        export enum workMode {

            /**
             * 匹配查找模式
             */
            match = 0,
            /**
             * 替换模式
             */
            replace = 1
        }

        /**
         * 换行符枚举
         * 
         * @enum {number}
         */
        export enum newLineChar {
            /**
             * 回车换行\r\n(windows)
             */
            CRLF = 0,
            /**
             * 回车\r(Mac)
             */
            CR,
            /**
             * 换行\n(Linux)
             */
            LF
        }

        /**
         * 正则表达式选项
         * 
         * @enum {number}
         */
        export enum RegExpOption {
            /**
             * 全局匹配
             */
            global = 0,

            /**
             * 忽略大小写
             */
            ignoreCase,

            /**
             * 多行模式
             */
            multiline
        }
    }
}
