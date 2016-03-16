
$(function() {
    var jrt = jch.jRegexTester;
    var $tbReg: JQuery = $("#tbReg");
    var $tbInput: JQuery = $("#tbInput");
    var $tbReplace: JQuery = $("#tbReplace");
    var $tbOutput: JQuery = $("#tbOutput");

    var cmReg: CodeMirror.EditorFromTextArea = null;
    var cmInput: CodeMirror.EditorFromTextArea = null;
    var cmReplace: CodeMirror.EditorFromTextArea = null;
    var cmOutput: CodeMirror.EditorFromTextArea = null;

    var workMode: jch.jRegexTester.workMode = jrt.workMode.match;
    var replaceMode: jch.jRegexTester.replaceMode = jrt.replaceMode.includeNoMatch;
    var newLineChar: jch.jRegexTester.newLineChar = jrt.newLineChar.CRLF;
    var RegExpOption: string = "g";

    init();
    function init(): void {
        bind();
        changeWorkMode(jrt.workMode.match);
        $tbReg.val("([^?&=]+)=([^?&=]*)");
        $tbInput.val("https://www.google.com.hk/search?q=CodeMirror&aqs=chrome&sourceid=chrome&es_sm=91&ie=UTF-8");
        $tbReplace.val("\"$1\":\"$2\",\r\n");

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

    function bind(): void {
        //输入自动运行
        $tbReg.add($tbInput).add($tbReplace).bind("change input", function(e) {
            run();
        });

        //手动运行
        $("#btnRun").click(function(e) {
            run();
        });

        //修改工作模式
        $("input[name='workMode']").change(function(e) {
            changeWorkMode($("input[name='workMode']:checked").val());
            run();
        });

        //修改替换模式
        $("input[name='replaceMode']").change(function(e) {
            replaceMode = Number($("input[name='replaceMode']:checked").val());
            run();
        });

        //修改换行符
        $("input[name='newLineChar']").change(function(e) {
            newLineChar = Number($("input[name='newLineChar']:checked").val());
            run();
        });

        //修改正则选项
        $("input[name='RegExpOption']").change(function(e) {
            var $ipt = $(this);
            var val = $ipt.val();
            RegExpOption = RegExpOption.replace(val, "");
            RegExpOption += $ipt.prop("checked") ? val : "";
            run();
        });

        //将输出内容导入输入内容框
        $("#btnOutputToInput").click(function(e) {
            $tbInput.val($tbOutput.val());
            run();
        });
    }

    function run(): void {
        var txtReg: string = $tbReg.val();
        var txtInput: string = $tbInput.val();
        var txtReplace: string = $tbReplace.val();
        var reg: RegExp = valiInputReg($tbReg, RegExpOption);
        var outputResult: string = "";
        var matchArr: RegExpExecArray[] = [];

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
            $.each(matchArr, function(i: number, match: RegExpExecArray) {
                if (!(match instanceof Array)) {
                    return true;
                }
                outputResult += match[0] + (i == matchArr.length - 1 ? "" : jrt.getNewLineChar(newLineChar));
            });
        } else if (workMode === jrt.workMode.replace) {
            outputResult = jch.jRegexTester.replace(reg, txtInput, txtReplace, replaceMode);
        }
        valiOutput(outputResult);
    }

    /**
     * 变更工作模式
     * @param  {jch.jRegexTester.workMode} wm 目标工作模式
     * @returns void
     */
    function changeWorkMode(wm: jch.jRegexTester.workMode): void {
        workMode = Number(wm);
        var $row = $tbReplace.parents(".row");
        if (workMode === jrt.workMode.match) {
            $row.hide(0);
        } else if (workMode === jrt.workMode.replace) {
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
    function valiInputReg($textarea: JQuery, regOption: string = "", parentSelector: string = ".form-group"): RegExp {
        var txt: string = $textarea.val();
        var $form: JQuery = $textarea.parents(parentSelector).eq(0);
        var reg: RegExp = null;
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

    function valiOutput(outputText: string | boolean) {
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