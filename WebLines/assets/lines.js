let f = [] // 1d
let helpCells = []
let selectedBallBS
let foundPath
let foundColor
let activeBallMoves = 0
let score = 0
let freeCells
let bs = undefined
let balldiv = undefined
let firstRun = true

// FE: Устанавливает класс цвета шара.
// Удаляет вхождения 'clr' + любое количество цифр за ним И все мульти-пробелы в строке
setEleColor = (str, clr = '0') => str.mod('clr', null).mod('clr', clr? clr:"0")
// Проверка, попадения точки в зону [minVal, maxVal]
YXinRange = (pnt = [0, 0], maxVal = [8, 8], minVal = [0, 0]) =>
    minVal[0] <= pnt[0] && pnt[0] <= maxVal[0] && minVal[1] <= pnt[1] && pnt[1] <= maxVal[1]
YXNEG = off => [(off[0])? -off[0] : 0, (off[1])? -off[1] : 0]
YX2X = (yx, rowLen = 9) => yx[0] * rowLen + yx[1] // конверт 2d координат в 1d

onanimationend = (event) => {
    let etp = event.target.parentElement
    etp.className = etp.className.mod(event.animationName, null)
    etp.className = etp.className.mod('ball-add', null)
    etp.className = etp.className.mod('selected', null)

    if(event.animationName == 'ball-add'){
        etp.className = etp.className.mod('ball-move', null)
    }
    else if (event.animationName == 'ball-del'){
        etp.bcolor = 0
        etp.className = setEleColor(bs.className, 0)
        etp.className = etp.className.mod('ball-del', null)
        etp.className = etp.className.mod('ball-move', null)
    }
    else if(event.animationName == 'ball-move'){
        activeBallMoves -= 1
        etp.className = etp.className.mod('ball-del', null)

        if (activeBallMoves==(foundPath.length-3)) {
            addBall(F(foundPath[foundPath.length-1]), foundColor)
        }

        etp.bcolor = 0
        etp.className = setEleColor(bs.className, 0)
        etp.className = etp.className.mod('ball-move', null)
    }
}

const createTable = (sel, yy, xx, clickFun, addHelp = false) => {
    let divfield = document.querySelector(sel)
    while (divfield.firstChild) divfield.removeChild(divfield.firstChild)
    arr = []
    tablefield = document.createElement('table'); tablefield.className = "fieldcells"

    for (let y = 0; y<yy; y++){
        let tablerow = document.createElement('tr') // создаем строку поля
        for (let x = 0; x<xx; x++){ // клетка поля
            fieldcell = document.createElement('td'); fieldcell.className = 'fieldcell'
            bs = document.createElement('div')      // объединение шара и тени: 'c0 selected'
                                                    // bxy[y,x]
            bs.onclick = clickFun
            bs.className = 'clr0 bs' + ((addHelp)? ' help'+x:'') // пустая клетка. bs- ball&shadow container
            bs['pf']     = true                     // маркер занятости PathFind true=свободна
            bs['byx']    = [y, x]
            bs['bcolor'] = 0

            shadowdiv = document.createElement('div'); shadowdiv.className = 'shadow'
            balldiv = document.createElement('div'); balldiv.className = 'ball'

            bs.append(shadowdiv)
            bs.append(balldiv)
            fieldcell.append(bs)

            arr.push(bs)
            tablerow.append(fieldcell)
        }
        tablefield.append(tablerow)
    }
    divfield.append(tablefield)

    if (!addHelp) GameReset()
    return arr
}

const getFreeCells = () => f.filter(bs => !bs.bcolor)
const F    = pnt => (YX2X(pnt) >= f.length)? f[0] : f[YX2X(pnt)]
const Fcol = pnt => F(pnt).bcolor

function pathfind(f, start = [0, 0], end = [ 0, 0], func = Fcol, freePass = [0],
                  update_model = [[0,-1], [1,0], [0,1], [-1,0]] ){
    let found = [] // [    [  path>[[x,y],[x,y]] ]    ]
    let paths = [ [[...start]] ]
    let ok = pnt => YXinRange(pnt) && F(pnt).pf
    // чистим маркеры PathFind
    f.forEach( bs => { bs.pf = (freePass.includes(bs.bcolor))? true : false } )

    // dot  = [y1,x1]
    // path = [  [y1,x1], [y2,x2], ... ]    [ dot1, dot2, ... ]
    // paths= [  [[y1,x1],[y2,x2],...], [[y5,x5],[y6,x6],...]    ]
    //
    // paths= [ path1, path2, ... ]   path = [ dot1, dot2, ... ]
    // Дополнительный маркер занятой клетки для PF = -1

    oneStep = newPaths => {
        for(path of paths){
            // [ [x,y], [x,y]...   ] - не за экраном и цвет в списке разрешенных
            let newDots = update_model.map(sMod => path[path.length-1].off(sMod) ).filter(dot => ok(dot))
            newDots.forEach(pnt => {
                F(pnt).pf = false
                let newPath = path.clone()
                newPath.push(pnt)
                newPaths.push(newPath)
                if (pnt[0] == end[0] && pnt[1] == end[1]) { found = newPath.clone() }
                }
            ) // маркируем точки как занятиые в PF
        }
        return newPaths
    }

    while (paths.length && !found.length) paths = oneStep([])
    return found
}

// Рекурсивная функция рассчитывающая количество шаров одного цвета, расположенных в линию
// (горизонтальна, вертикальная, 2 варианта диагональной)
function checkVectors(pnt=[0,0], starModel=[[1,1], [1,-1], [1,0], [0,1]], lineLen = 5){
    const oneVector = (pnt, sMod, clr) => (YXinRange(pnt) && F(pnt).bcolor === clr)?
        [F(pnt)].concat( oneVector( pnt.off(sMod), sMod, clr )) : []
    let res = []
    starModel.forEach( (sMod) => {
        let tmpRes = [].concat( oneVector(pnt.off(        sMod ),        sMod, F(pnt).bcolor) ,
                                oneVector(pnt.off( YXNEG(sMod) ), YXNEG(sMod), F(pnt).bcolor) )
        if (tmpRes.length >= lineLen - 1) res = res.concat(tmpRes)
    } )
    return (res.length)? res.concat([ F(pnt) ]) : []
}

function updateScore(num){ // изменить отображение счета
    score = num
    document.querySelector('div.scorenum').innerText = score.toString()
}

function GameReset(){
    selectedBallBS = undefined
    foundPath = undefined
    foundColor = undefined
    activeBallMoves = 0
    updateScore(0)
    f.forEach(bs => {
        bs.bcolor = 0
        bs.className = 'clr0 bs'
    })
    freeCells = getFreeCells()
    addBallsToHelp()
    addBallsToHelp()
    addBallsFromHelp(noPenalty = true)
}

function GameOver(){
    if(!firstRun) {
        alert('Вы проиграли!')
        GameReset()
    }
    firstRun = false
}

function addBall(bs, clr = 0, noPenalty = false) { // добавить один шар случайного или установленного цвета
    bs.bcolor = (clr)? clr : Math.floor(Math.random() * 6.99) + 1
    bs.className = setEleColor(bs.className, bs.bcolor)
    bs.className = bs.className.mod('ball-add', null).mod('ball-add', '')

    if(!(bs.className.includes('help') || noPenalty)){

        RemoveLinesPNT = checkVectors(bs.byx)
        if (RemoveLinesPNT.length) {
            RemoveLinesPNT.forEach(bs => delBall(bs))
            score += RemoveLinesPNT.length*2 + RemoveLinesPNT.length - 5 // +1 за каждый доп свыше 5 шар
            updateScore(score)
        }else if(clr) {                 // была перестановка шара и не закрыта линия
            addBallsFromHelp(true)
        }
    }
}

function delBall(bs) {
    bs.className = bs.className.mod('selected', null)
    bs.className = bs.className.mod('ball-del', null).mod('ball-del', '')
    bs.bcolor = 0
}

function addBallsToHelp(){
    helpCells.forEach(bs => {
        addBall(bs, clr = 0)
    } )
}

function addBallsFromHelp(noPenalty = false) {
    let numLimit = helpCells.length
    let num = 0
    freeCells = getFreeCells()
    while (num < numLimit && freeCells.length) {
        oneFreeCell = freeCells.sample(1)[0]
        addBall(oneFreeCell, helpCells[num].bcolor, noPenalty)
        freeCells = getFreeCells()
        num = num + 1
    }
    if (!freeCells.length) GameOver()         // конец игры нет места
    else { addBallsToHelp() }
}

function main_click(event){
    if (event.target.className.includes('clr')) {bs = event.target}
    else { bs = event.target.parentElement}

    if (!bs.bcolor) { // color=0
        if(!selectedBallBS) {/*console.log('no ball selected. ', bs.byx)*/} // клик по клетке при невыбранном шаре. спецэффект?
        else{
            foundPath = pathfind(f, start = selectedBallBS.byx, end = bs.byx )

            if (!foundPath.length) {
                console.log('no path to:', bs.byx, "from:", selectedBallBS.byx, selectedBallBS)
            } // нет пути
            else{ // путь найден /////////////////////////////////////////////////////////////// found!

                foundColor = F(foundPath[0]).bcolor
                activeBallMoves = 0
                if (foundPath.length>2) foundPath.slice(1, foundPath.length-1).forEach(pnt => {
                    F(pnt).className = setEleColor(F(pnt).className, foundColor)
                    F(pnt).className = F(pnt).className.mod('ball-move', null).mod('ball-move', '')
                    activeBallMoves += 1
                })
                else addBall(F(foundPath[foundPath.length-1]), foundColor)

                delBall(F(foundPath[0]))
                selectedBallBS = undefined
            }
        }
    }
    else if(bs.className.includes('selected')){console.log('double ball click. already selected. ', bs.byx)} // повторный клик на выбранный шар. спецэфект?
    else{
        if(selectedBallBS) selectedBallBS.className = selectedBallBS.className.mod('selected', null)
        bs.className = bs.className.mod('selected', null).mod('selected', '')
        selectedBallBS = bs // console.log('new ball selected at: ', bs.byx)
    }

}
function help_click(event){
    addBallsFromHelp(noPenalty = true)
}

f = createTable('div.field', 9, 9, main_click, addHelp = false)
helpCells = createTable('div.nextballs', 1, 3, help_click, addHelp = true)
GameReset()

