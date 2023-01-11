function fun(obj){ //函数传参只有按值传递，对于引用值也只是复制了实参的指针
    obj.name = 'ice';
    obj = new Object();
    obj.name = 'blover';
}

let t = new Object();
t.name = 'grass'; //对引用值动态添加属性
fun(t);
console.log(t.name);

console.log('num is ' + num); //num已声明，但未初始化
var num = 1;

var color = 'blue';
function col(){
    let color = 'yello';
    {
        let color = 'green';
        console.log(color); 
    }
}
col(); //green

console.log(color instanceof String); //false。String不是引用类型，始终得false
console.log(t instanceof Object); //true。t是一个引用值，所有引用值都是Object的实例