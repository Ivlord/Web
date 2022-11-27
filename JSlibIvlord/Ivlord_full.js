//console.log('General purpose String and Array methods. v3.1 - by Ivlord')

// Adds, removes or gets key\numeric data from the String by a key substring.
// - removes all leading, ending and multi-spaces inside the string
// - null, any - Removes all leading, ending and multi-spaces inside the string
// - strKey, null  - remove all wrd-substring occurrences in the String
// - strKey, value, false - add a wrd+value at the end. ('' or 0 for nothing)
// - strKey, resultIndex, true - return numeric value of the key
String.prototype.mod = function(strKey = null, num = '', get = false) {
    if (strKey === null) return this.replace(/ +/g, ' ').trim()
    let regexp = RegExp(`(\\s|^)${strKey}-?(\\d*\\.?)*(?=\\s|$)`,'g')
    if (num === null) return this.replace(regexp,'')
    if (get) {
        let res = this.match(regexp)
        return (res===null || !Number.isInteger(num) || num<0 || num>=res.length)?
            null : +res[num].slice(strKey.length)
    }
    return this + (this? ' ' : '') + strKey + num
}

// Python list.sample(n). Return n unique items
Array.prototype.sample = function(samplesNumber) {
    let arrCopy = [...this], res = []
    for (let i = samplesNumber; i > 0 & arrCopy.length > 0; i--){
        res.push(...arrCopy.splice( Math.floor( Math.random() * arrCopy.length ), 1))
    }
    return res
}

// Deep array copy recursion method
Array.prototype.clone = function (){
    return this.map(val => Array.isArray(val)? val.clone():val)
}

// Point offset correction method
Array.prototype.off = function(off = [0,0]) {
    return (this.length != 2 || off.length != 2)? [] : [this[0]+off[0], this[1]+off[1]]
}// Ex: [5,7].off([1,3]) = [6,10]

Array.prototype.dup = function() { // remove duplicated items
    return Array.from(new Set(this))
}

Array.prototype.andx = function(arr2 = []) { // this & arr = intersection
    if (!this.length || !arr2.length) return []
    let a, b
    if (this.length < arr2.length) { a = this.dup(); b = arr2; }
    else { b = this; a = arr2.dup(); }
    return a.filter(val => b.includes(val) )
}// Ex: [1,2,3,4] & [1,2,5,6] = [1,2]

Array.prototype.orx = function(arr2 = []) {  // this | arr = union
    return Array.from(new Set([...this, ...arr2]))
    //return this.dup().concat( arr2.filter( val => !this.includes(val) ) )
} // Ex: [1,2,3,4] | [1,2,5,6] = [1,2,3,4,5,6]

Array.prototype.difx = function(arr2 = []) { // this - arr = difference
    return this.dup().filter( val => !arr2.includes(val) )
}// Ex: [1,2,3,4] - [1,2,5,6] = [3,4]

Array.prototype.xorx = function(arr2 = []) { // this ^ arr = symmetric difference
    return this.difx(arr2).concat( arr2.difx(this) )
}// Ex: [1,2,3,4] ^ [1,2,5,6] = [3,4,5,6]

Set.prototype.andx = function (set2 = new Set()){ // this & set = intersection
    const res = new Set()
    if (!this.size || !set2.size) return res
    let a,b
    if (this.size < set2.size){ a = this; b = set2; }
    else { a = set2; b = this; }
    a.forEach(val => {
        if (b.has(val)) res.add(val)
    } )
    return res
}

Set.prototype.orx = function (set2 = new Set()){   // this | set = union
    return new Set([...this, ...set2])
}

Set.prototype.difx = function (set2 = new Set()){  // this - arr = difference
    const res = new Set()
    this.forEach(val => {
        if (!set2.has(val)) res.add(val)
    })
    return res
}

Set.prototype.xorx = function (set2 = new Set()){   // this ^ arr = symmetric difference
    return this.difx(set2).orx(set2.difx(this))
}
