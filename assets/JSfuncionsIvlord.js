//
// JSfuncionsIvlord.js v1.0 - by Ivlord
//
// Пакет включает в себя программный код общего назначения для расширения функционала,
// удобства написания основного кода и демонстрации возможностей JS
//
// - Новые методы классов String и Array, функции(FD) и функциональные выражения(FE):
//   - String.delw(substr) - удаление substring из string. соблюдение уникальности substring
//   - String.addw(substr) - добавление substring в string. соблюдение уникальности substring
//   - String.CutSpaces()  - удаление пребелов в начале и конце строки, мульти-пробелов
//
// - Function expressions для приложения Lines:
//   - setEleColor(str, clr = 0) - замена селектора цвета в строке класса Example: 'clr2'
//   - XY2X(y, x, rowLen = 9) - рассчет индекса элемента в 1d массиве по его 2d координатам
//

// Методы класса String с часто повторяющейся у нас операцией,
// чтобы chain-ы смотрелись красиво и продемонстрировать возможности.

// Метод удаляет все пробелы вначале, в конце и все мульти-пробелы между словами в строке
Object.defineProperty(String.prototype, 'CutSpaces', { // Classic way
    value: function() {
        return this.replace(/ +/g, ' ').trim()
    }
}) //Аналог FE(lambda): CutSpaces = str => str.replace(/ +/g, ' ').trim()

// Метод удаляет все вхождения substring wrd из экземпляра класса (String)
String.prototype.delw = function(wrd) {
    return this.replace(RegExp(`${wrd}`, 'g'), '').CutSpaces()
} // RegExp(wrd.toString(), 'g')

// Метод добавляет substring в string, контролирует уникальность substring в string
String.prototype.addw = function(wrd) {
    return this.delw(wrd) + ' ' + wrd
}

// FE: Устанавливает класс цвета шара.
// Удаляет вхождения 'clr' + любое количество цифр за ним И все мульти-пробелы в строке
setEleColor = (str, clr = 0) => ('clr' + clr + ' ' + str.replace(/clr\d*/g, '')).CutSpaces()

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

Array.prototype.dup = function() { // remove duplicated items
    if (!this.length) return this
    res = []
    this.forEach(val => {
        if ( !res.includes(val) ) res.push(val)
    })
    return res
}

Array.prototype.andx = function(arr2 = []) { // +this & arr = intersection
    return this.filter(val => arr2.includes(val) )
}
Array.prototype.orx = function(arr2 = []) { // this | arr = union
    return this.concat( arr2.filter( val => !this.includes(val) ) )
}
Array.prototype.difx = function(arr2 = []) { // this - arr = difference
    return this.filter( val => !arr2.includes(val) )
}
Array.prototype.xorx = function(arr2 = []) { // this ^ arr = symmetric difference
    return this.difx(arr2).concat( arr2.difx(this) )
}
Array.prototype.off = function(offset = [0,0]) { //
    return (this.length != 2 || offset.length != 2)? [] : [this[0] + offset[0], this[1] + offset[1]]
}
Array.prototype.deepcopy = function() { // 2-lvl array deep copy (for paths)
    let res = []
    this.forEach(el => res.push([...el]))
    return res
}

// b = [a, a = b][0];
// intersection, union, difference, and symmetric difference
// const map1 = array1.map(x => x * 2); .indexOf('bison', 2) -1  includes(searchElement, fromIndex)
//

YX2X = (yx, rowLen = 9) => yx[0] * rowLen + yx[1] // конверт 2d координат в 1d
// Прибавляет к координатам точки смещения. Вернет [], если один из array иметт длину не 2
YXOFF = (pnt = [0,0], offset = [0,0]) =>
    (pnt.length != 2 || offset.length != 2)? [] : [pnt[0] + offset[0], pnt[1] + offset[1]]
// Проверка, попадения точки в зону [minVal, maxVal]
YXinRange = (pnt = [0, 0], maxVal = [8, 8], minVal = [0, 0]) =>
    minVal[0] <= pnt[0] && pnt[0] <= maxVal[0] && minVal[1] <= pnt[1] && pnt[1] <= maxVal[1]
YXNEG = off => [(off[0])? -off[0] : 0, (off[1])? -off[1] : 0]



// Ald:
//
/*Object.defineProperty(String.prototype, 'delw', {
    value: function(wrd) {
        return this.replace(RegExp( `${wrd}`, 'g'), '').CutSpaces()
    }
}) // delw = (str, wrd) => str.replace(RegExp( `${wrd}`, "g"), '').CutSpaces()*/

/*Object.defineProperty(String.prototype, 'addw', {
    value: function(wrd) {
        return this.delw(wrd) + ' ' + wrd
    }
}) // Аналог FE: addw = (str, wrd) => delw(str, wrd) + ' ' + wrd*/
/*Object.defineProperty(Array.prototype, 'sample', {
    value: function(samplesNumber) {
        return [...this].sort(() => 0.5 - Math.random()).slice(0, samplesNumber)
    }
})*/

