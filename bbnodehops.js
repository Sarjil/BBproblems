class HopCombo {
    constructor() {
        this.matrix = new Matrix
        this.matrix.createMatrixSizeN(10)
        this.matrix.setStartRowColumn(0,0)
        this.start = this.matrix.start
    }

    dfsApproach(start, hops) {
        let total = 0

        function dfs(node, h) {
            if (h === 0) {
                total++
                return
            }
            let dirs = [node.left, node.right, node.up, node.down]
            for (let i = 0; i < dirs.length; i++) {
                if (dirs[i]) dfs(dirs[i], h-1)
            }
        }

        dfs(start, hops)
        return total
    }

    dfsApproachUnique(start, hops) {

        let set = new Set()
        
        function dfs(node, h, str) {
            if (h === 0) {
                if (!set.has(str)){
                    set.add(str)
                }
                return
            }
            let dirs = [node.left, node.right, node.up, node.down]
            for (let i = 0; i < dirs.length; i++) {
                if (dirs[i]) dfs(dirs[i], h-1, str+node.val)
            }
        }

        dfs(start, hops, "")
        return set.size
    }

    memoizationApproach(start, hops) {
        /*
         in a matrix you would just use location and hops as the key in the memo, but we have nodes. One idea is to make a value in the node 
         that takes care of that. But lets pretend we cant modify the nodes. I then have to make a location parameters in the dfs(r c)
        */
        let memo = {}

        function dfs(node, h, r, c, str) {
            let total = 0
            if (h === 0) {
                memo[r+"x"+c+'x'+h] = total
                return 1
            }
            if (memo[r+"x"+c+'x'+h]) return memo[r+"x"+c+'x'+h]
            
                if (node.left) total += dfs(node.left, h-1, r, c-1)
                if (node.right) total += dfs(node.right, h-1, r, c+1)
                if (node.up) total += dfs(node.up, h-1, r-1, c)
                if (node.down) total += dfs(node.down, h-1, r+1, c)



            memo[r+"x"+c+'x'+h] = total
            return total
        }
        // console.log(memo)
        return dfs(start, hops, 0, 0, )
     
    }


    dpApproach(start, hops) {
        // we build a new matrix for each hop. As we iterate through the points we 
        // add up the neighbors of the old matrix and set the currents value to it
        let length = 0
        let cur = start
        while (cur) {
            cur = cur.right
            length++
        }
        // console.log(length)
        let arr = []
        for (let i = 0; i < length; i++) {
            arr.push([])
            for (let j = 0; j < length; j++) {
                arr[i].push(0)
            }
        }

        arr[0][0] = 1
        
        while (hops) {
            let nextArr = []
            for (let i = 0; i < length; i++) {
                nextArr.push([])
                for (let j = 0; j < length; j++) {
                    let total = 0
                    if (j > 0) total += arr[i][j-1]
                    if (j < length-1) total += arr[i][j+1]
                    if (i > 0) total += arr[i-1][j]
                    if (i < length-1) total += arr[i+1][j]
                    nextArr[i].push(total)
                }
                
            }
            arr = nextArr
            hops--
        }

        let answer = 0
        for (let i = 0; i < length; i++) {
            
            for (let j = 0; j < length; j++) {
                answer+= arr[i][j]
            }
            
        }
        return answer

    }

    mathApproach() {

    }

}


////////////////////////////////////////////////////////

class Matrix {
    constructor() {
        this.matrix = null
        this.nodeMatrix = null
        this.start = null
    }

    createMatrixSizeN(n) {
        let arr = []
        let narr = []
        for (let i = 0; i < n; i++) {
            arr.push([])
            narr.push([])
            for (let j = 0; j < n; j++) {
                arr[i].push(Math.floor(Math.random()*7))
                narr[i].push(new Node(arr[i][j]))
            }
        }
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let node = narr[i][j]
                // console.log(narr[i])
                // for (let k = 0; k < 4; k++) {
                    if (j > 0) node.left = narr[i][j-1]
                    if (j < n-1) node.right = narr[i][j+1]
                    if (i > 0) node.up = narr[i-1][j]
                    if (i < n-1) node.down = narr[i+1][j]
                // } 
            }
        }
        this.matrix = arr
        this.nodeMatrix = narr
    }

    setStartRowColumn(r,c) {
        let n = this.nodeMatrix.length
        if (this.nodeMatrix && c >= 0 && c < n && r >= 0 && r < n)  this.start = this.nodeMatrix[r][c]
        else console.log('invalid location')
        
    }
}

////////////////////////////////////////////////////////

class Node {
    constructor(val,left,right,up,down) {
        this.val = val
        this.left = left
        this.right = right 
        this.up = up
        this.down = down        
        // 
    }
    
}
// let x = new Matrix
// x.createMatrixSizeN(3)
// x.setStartRowColumn(0,0)
// let z = x.start
// console.log(z)

let a = new HopCombo()
// // console.log(a.start)
let apro = new Date().getTime()
let b = a.dfsApproach(a.start, 12)
let bpro = new Date().getTime()
let c = a.dfsApproachUnique(a.start, 12)
let cpro = new Date().getTime()
let d = a.memoizationApproach(a.start, 12)
let dpro = new Date().getTime()
let e = a.dpApproach(a.start, 12)
let epro = new Date().getTime()
console.log("dfs", `| answer: ${b} |`, `runtime: ${bpro-apro} ms`)
console.log("unique dfs", `| answer: ${c} |`, `runtime: ${cpro-bpro} ms`)
console.log("memoization", `| answer: ${d} |`, `runtime: ${dpro-cpro} ms`)
console.log("dp", `| answer: ${e} |`, `runtime: ${epro-dpro} ms`)