class Exchange {
    constructor(exchangeArr) {
        //[[top, bottom, rate]]
        this.startCountry = {}
        if (Array.isArray(exchangeArr)) {
            this.addMany(exchangeArr)
        }

        this.cache = {}
        this.interferenceCache = {}
    }

    find(top, bottom) {
        let answer = null
        if (this.startCountry[top].endCountry[bottom])  {
            answer = this.startCountry[country].endCountry[bottom]
        } else if (this.cache[top+bottom]) {
            console.log('Used cache to find the answer!')
            answer = this.cache[top+bottom]
        } else {
            let queue = [top, 1, []]
            let path = null
            let set = new Set()
            set.add(top)
            while (queue.length) {
                let country = queue.shift()
                let rate = queue.shift()
                path = queue.shift()
                
                if (this.startCountry[country].endCountry[bottom]) {
                    path.push(country+bottom)    
                    rate *= this.startCountry[country].endCountry[bottom] 
                    answer = this.decimalRound(rate)
                    break
                } else {
                    if (this.startCountry[country]) {
                        let keys = Object.keys(this.startCountry[country].endCountry)
                        for (let i = 0; i < keys.length; i++) {
                            if (set.has(keys[i])) continue
                            set.add(keys[i])
                            path.push(country+keys[i])
                            queue.push(keys[i], rate*this.startCountry[country].endCountry[keys[i]], [...path])
                            path.pop()
                        }
                    }
                }
            }
            this.cache[top+bottom] = answer
            this.updateInterferenceCache(top,bottom,path)
            console.log(path)
        }
        console.log(`1 ${top} is worth ${answer} ${bottom}`)
        return answer
    } 

    updateOne(top, bottom, rate) {
        this.addToStartCountry(top,bottom,rate)
        console.log(`One ${top} is now worth ${rate} ${bottom}`)
        this.deleteCacheValue(top+bottom)
        this.deleteCacheValue(bottom+top)
    }

    updateInterferenceCache(top, bottom, path) {
        for (let i = 0; i < path.length; i++) {
            if (this.interferenceCache[path[i]]) {
             this.interferenceCache[path[i]].push(top+bottom)
            } else {
             this.interferenceCache[path[i]] = [top+bottom] 
            }
         }
    }

    deleteCacheValue(name) {
        if (this.interferenceCache[name]) {
            let cacheDeleteArr = this.interferenceCache[name]
            for (let i = 0; i < cacheDeleteArr.length; i++) {
                this.cache[cacheDeleteArr[i]] = null
                console.log(`deleted ${cacheDeleteArr[i]} from the cache`)
            }
            this.interferenceCache[name] = null
        }
    }

    addOne(top, bottom, rate) {
        this.addToStartCountry(top,bottom,rate) 
        console.log(`Added ${top} to ${bottom} and their inverse.`)
    }

    addMany(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.addToStartCountry(arr[i][0],arr[i][1],arr[i][2])
        }
        console.log(`Added ${arr.length} new exchanges along with their inverses.`)
    }

    addToStartCountry(top,bottom,rate) {
        if (!this.startCountry[top]) this.startCountry[top] = new endCountry()
        if (!this.startCountry[bottom]) this.startCountry[bottom] = new endCountry()
        
        this.startCountry[top].endCountry[bottom] = this.decimalRound(rate) 
        this.startCountry[bottom].endCountry[top] = this.decimalRound(1/rate) 
    }

    decimalRound(number) {
        return Math.round(number * 1000) / 1000
    }
}

class endCountry {
    constructor() {
        this.endCountry = {}
    }
}


let x = new Exchange([['USD','JPY', 103],['USD','SEK', 10],['USD','RUB', 91],['EUR','AUD', 1.5],['GBP','JPY', 141],['GBP','EUR', 1.1]])
x.addOne("EUR",'CNY', 8)
x.find('CNY', 'USD')
x.updateOne('USD', 'JPY', 10)
x.find('CNY', 'USD')

x.find('CNY', 'USD')
// console.log(x.startCountry['USD'].endCountry['JPY'])
// console.log(x.startCountry["JPY"].endCountry['GBP'])
/*


list of countries
    list of countries for each country pointing to rate
sek swedish
rub russian
aud australia
gbp england
krw korea
inr india
THB thai
1         
USD -> JPY 103
USD -> SEK 10
USD -> RUB 91
EUR -> AUD 1.5
GBP -> JPY 141
GBP -> EUR 1.1
EUR -> CNY 8
EUR -> KRW 1337
JPY -> KRW 10.5
CNY -> INR 11
THB -> INR 2.5


        
EXAMPLE DATA:
        If we want to .find(USD, JPY) this is what the cache will lool like after

        startCountry =  {

            USD: 
                endCountry = {
                    CNY: 10 <-----
                    CAD: 2
                }

            CNY: 
                endCountry = {
                    JPY: 4 <-----
                    AUD: 12
                    USD: .1
                }
        }
        

        cache = {
            USDJPY: 40 
        }
        

        interferenceCache = {
            USDCNY: [USDJPY]
            CNYJPY: [USDJPY]
        }
        


*/ 