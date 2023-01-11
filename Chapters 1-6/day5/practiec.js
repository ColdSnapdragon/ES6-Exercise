console.log("part1------------------------");

let d1 = Date(); //默认当前日期
let d2 = Date('1/8/2023'); //调用Date.parse()，此处为 月/日/年
let d3 = Date('2023 0'); //调用Date.UTC()，此处只有六个参数的前两个，表示 2023年1月1日0时0分0秒
console.log(d1.toString()); //返回字符串表示
console.log(d1.valueOf()); //返回毫秒表示（但怎么还是打印日期字符串）
console.log(typeof d1.valueOf()); //String。看来与书中有出入

let start = Date.now();
//某些操作
let end = Date.now();
console.log(start + ' --> ' + end);

console.log("part2------------------------");

/*
正则表达式练习：https://www.codejiaonang.com/#/course/regex_chapter1/0/0
*/

let pattern1 = /[bc]at/i; //由表达式字面量创建正则表达式对象。忽略大小写
let pattern2 = new RegExp('.at', 'g'); //由构造函数创建对象。全局模式(应该说'全串'，能自动向前匹配)
let pattern3 = /\.\\\\n/; //匹配".\n"，不设标志串(则每次匹配都从0开始，意味着exec返回值永远相同)

let text = 'cat, bat, pat, tat';
let res = pattern2.exec(text); //返回一个特定类型数组
while(res != null){ //若从起始位置开始无法找到，返回null
    console.log(res[0]);
    console.log(res.index); //起始位置
    console.log(pattern2.lastIndex); //结束位置(下一次的开始位置)
    res = pattern2.exec(text);
}

console.log(pattern1.test(text)); //测试是否能模式匹配

console.log("part3------------------------");

let s1 = '123';
s1.name = 'ice'; //创建临时包装类型对象，增添属性，但紧接着又自动销毁
console.log(s1.name); //创建临时包装类型对象，但没有属性name

let s2 = String(123); //这里是转型函数，而非构造函数。创建对象必须有new
console.log(s1 === s2); //true

let s3 = new String('abc'); //构造函数，*显式*地创建String的包装类型对象(非临时)
s3.name = 'ice';
console.log('type: ' + (typeof s3) + '  name: ' + s3.name); //Obiect ice

let s4 = new Object('abc'); //Object()能根据传入值的类型返回相应包装类型对象
s4.name = 'ice';
console.log(s3 == s4); //false。两个对象(的指针)独立

let b1 = new Boolean(false); //建议永远不要使用
console.log(b1 && true); //true。一切对象在布尔表达式中自动转true
console.log(b1 instanceof Boolean); //true

console.log("part4------------------------");

let n1 = 99.125;
console.log(n1.toFixed(2)); //保留两位小数
console.log(n1.toExponential(2)); //9.91e+1。科学计数法，并保留两位小数
console.log(n1.toPrecision(2)); //总位数为2，表示方式自动选择
console.log(Number.isInteger(n1)); //false。不是整数

let str1 = 'ab我de';
let str2 = 'ab😂de';
console.log(str1.length); //Unicode双字节字符(如汉字)按单字符计数
console.log(str2.length); //表情符是两个码元构成的代理对，计两个字符
console.log(str2.charAt(1)); //b。按索引访问字符
console.log(str2.charAt(2)); //�
console.log(str2.charCodeAt(1)); //98 (即'b')
console.log(str2.charCodeAt(2)); //代理对之一的Unicode码
console.log(str2.codePointAt(2)); //完整的码点(代理对共32位)(必须传起始位置)
console.log(str2.codePointAt(3)); //错误

let str3 = 'hello world';
console.log(str3.slice(2,5)); //起始 结束 (左开右闭)
console.log(str3.substring(2,5)); //起始 结束 (左开右闭)
console.log(str3.slice(-4,-2)); //倒数第四 倒数第二
console.log(str3.substring(-4,-2)); //倒数第四 第二参数为负则转0。结果为空串

console.log(str3.indexOf('o')); //4
console.log(str3.lastIndexOf('o')); //7
console.log(str3.includes('llo')); //true
console.log(str3.startsWith('hel')); //true。是前缀
console.log(str3.endsWith('orl', 10)); //true。取前10个字符，orl是该子串的后缀

let str4 = '  abc ae  ';
console.log(str4.trim()); //去掉左右空格
console.log(str4.trimStart()); //去掉左侧空格
console.log(str4.trimEnd()); //去掉右侧空格

let str5 = 'Hi';
console.log(str5.repeat(5)); //自我重复5次
console.log(str5.padStart(4)); //在左侧填2个空格
console.log(str5.padEnd(6,'abc')); //右侧填充字符串，带截断

console.log(str5.toLowerCase()); //转小写
console.log(str5.toUpperCase()); //转大写

for(const ch of str5){ //字符串可迭代访问
    console.log(ch);
}

let str6 = 'cat, bat, pat, tat';

let resArr = str6.match(/[bt]at/); //与RegExp的exec()返回值一致，作用也相同。也可传RegExp对象
let resPos = str6.search(new RegExp('[bt]at')); //功能与match完全相同，除了返回的是匹配位置
console.log(resPos); //5。没查到则得-1

console.log(str6.replace('at', 'xxx')); //替换第一个匹配子串
console.log(str6.replace(/..at/g, 'xxx')); //全体替换 (cat,xxx,xxx,xxx)
console.log(str6.replace(/.*t/, 'xxx')); //xxx
console.log(str6.replace(/([bt]a)t/g, '--It is $1--')); //用当前匹配串的第一个匹配组，作为替换内容的一部分
//cat, --It is ba--, pat, --It is ta--

console.log(str6.split(/[^,]+/)); //分割串：除了','外的字符重复一次以上
//[ '', ',', ',', ',', '' ] 注意如果分割串出现在开头或结尾，返回的数组中会出现空串

let str7 = '1.1 * 2 < 3';
str7 = str7.replace(/[\*><\.]/g, function(match, pos, text){ //传入实参固定，形参自由命名
    switch (match){
        case '*':
            return '\\ast';
        case '.':
            return '\\dot';
        case '<':
            return '\\lt';
        case '>':
            return '\\gt';
    }
}
)
console.log(str7);

console.log("part5------------------------");

let uri = 'https://home.cnblogs.com/u/blover';
//使用URI编码方式进行编码，以便一些浏览器能理解
console.log(encodeURI(uri)); //编码整个uri
console.log(encodeURIComponent(uri)); //编码uri中单独的组件

uri = 'https%3A%2F%2Fhome.cnblogs.com%2Fu%2Fblover'; //由encodeURIComponent()得来
console.log(decodeURIComponent(uri));

console.log("part6------------------------");

let msg1 = 'hello';
eval("console.log(msg1);"); //eval内代码的作用域与eval相同

eval("let msg2 = 'hello';"); //当这个eval被执行时，其代码才真正插入该处
//console.log(msg2); //错误。找不到msg2

eval("function sayHi(){ console.log('Hi'); }");
sayHi(); //js在调用到这个函数时，才去找它的定义，因此不报错

var gb = 'red'; //全局变量(成为Global以及window的属性，前者不能显式访问)
function get(){
    console.log(window.gb);
}
//window.get();
/*这里的运行环境是node.js，window是web浏览器中才有的对象。
  所以在浏览器中才能运行以上代码*/

console.log(Math.max(3,5,4,1,2));

function range(lower, upper){ //取一个[lower,upper]之间的整数
    let num = Math.random()*(upper - lower + 1) + lower; //+1是因为random()取不到1
    return Math.floor(num);
}

for(let i=1; i<=5; ++i){
    console.log(range(2,10));
}