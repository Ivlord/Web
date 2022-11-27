console.log('General purpose String/Set/Array methods. v3.1 - by Ivlord')
String.prototype.mod = function(strKey = null, num = '', get = false) {
    if (strKey===null) return this.replace(/ +/g, ' ').trim()
    let regexp=RegExp(`(\\s|^)${strKey}-?(\\d*\\.?)*(?=\\s|$)`,'g')
    if (num===null) return this.replace(regexp,'')
    if (get){
        let res=this.match(regexp)
        return (res===null||!Number.isInteger(num)||num<0||num>=res.length)?
            null:+res[num].slice(strKey.length)
    }
    return this+(this?' ':'')+strKey+num
}
Array.prototype.sample=function(samplesNumber){
    let arrCopy=[...this],res=[]
    for (let i=samplesNumber;i>0&arrCopy.length>0;i--){
        res.push(...arrCopy.splice(Math.floor(Math.random()*arrCopy.length),1))
    } return res }
Array.prototype.clone=function(){return this.map(val=>Array.isArray(val)?val.clone():val)}
Array.prototype.off=function(off=[0,0]){return (this.length!=2 || off.length!=2)?[]:[this[0]+off[0],this[1]+off[1]]}
Array.prototype.dup=function(){return Array.from(new Set(this))}
Array.prototype.andx=function(arr2=[]){
if (!this.length || !arr2.length) return [];let a,b;
if (this.length<arr2.length){a=this.dup();b=arr2;}
else {b=this;a=arr2.dup();}
return a.filter(val=>b.includes(val))}
Array.prototype.orx=function(arr2=[]){return Array.from(new Set([...this,...arr2]))}
Array.prototype.difx=function(arr2=[]){return this.dup().filter(val=>!arr2.includes(val))}
Array.prototype.xorx=function(arr2=[]){return this.difx(arr2).concat(arr2.difx(this))}
Set.prototype.andx=function(set2=new Set()){
const res=new Set()
if (!this.size || !set2.size) return res
let a,b;if (this.size<set2.size){a=this;b=set2;}
else {a=set2;b=this;}
a.forEach(val=>{if (b.has(val)) res.add(val)});return res}
Set.prototype.orx=function(set2=new Set()){return new Set([...this,...set2])}
Set.prototype.difx=function(set2=new Set()){const res=new Set();this.forEach(val=>{if (!set2.has(val)) res.add(val)});return res;}
Set.prototype.xorx=function(set2=new Set()){return this.difx(set2).orx(set2.difx(this))}
