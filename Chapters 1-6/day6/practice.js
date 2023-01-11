
console.log("part1------------------------");

let o1 = {}; //与new Object()等价
o1.name = 'Blover';
let key = 'name';
console.log(o1[key]); //Blover。[]可通过变量访问属性
o1["first name"] = 'ice';
console.log(o1["first name"]); //ice。属性名可以包含非数字字母字符，但需由[]访问

let o2 = {
    a: 1,
    _: Symbol(),
    1: 2, //数值属性名会自动转为字符串
    //可由o2[1]或o2['1']访问
}

let ar1 = Array(2); //指定初始length为2
let ar2 = Array('2'); //不是数值，则length为1
let ar3 = Array(2, '2'); //不止一个，则创建包含这些元素(可不同类型)的数组
let ar4 = [2]; //初始包含2
let ar5 = []; //空Array

ar5 = Array.from('12345'); //从一个可迭代对象中获取元素
console.log(ar5);

let o3 = {
    a: 11,
    1: 22,
    2: 33,
    length: 2
}

ar5 = Array.from(o3); //会尝试根据length，由o2[0]到o2[length-1]获取元素
console.log(ar5); //[ undefined, 22 ]

console.log(Array.isArray(ar5)); //true

console.log("part2------------------------");

let arr1 = ['a','b','c'];

arr1.length = 2; //删除2及以上索引的元素
console.log(arr1[3]); //undefined
arr1.length = 4; //拓展一位(为undefine)
arr1[arr1.length] = 'd'; //添加一个元素。此操作后length会自动更新
arr1[99] = 'z';
console.log(arr1.length); //100。数组中间部分为空位
console.log(arr1[10]); //undefined

let arr2 = ['a','b','c','d','e'];

const it1 = arr2.keys(); //索引的迭代器
const it2 = arr2.values(); //元素的迭代器
const it3 = arr2.entries(); //索引+元素的迭代器

console.log(Array.from(it3)); //[ [ 0, 'a' ], [ 1, 'b' ], [ 2, 'c' ], [ 3, 'd' ],[ 4, 'e' ] ]

arr2.fill(0); //填充为0
arr2.fill(1, 2, 4); //[2,4)填充为1
arr2.fill(2,2,-1); //[2,倒数第一)填充为2

let arr3 = ['1','2','3','4','5','6','7'];

arr3.copyWithin(4, 0, 3); //将[0,3)的元素，把从索引4开始的元素，逐个覆盖
console.log(arr3); //[ '1', '2', '3', '4', '1', '2', '3' ]

console.log(arr3.toString()); //调用每个元素toString()，将它们的结果用分隔串(默认',')拼接
arr3[2] = undefined; //输出数组时会被显示为空串
console.log(arr3.join('##')); //改变分隔串。（1##2####4##1##2##3）

console.log("part3------------------------");

let arr4 = [1, 4, 2, 5];

let cnt = arr4.unshift(10); //在数组头压入10，返回最新长度
console.log(cnt);

arr4.sort().reverse(); //排序后反转
//都返回原数组的引用
console.log(arr4); //[ 5, 4, 2, 10, 1 ] 。sort给每项调用String()转型，再按字典序排序

function cmp(arg1, arg2){
    //return (arg1 >= arg2); 亲测这样无效果
    if(arg1 < arg2) 
        return -1;
    if(arg1 > arg2)
        return 1;
    return 0;
}

console.log(arr4.sort(cmp));

let arr5 = [ 1, 2, 3, 4, 5, 6 ];

console.log(arr5.slice(1,3)); //返回子区间[1,3)
let remov = arr5.splice(1, 2, 'green', 'red'); //从索引2开始，删除1个元素，并插入若干新值
console.log(arr5);
console.log(remov); //返回值是包含被删除元素的数组
arr5.splice(0, 1); //删除第1个元素

let arr6 = [ 1, 2, 3, 4, 2, 6 ];
console.log(arr6.indexOf(2, 4)); //4。从索引4开始寻找2
console.log(arr6.lastIndexOf(2, 4)); //4。从索引4之前(含4在内)寻找2
console.log(arr6.includes(2, 5)); //false。(ES7特有) 从索引5开始寻找2，返回是否成功

//断言函数

console.log("part4------------------------");

//定型数组

console.log("part5------------------------");

//向Map构造函数传入一个可迭代对象(这里为数组)，其中包含表示键值对的二元数组
const m1 = new Map([
    ['key1', 1],
    [1, '2'],
    [[1,2], Symbol('3')]
]);

console.log(m1.has('1')); //flase
console.log(m1.get('1')); //undefined
console.log(m1.size); //3

m1.set(function(){}, 'ice')//set返回映射实例的引用
    .set(1,'3'); //键1已存在，相当于重设其值

console.log(m1.get('1'));

console.log(m1.has(function(){}));  //false。键的匹配遵循对象严格相等
m1.delete([1,2]);
console.log(m1.size); //5。键[1,2]并未被删除(其为引用值)

m1.clear(); //清空映射

let o4 = {
    num: 1
};

let m2 = new Map([
    [o4, 'Hi']
]);

let it4 = m2.entries(); //键值对的迭代器
let it5 = m2.keys(); //键迭代器
let it6 = m2.values(); //值迭代器

for(let key of it5){ //key只是每个键的拷贝
    key.num = 2; //改变键的属性值
    key = 'new'; //不会改变原键
}

console.log(m2.get(o4)); //Hi

let m3 = new Map(it4); //m3是m2的浅复制(连同对象指针)

for(const p of m3.entries()){
    console.log(p); //p是一个二元数组
}

let o6 = new Object();
o6.son = {};

let wm1 = new WeakMap([
    [o6,0], //键必须为引用值
    [{},o6],  /*该弱键由于没有引用，所有当弱映射创建完后会立刻被当垃圾回收
                此时的值(o6的副本)由于失去了键，也会被回收*/
    [o6.son,'']
])

o6.son = null; //导致wm1中的一个弱键失去引用，被回收
{
    let o7 = new Object();
    wm1.set(o7, 1);
}

console.log(wm1.get(o6)); //0
console.log(wm1.size); //undefined。WeakMap没有size属性
//WeakMap不可迭代。也没有clear方法

console.log("part6------------------------");

let st1 = new Set([
    {},[],'',function(){}
]);

st1.add(1)
    .add(1);
console.log(st1.size); //5。重复值只存在一个
console.log(st1.delete(1)); //true。返回是否有该值，有则删除

for(let v of st1){ //迭代
    console.log(v);
}

//WeakSet基本与WaekMap相同，其保存一组弱值，同样不可迭代
let ws1 = new WeakSet([
    [],{},o1,o2,o3
]);
//ws1实际只剩3个元素
/* Error
for(let v of ws1){
    console.log(v);
}
*/

console.log("part7------------------------");

//迭代与拓展操作