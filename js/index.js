$(function () {
    var jrt = jch.jRegexTester;
    var $tbReg = $("#tbReg");
    var $tbInput = $("#tbInput");
    var $tbReplace = $("#tbReplace");
    var $tbOutput = $("#tbOutput");
    var $copyLink = $('#copyLink');
    var cmReg = null;
    var cmInput = null;
    var cmReplace = null;
    var cmOutput = null;
    var workMode = jrt.workMode.match;
    var replaceMode = jrt.replaceMode.includeNoMatch;
    var newLineChar = jrt.newLineChar.CRLF;
    var RegExpOption = "g";
    init();
    function init() {
        bind();
        changeWorkMode(jrt.workMode.match);
        var queryObj = jch.Core.getQueryObject();
        if (jch.Core.isString(queryObj.reg)) {
            $tbReg.val(decodeURIComponent(queryObj.reg));
        }
        if (jch.Core.isString(queryObj.input)) {
            $tbInput.val(decodeURIComponent(queryObj.input));
        }
        if (jch.Core.isString(queryObj.replace)) {
            $tbReplace.val(decodeURIComponent(queryObj.replace));
        }
        // $tbReg.val("([^?&=]+)=([^?&=]*)");
        // $tbInput.val("https://www.google.com.hk/search?q=CodeMirror&aqs=chrome&sourceid=chrome&es_sm=91&ie=UTF-8");
        // $tbReplace.val("\"$1\":\"$2\",\r\n");
        // cmReg = CodeMirror.fromTextArea(<HTMLTextAreaElement>$tbReg.get(0), {
        //     mode: "javascript",
        // });
        // cmReg.setValue("function xx(a){return 0;}");
        // cmInput = CodeMirror.fromTextArea(<HTMLTextAreaElement>$tbInput.get(0));
        // cmReplace = CodeMirror.fromTextArea(<HTMLTextAreaElement>$tbReplace.get(0));
        // cmOutput = CodeMirror.fromTextArea(<HTMLTextAreaElement>$tbOutput.get(0));
        //-----
        run();
    }
    function bind() {
        //输入自动运行
        $tbReg.add($tbInput).add($tbReplace).bind("change input", function (e) {
            run();
        });
        //手动运行
        $("#btnRun").click(function (e) {
            run();
        });
        //修改工作模式
        $("input[name='workMode']").change(function (e) {
            changeWorkMode($("input[name='workMode']:checked").val());
            run();
        });
        //修改替换模式
        $("input[name='replaceMode']").change(function (e) {
            replaceMode = Number($("input[name='replaceMode']:checked").val());
            run();
        });
        //修改换行符
        $("input[name='newLineChar']").change(function (e) {
            newLineChar = Number($("input[name='newLineChar']:checked").val());
            run();
        });
        //修改正则选项
        $("input[name='RegExpOption']").change(function (e) {
            var $ipt = $(this);
            var val = $ipt.val();
            RegExpOption = RegExpOption.replace(val, "");
            RegExpOption += $ipt.prop("checked") ? val : "";
            run();
        });
        //将输出内容导入输入内容框
        $("#btnOutputToInput").click(function (e) {
            $tbInput.val($tbOutput.val());
            run();
        });
        //将输入字符串调用decodeURIComponent解码
        $("#btnDecodeURI").click(function (e) {
            $tbInput.val(decodeURIComponent($tbInput.val()));
        });
        //将输入字符串当做base64进行解码
        $("#btnDecodeBase64").click(function (e) {
            // window.btoa();// base64编码
            try {
                $tbInput.val(window.atob($tbInput.val()));
            }
            catch (e) {
                alert('当前不是一个合法base64字符串');
            }
        });
        $copyLink.click(function () {
            var reg = encodeURIComponent($tbReg.val());
            var replace = encodeURIComponent($tbReplace.val());
            var str = location.origin + location.pathname + "?reg=" + reg + "&replace=" + replace;
            jch.Core.copyToClipboard(str);
        });
    }
    function run() {
        var txtReg = $tbReg.val();
        var txtInput = $tbInput.val();
        var txtReplace = $tbReplace.val();
        var reg = valiInputReg($tbReg, RegExpOption);
        var outputResult = "";
        var matchArr = [];
        if (txtReg.length == 0 || txtInput.length == 0) {
            return;
        }
        if (!(reg instanceof RegExp)) {
            return valiOutput(false);
        }
        if (workMode === jrt.workMode.match) {
            matchArr = jch.jRegexTester.matchs(reg, txtInput);
            if (matchArr.length == 0) {
                return valiOutput(false);
            }
            $.each(matchArr, function (i, match) {
                if (!(match instanceof Array)) {
                    return true;
                }
                outputResult += match[0] + (i == matchArr.length - 1 ? "" : jrt.getNewLineChar(newLineChar));
            });
        }
        else if (workMode === jrt.workMode.replace) {
            outputResult = jch.jRegexTester.replace(reg, txtInput, txtReplace, replaceMode);
        }
        valiOutput(outputResult);
    }
    /**
     * 变更工作模式
     * @param  {jch.jRegexTester.workMode} wm 目标工作模式
     * @returns void
     */
    function changeWorkMode(wm) {
        workMode = Number(wm);
        var $row = $tbReplace.parents(".row");
        if (workMode === jrt.workMode.match) {
            $row.hide(0);
        }
        else if (workMode === jrt.workMode.replace) {
            $row.show(0);
        }
    }
    /**
     * 校验正则表达式输入框输入的正则是否正确，返回正则对象
     *
     * @param {JQuery} $textarea 文本框的DOM对象
     * @param {string} regOption 正则表达式选项
     * @param {string} parentSelector 增加样式的父级选择器
     * @returns {RegExp} (description)
     */
    function valiInputReg($textarea, regOption, parentSelector) {
        if (regOption === void 0) { regOption = ""; }
        if (parentSelector === void 0) { parentSelector = ".form-group"; }
        var txt = $textarea.val();
        var $form = $textarea.parents(parentSelector).eq(0);
        var reg = null;
        if (txt.length == 0) {
            return reg;
        }
        try {
            reg = new RegExp(txt, regOption);
            $form.removeClass("has-error");
        }
        catch (ex) {
            $form.addClass("has-error");
        }
        return reg;
    }
    function valiOutput(outputText) {
        var $parent = $tbOutput.parents(".form-group").eq(0);
        if (typeof outputText === "boolean" && outputText === false) {
            $tbOutput.val("");
            $parent.addClass("has-error");
        }
        else if (typeof outputText === "string") {
            $tbOutput.val(outputText);
            $parent.removeClass("has-error");
        }
    }
});
