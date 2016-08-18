/**
 * Created by zppro on 16-8-15.
 *
 * angular-box-input —— This lib is the for box-input.
 *
 * Author: @zppro
 * Website: https://github.com/zppro
 * License: GPL-2.0
 *
 */
(function() {
    'use strict';
    var jqLite = angular.element;
    angular
        .module('zp.uiModule', [])
        .service('IDNo2Utils',IDNo2Utils)
        .service('ViewUtils', ViewUtils)
        .directive('idNo2',idNo2)
        .directive('extractSex',extractSex)
        .directive('extractBirthday',extractBirthday)
        .directive('boxInput',boxInput)
    ;
    
    function IDNo2Utils(){
        return {
            isIDNo: isIDNo,
            extractSex: extractSex,
            extractBirthday: extractBirthday
        };

        /*
         根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
         地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
         出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
         顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
         校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

         出生日期计算方法。
         15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
         2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
         下面是正则表达式:
         出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
         身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
         15位校验规则 6位地址编码+6位出生日期+3位顺序号
         18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

         校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
         公式(1)中：
         i----表示号码字符从由至左包括校验码在内的位置序号；
         ai----表示第i位置上的号码字符值；
         Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
         i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
         Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

         */
        //身份证号合法性验证
        //18位身份证号
        //支持地址编码、出生日期、校验位验证
        // example:
        // var c = '130981199312253466';
        // var res= isIDNo(c);
        function isIDNo(code) {
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;

            //if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
            if(!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)){
                tip = "身份证号格式错误";
                pass = false;
            }

            else if(!city[code.substr(0,2)]){
                tip = "地址编码错误";
                pass = false;
            }
            else {
                //18位身份证需要验证最后一位校验位
                if (code.length == 18) {
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                    //校验位
                    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != code[17].toUpperCase()) {
                        tip = "校验位错误";
                        pass = false;
                    }
                }
                else {
                    pass = false;
                }
            }
            return pass;
        }

        function extractSex(idNo) {
            if (isIDNo(idNo)) {
                return idNo.charAt(16) % 2 ? 'M' : 'F'
            }
            return 'N';
        }

        function extractBirthday(idNo) {
            if (isIDNo(idNo)) {
                return idNo.substr(6, 4) + '-' + idNo.substr(10, 2) + '-' + idNo.substr(12, 2);
            }
            return '';
        }
    }

    function ViewUtils() {
        return {
            vinput: vinput
        };
        function vinput(form, name, type) {
            var input = form[name];
            if(!input){
                return true;
            }
            return (input.$dirty || form.$submitted) && input.$error[type];
        }
    }

    idNo2.$inject = ['IDNo2Utils'];
    function idNo2(IDNo2Utils){
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.IDNo = function (value) {
                if(!value){
                    return true;
                }
                var ret = false;

                ret = IDNo2Utils.isIDNo(value);

                var option = scope.$eval(attrs.idNo2) || {};
                if(option.successEvent && ret) {
                    scope.$emit('idNo2:parseSuccess', value);
                }

                return ret;
            };
        }
    }

    extractSex.$inject = ['IDNo2Utils'];
    function extractSex(IDNo2Utils) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.extractSex, function (newValue, oldValue) {
                var radioValue = scope.$eval(attrs.ngValue);
                if (newValue) {
                    if (radioValue == IDNo2Utils.extractSex(newValue)) {
                        scope.$eval(attrs.ngModel + '="' + radioValue + '"');
                    }
                }
                else {
                    if (radioValue == 'N') {
                        scope.$eval(attrs.ngModel + '="' + radioValue + '"');
                    }
                }
            });
        }
    }

    extractBirthday.$inject = ['IDNo2Utils'];
    function extractBirthday(IDNo2Utils) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch(attrs.extractBirthday, function (newValue, oldValue) {
                if (newValue) {
                    var dateStr = IDNo2Utils.extractBirthday(newValue);
                    scope.$eval(attrs.ngModel + '="' + dateStr + '"');
                }
                else {
                    scope.$eval(attrs.ngModel + '=""');
                }
            });
        }
    }

    boxInput.$inject = ['$timeout'];
    function boxInput($timeout){

        function setCaretPosition(elem, caretPos) {
            if (elem !== null) {
                if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    if (elem.setSelectionRange) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    } else{
                        elem.focus();
                    }

                }
            }
        }

        function showValue(val,$spanArray,inputType,tip) {
            //console.log(tip);
            var valLength = Number(val.length);
            for (var i = 0; i < valLength; i++) {
                var $span = $spanArray.eq(i);
                if (inputType == 'password') {
                    $span.html('·');
                }
                else {
                    $span.html(val[i]);
                }
            }
        }

        function unbindEvents(element) {
            element.parent('.virbox').off('click');
            element
                .off('blur')
                .off('keyup')
                .off('keydown');
        }

        function bindEvents(scope,element,inputType) {
            element.parent('.virbox')
                .on('click', function () {
                    var $input = jqLite(this).find('.realbox');

                    $input.focus();

                    jqLite(this).find('span').addClass('focus');
                    setCaretPosition($input[0], Number($input.val().length));
                });

            element
                .on('blur', function () {
                    jqLite(this).parent('.virbox').find('span').removeClass('focus');
                })
                .on('keyup', function (event) {
                    var $spanArray = jqLite(this).parent('.virbox').find('span');
                    $spanArray.html('');
                    var val = jqLite(this).val();
                    showValue(val, $spanArray, inputType, 'keyup');
                })
                .on('keydown', function (event) {
                    if (event.which == 46) {
                        //清空
                        jqLite(this).val('');
                        var $spanArray = jqLite(this).parent('.virbox').find('span');
                        $spanArray.html('');
                        $timeout(function () {
                            scope.value = '';
                        });
                    }
                    else if (event.which == 8) {
                        var $spanArray = jqLite(this).parent('.virbox').find('span').html('');
                        var self = this;
                        $timeout(function () {
                            var val = jqLite(self).val();
                            showValue(val, $spanArray, inputType, 'keydown');
                        });
                    }

                    if (event.which >= 35 && event.which <= 40) {

                        return false;
                    }
                    if (inputType == 'number' && (event.which < 48 || event.which > 57)) {
                        return false;
                    }

                    return true;
                });
        }


        var directive = {
            link: link,
            restrict: 'A',
            scope: {value: '=ngModel',readonly:'=boxReadonly'}
        };
        return directive;

        function link(scope, element, attrs) {

            var length = attrs.maxlength || 6;
            var arrVirboxSpan = [];
            var inputType = attrs.type.toLowerCase();
            for(var i=0;i<length;i++) {
                arrVirboxSpan.push('<span></span>')
            }
            element.addClass('realbox').wrap('<div class="virbox"></div>');
            jqLite(arrVirboxSpan.join('')).insertAfter(element);

            if(!scope.readonly){
                bindEvents(scope,element,inputType);
            }
            else{
                unbindEvents(element);
            }

            scope.$watch('value', function (newValue, oldValue) {
                showValue(element.val(),element.parent('.virbox').find('span'),inputType,'watch-value');
            });

            scope.$watch('readonly', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    console.log('lll');
                    console.log('newValue:' + newValue);
                    console.log('oldValue:' + oldValue);
                    if (!newValue) {
                        bindEvents(scope,element, inputType);
                    }
                    else {
                        unbindEvents(element);
                    }
                }
            });
            //console.log(element.val());

        }
    }

})();