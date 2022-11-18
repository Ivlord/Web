//
// JSfuncionsIvlord.js v2.0 - by Ivlord
//
// Пакет включает в себя программный код общего назначения для расширения функционала,
// удобства написания основного кода и демонстрации возможностей JS
//

// Методы класса String с часто повторяющейся у нас операцией,
// чтобы chain-ы смотрелись красиво и продемонстрировать возможности.

// Метод удаляет все пробелы вначале, в конце и все мульти-пробелы между словами в строке
Object.defineProperty(String.prototype, 'CutSpaces', { // Classic way
    value: function() { return this.replace(/ +/g, ' ').trim() }
})

// Метод добавляет, удаляет или меняет текстовую подстроку в текстовой строке
// Удобно использовать для управления набором классов для css селекторов
// wrd num  get     arguments
// wrd 0    false - add wrd  at the end (wrd - unique)  wrd эквивалентно wrd0
// wrd "0"  false - enforce wrd0 set
// wrd N    false - add wrdN at the end (wrd - unique)
// wrd null any   - dell all wrd
// wrd pos  true  - return N or null (if not found) Ex: 'be13'.mod('be', 0, true) => 13
//
String.prototype.mod = function(wrd, num = 0, get = false) {
    let regexp = RegExp(`(?<=\\s|^)${wrd}-?\\d*(?=\\s|$)`,'g')
    if (num === null) return this.replace(regexp,'').CutSpaces()
    if (get) {
        let res = this.match(regexp)
        return (res===null || num<0 || num>=res.length) ?
            null : +res[ Math.floor(num) ].delw(wrd)
    }
    let res = this.mod(wrd, null)
    return res + (res? ' ':'') + wrd + (num? num : '')
}

// Делаем аналог Python list.sample(n) метода JS - добавляем новый метод в класс Array
// Исходный массив не изменяется, возвращается слайс из сортированной копии.
// Если количество запрошенных элементов > list.length, возвращаестся, сколько есть
Array.prototype.sample = function(samplesNumber) {
    let arrCopy = [...this], res = []
    for (let i = samplesNumber;i > 0 & arrCopy.length > 0; i--){
        res.push(...arrCopy.splice( Math.floor( Math.random() * arrCopy.length ) , 1))
    }
    return res
}

Array.prototype.clone = function (){ // deep array copy
    return this.map(item => Array.isArray(item) ? item.clone(): item)
}

Array.prototype.dup = function() { // remove duplicated items
    if (!this.length) return this
    res = []
    this.forEach(val => { if ( !res.includes(val) ) res.push(val) })
    return res
}

Array.prototype.andx = function(arr2 = []) { // this & arr = intersection
    return this.filter(val => arr2.includes(val) )
}// Ex: [1,2,3,4] & [1,2,5,6] = [1,2]
Array.prototype.orx = function(arr2 = []) {  // this | arr = union
    return this.dup().concat( arr2.filter( val => !this.includes(val) ) )
}// Ex: [1,2,3,4] & [1,2,5,6] = [1,2,3,4,5,6]
Array.prototype.difx = function(arr2 = []) { // this - arr = difference
    return this.filter( val => !arr2.includes(val) )
}// Ex: [1,2,3,4] & [1,2,5,6] = [3,4]
Array.prototype.xorx = function(arr2 = []) { // this ^ arr = symmetric difference
    return this.difx(arr2).concat( arr2.difx(this) )
}// Ex: [1,2,3,4] & [1,2,5,6] = [3,4,5,6]
Array.prototype.off = function(off = [0,0]) { //
    return (this.length != 2 || off.length != 2)? [] : [this[0]+off[0], this[1]+off[1]]
}// Ex: [5,7].off([1,3]) = [6,10]
