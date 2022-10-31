function checkHour(hour){
        return 0 <= hour && hour <= 23;
    }
    function checkMinute(minute){
        return 0 <= minute && minute <= 59
    }
    function isIntegers(ints){
        for (i=0; i<ints.length;i++){
            if (!Number.isInteger(ints[i])){
                return false
            }
        }
        return true
    }

    // Задание 1
    console.info(sum(12,33))
    console.info(sum(101,'17'))
    function sum(a, b){
        if (!(isNaN(a) || isNaN(b))){
            return a-(-b)
        }else{
            return NaN
        }
    }
    // Задание 2
    console.info(isValidTime(12,30))
    console.info(isValidTime(12,61))
    function isValidTime(hour,minute){
        if (isIntegers(hour,minute)){
            if (checkHour(hour) && checkMinute(minute)){
                return true
            }
        }
        return false
    }

    console.info(addTime(12,30,30))
    console.info(addTime(23,59,31))
    function addTime(hour,minute,offset){
        if (isIntegers(hour,minute,offset) && checkHour(hour) && checkMinute(minute)
            && offset >=0){
            let hourOffset = Math.floor(((offset/60)%24))
            let minuteOffset = offset%60

            let newHour = hour + hourOffset
            let newMinute = minute + minuteOffset
            if (newMinute>59) newHour++

            newHour %= 24
            newMinute %= 60
            return `${String(newHour).padStart(2,"0")}:${String(newMinute).padStart(2,"0")}`
        }else{
            return undefined
        }
    }
