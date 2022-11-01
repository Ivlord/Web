function checkRuLatHtSp(text){
        let regex = /^[a-zа-я# ]+$/i
        return regex.test(text)
    }
    function containsDoubleSpace(text){
        let regex = / {2} */i
        return regex.test(text)
    }
    // Задание 1
    console.info(getHashTags('Прохожу курс по #javascript и #web'))
    function getHashTags(text){
        var result = []
        if (checkRuLatHtSp(text) && !containsDoubleSpace(text)){
            text.split(" ").forEach( word =>{
                if (word[0] === '#') {
                    result.push(word.slice(1))
                }
            })
            return result
        }else{
            return undefined
        }
    }
    // Задание 2
    console.info(normalizeHashTags(['web','JavaScript','Web','script','programming']))
    function normalizeHashTags(list){
        let set = new Set(list.map(item=>item.toLowerCase()))
        return Array.from(set).join(", ")
    }
    // Задание 3
    let book = []
    phoneBook('ADD Ivan 555-10-01,555-10-03')
    phoneBook('ADD Ivan 555-10-02')
    console.info(phoneBook('SHOW'))
    phoneBook('REMOVE_PHONE 555-10-03')
    phoneBook('ADD Alex 555-20-01')
    console.info(phoneBook('SHOW'))
    phoneBook('REMOVE_PHONE 555-20-01')
    console.info(phoneBook('SHOW'))

    function phoneBook(command){
        let commandArray = command.split(" ")
        let index = null
        let action = commandArray[0]
        let arg1 = commandArray[1]
        let arg2 = commandArray.slice(2).join().split(",")
        switch (action){
            case "ADD":
                index = getUserIndex(arg1)
                if (index != null){
                    let removedUser = removeUser(index)
                    let removedPhones = removedUser
                        .split(" ")
                        .slice(1)
                        .map(item=>item.replace(',',''))
                    arg2 = removedPhones.concat(arg2)
                }
                arg2 = arg2.join(", ")
                addUser(arg1, arg2)
                return
            case "REMOVE_PHONE":
                return removePhone(arg1)
            case "SHOW":
                return book.filter(item => {
                    return item.includes('-')
                })
        }
        throw "Unknown command"
        function getUserIndex(userName){
            let result = null
            book.forEach ((item, index)=> {
                if (item.includes(userName)){
                    result = index
                }
            })
            return result
        }
        function addUser(userName,phones){
            book.unshift(`${userName}: ${phones}`)
        }
        function removeUser(positionInBook){
            let user = book[positionInBook]
            book.splice(positionInBook,1)
            return user
        }
        function removePhone(phone){
            let isRemoved = false
            book = book.map(item=>{
                if (item.includes(phone)){
                    isRemoved = true
                    let userName = item.split(":")[0]
                    let phones = item.split(":")[1]
                    phones = phones
                        .trim()
                        .split(" ")
                        .map(item=>item
                            .replace(',','')
                        )
                        .filter(item=>item !== phone)
                        .join(", ")
                    return `${userName}: ${phones}`
                }
                return item
            })
            return isRemoved
        }
    }
