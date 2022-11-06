let f = [] // 1d
let selectedBallBS
let foundPath
let foundColor
let activeBallMoves = 0

let bs = undefined
let balldiv = undefined

onanimationend = (event) => {     //console.log('animation end: ', event)    //console.log('       target: ', event.target)

    let etp = event.target.parentElement
    etp.className = etp.className.delw(event.animationName)
    if (event.animationName == 'ball-del'){
        etp.bcolor = 0
        etp.className = setEleColor(bs.className, 0)
        etp.className = etp.className.delw('ball-del')
    }
    else if(event.animationName == 'ball-move'){
        activeBallMoves -= 1
        // console.log("moves left:", activeBallMoves, foundPath.length-3, event.target)

        if (activeBallMoves==(foundPath.length-3)) {
            addBall(F(foundPath[foundPath.length-1]), foundColor)
        }

        etp.bcolor = 0
        etp.className = setEleColor(bs.className, 0)
        etp.className = etp.className.delw('ball-move')
    }
}


const createTable = () => {
    let divfield = document.querySelector('div.field')
    while (divfield.firstChild) divfield.removeChild(divfield.firstChild)
    f = []
    tablefield = document.createElement('table'); tablefield.className = "fieldcells"

    for (let y = 0; y<9; y++){
        let tablerow = document.createElement('tr') // создаем строку поля
        for (let x = 0; x<9; x++){ // клетка поля
            fieldcell = document.createElement('td'); fieldcell.className = 'fieldcell'
            bs = document.createElement('div')      // объединение шара и тени: 'c0 selected'
                                                    // bxy[y,x]
            bs.onclick = main_click
            bs.className = 'clr0 bs'                // пустая клетка. bs- ball&shadow container
            bs['pf']     = true                     // маркер занятости PathFind true=свободна
            bs['byx']    = [y, x]
            bs['bcolor'] = 0

            shadowdiv = document.createElement('div'); shadowdiv.className = 'shadow'
            balldiv = document.createElement('div'); balldiv.className = 'ball'
            //balldiv.onclick = ball_click

            bs.append(shadowdiv)
            bs.append(balldiv)
            fieldcell.append(bs)

            f.push(bs)
            tablerow.append(fieldcell)
        }
        tablefield.append(tablerow)
    }
    divfield.append(tablefield)
    selectedBallBS = undefined
    foundPath = undefined
    foundColor = undefined
    activeBallMoves = 0
}

const getFreeCells = () => f.filter(bs => !bs.bcolor)
const F    = pnt => (YX2X(pnt) >= f.length)? f[0] : f[YX2X(pnt)]
const Fcol = pnt => F(pnt).bcolor

function pathfind(f, start = [0, 0], end = [ 0, 0], func = Fcol, freePass = [0],
                  update_model = [[0,-1], [1,0], [0,1], [-1,0]] ){
    let found = [] // [    [  path>[[x,y],[x,y]] ]    ]
    let paths = [ [[...start]] ]
    // console.log(" > start paths ", paths, "  end: ", end)
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
        // console.log("-----------------------")
        // console.log(" => onestep got paths: ", paths)
        for(path of paths){
            // console.log("  => path > ", path)
            // console.log("  => last dot path[-1] > ", path[path.length-1])
            // [ [x,y], [x,y]...   ] - не за экраном и цвет в списке разрешенных
            let newDots = update_model.map(sMod => path[path.length-1].off(sMod) ).filter(dot => ok(dot))
            // console.log("    => new dots: ", newDots)
            newDots.forEach(pnt => {
                F(pnt).pf = false
                let newPath = path.deepcopy()
                newPath.push(pnt)
                // console.log("      => newPath: ", newPath)
                newPaths.push(newPath)
                // console.log("      => +newPaths: ", newPaths)
                // console.log("        => pnt: ", pnt, " end:", end )
                //if (pnt[0] == end[0] && pnt[1] == end[1]) found = newPath.deepcopy()
                if (pnt[0] == end[0] && pnt[1] == end[1]) {
                    // console.log("        => Found solution: ", newPath )
                    found = newPath.deepcopy()}
                }
            ) // маркируем точки как занятиые в PF
        }
        return newPaths
    }

    while (paths.length && !found.length) paths = oneStep([])
    return found
}

// Пример function declaration
// Рекурсивная функция рассчитывающая количество шаров одного цвета, расположенных в линию
// (горизонтальна, вертикальная, 2 варианта диагональной)
function checkVectors(pnt=[0,0], starModel=[[1,1], [1,-1], [1,0], [0,1]], lineLen = 5){
    const oneVector = (pnt, sMod, clr) => (YXinRange(pnt) && F(pnt).bcolor === clr)?
        [F(pnt)].concat( oneVector( YXOFF( pnt, sMod), sMod, clr )) : []
    let res = []
    starModel.forEach( (sMod) => {
        let tmpRes = [].concat( oneVector(YXOFF( pnt,       sMod ),        sMod,  F(pnt).bcolor) ,
                                oneVector(YXOFF( pnt, YXNEG(sMod) ), YXNEG(sMod), F(pnt).bcolor) )
        if (tmpRes.length >= lineLen - 1) res = res.concat(tmpRes)
    } )
    return (res.length)? res.concat([ F(pnt) ]) : []
}

let addBall = (bs, clr = 0) => {
    bs.bcolor = (clr)? clr : Math.floor(Math.random() * 6.99) + 1
    bs.className = setEleColor(bs.className, bs.bcolor)
    bs.className = bs.className.addw('ball-add')

    // console.log(" checking lines")
    //RemoveLinesPNT = checkVectors(foundPath[foundPath.length-1])
    RemoveLinesPNT = checkVectors(bs.byx)
    // console.log(" RemoveLinesPNT:", RemoveLinesPNT, RemoveLinesPNT.length)
    if (RemoveLinesPNT.length) RemoveLinesPNT.forEach(bs => delBall(bs))

}

let delBall = bs => {
    bs.className = bs.className.delw('selected')
    bs.className = bs.className.addw('ball-del')
    bs.bcolor = 0
}

let addBall2 = (pnt, clr) => { F(pnt).bcolor = clr; F(pnt).className = setEleColor(" bs", clr) }

const addBallsOnField = (num) => {
    freeCells = getFreeCells()
    while (num > 0) { // freeCells.length &
        oneFreeCell = freeCells.sample(1)[0]
        addBall(oneFreeCell)
        //checkLineFill() // проверка заполненности линии и удаление шаров
        freeCells = getFreeCells()
        num = num - 1
    }
    return num
}

function main_click(event){

    if (event.target.className.includes('clr')) {bs = event.target}
    else { bs = event.target.parentElement}

    // console.log(" main_click ===> bs >", bs)
    if (!bs.bcolor) { // color=0
        if(!selectedBallBS) {/*console.log('no ball selected. ', bs.byx)*/} // клик по клетке при невыбранном шаре. спецэффект?
        else{
            foundPath = pathfind(f, start = selectedBallBS.byx, end = bs.byx )

            if (!foundPath.length) {
                console.log('no path to:', bs.byx, "from:", selectedBallBS.byx, selectedBallBS)
            } // нет пути
            else{ // путь найден
                /////////////////////////////////////////////////////////////////////////////// found!

                foundColor = F(foundPath[0]).bcolor
                activeBallMoves = 0
                if (foundPath.length>2) foundPath.slice(1, foundPath.length-1).forEach(pnt => {
                    F(pnt).className = setEleColor(F(pnt).className, foundColor)
                    F(pnt).className = F(pnt).className.addw('ball-move')
                    activeBallMoves += 1
                })
                else addBall(F(foundPath[foundPath.length-1]), foundColor)

                // console.log("moves added:", activeBallMoves)

                delBall(F(foundPath[0]))
                selectedBallBS = undefined

                // console.log('move to->', foundPath[foundPath.length-1])
            }


        }
    }
    else if(bs.className.includes('selected')){console.log('double ball click. already selected. ', bs.byx)} // повторный клик на выбранный шар. спецэфект?
    else{
        if(selectedBallBS) selectedBallBS.className = selectedBallBS.className.delw('selected')
        bs.className = bs.className.addw('selected')
        selectedBallBS = bs
        // console.log('new ball selected at: ', bs.byx)
    }

}

createTable()
//console.log(balldiv);
addBallsOnField(60)



/*ballsNew = [
    [4,4],
    [4,5], [4,6], [4,7], [4,8],
    [4,3], [4,2], [4,1],
]
for (let p=0; p<ballsNew.length; p++) {
    addBall2(ballsNew[p], 3)
}*/

//ff = checkVectors(point=[4,4], starModel=[ [1,1], [1,-1], [1,0], [0,1] ], lineLen = 5)
//console.log("res final = ", ff, ff.length)

//console.log(a & b)

//



/*
var BreakException = {};
try {
    [1, 2, 3].forEach(function(el) {
        console.log(el);
        if (el === 2) throw BreakException;
    });
} catch (e) {
    if (e !== BreakException) throw e;
}*/


