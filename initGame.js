const DIV = document.querySelector("#contanier")
const clinetWidth = DIV.clientWidth //页面宽度
const clientHeight = DIV.clientHeight//页面高度
const ballList = [] //球的合集
const secQueen = [] //当前选中的球队列 
let cacheList = []
let cleanListX = []//横向x需要消除的小球
let cleanListY = []//纵向y需要消除的小球


createBall()
cacheList = []
collectCleanBallY()

setTimeout(() => {
    refreshBallList()
    console.log(ballList);
}, 0)



/**
 * 创建线条方法
 */
function createLine() {
    for (let i = 0; i < 8; i++) {
        let line = document.createElement('span')
        line.style.position = 'absolute'
        line.style.borderLeft = '1px solid #fff'
        line.style.left = `${100 * i}px`
        line.style.height = '100vh'
        DIV.appendChild(line)

    }
    for (let i = 0; i < 9; i++) {
        let line = document.createElement('span')
        line.style.position = 'absolute'
        line.style.borderTop = '1px solid #fff'
        line.style.top = `${100 * i}px`
        line.style.width = '100vw'
        DIV.appendChild(line)
    }

}

/**
 * 创建小球方法
 */
function createBall() {
    class Ball {
        constructor(node, x, y, index, identification) {
            this.node = node
            this.x = x //第几行
            this.y = y //第几列
            this.identification = identification //ball对象的标识
            this.index = index //在ballList中的下标
        }
    }

    for (let i = 0; i < 48; i++) {
        // 计算球的 x坐标 和 y坐标
        const x = Math.floor((i / 8)) + 1
        const y = i % 8 + 1
        let ball = document.createElement('div')
        ball.style.background = createColor()
        ball.style.width = '100px'
        ball.style.height = '100px'
        ball.style.borderRadius = '50%'
        ball.style.position = 'absolute'
        ball.style.top = `${(x - 1) * 100}px`
        ball.style.left = `${(y - 1) * 100}px`
        const ballObj = new Ball(ball, x, y, i, ball.style.background)
        ballList.push(ballObj)

        collectCleanBall(ballObj, 'x', cleanListX)

        // 将生成的ball添加到页面
        DIV.appendChild(ball)
    }
}

/**
 * 收集要清除小球的方法
 * ballObj：Ball对象
 * direction：横向还是纵向 ('x'/'y')
 * cleanTemp：收集存放的容器
 */
function collectCleanBall(ballObj, direction, cleanTemp) {
    if (cacheList.length == 0) {
        // 1.如果cacheList 为空，则直接添加ball对象
        cacheList.push(ballObj)
    } else {
        // 2.否则判断cacheList的长度是否小于3 
        if (cacheList.length < 3) {
            // 2.1-如果x坐标相同  则直接从cacheList取值进行对比
            if (cacheList[0][direction] !== ballObj[direction] || cacheList[0].identification !== ballObj.identification) {
                // 如果x坐标不同 或者 identification不同，则清空cacheList
                cacheList = []
            }
            cacheList.push(ballObj)

            if (ballObj.index == 47 && cacheList.length == 3) {
                // 如果当前是最后一个ball 并且cacheList长度为3则进行 添加cleanTemp
                cacheList.forEach(item => {
                    cleanTemp.push(item)
                })
                cacheList = []
            }
        } else {
            // 2.2-如果横坐标不相等 或者 标识不同，清空cacheList 存入cleanTemp
            if (ballObj[direction] !== cacheList[cacheList.length - 1][direction] || ballObj.identification !== cacheList[cacheList.length - 1].identification) {
                cacheList.forEach(item => {
                    cleanTemp.push(item)
                })
                cacheList = []
            }
            cacheList.push(ballObj)
        }
    }
}

// 收集要清除Y纵向小球的方法
function collectCleanBallY() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
            const index = j * 8 + i
            const ballObj = ballList[index]
            collectCleanBall(ballObj, 'y', cleanListY)
        }
    }
}

// 生成随机颜色
function createColor() {
    const colorArray = ['#0b8b40', '#f5d920', '#d8132e', '#0863aa', '#d15b98', '#e96069']
    const len = colorArray.length
    const index = Math.floor(Math.random() * len)
    return `${colorArray[index]}`
}

// 消除符合要求的小球
function refreshBallList() {
    const allCleanBall = new Set([...cleanListX, ...cleanListY])
    console.log(allCleanBall);
    [...allCleanBall].forEach(item => {
        item.node.classList.add('tosmall')

    })

    setTimeout(() => {
        [...allCleanBall].forEach(item => {
            if(item.node){
                const index = item.index
                ballList[index] = null
                DIV.removeChild(item.node)
            }
        })
    }, 1100)
    console.log('cleanListY', cleanListY);
    console.log('cleanListX', cleanListX);
}

// 给游戏区域添加点击事件
window.addEventListener('click', (e) => {
    if (e.clientX < 800 && e.clientY < 600) {
        const x = Math.ceil(e.clientY / 100)
        const y = Math.ceil(e.clientX / 100)

        if (secQueen[0] && secQueen[0].x == x && secQueen[0].y == y) {
            secQueen[0].node.style.border = 'none'
            secQueen.shift()
            return
        }
        // console.log('当前点击的坐标x-y:', Math.ceil(e.clientY / 100), Math.ceil(e.clientX / 100));
        for (let i = 0; i < ballList.length; i++) {
            if (ballList[i].x == x && ballList[i].y == y) {
                secQueen.push(ballList[i])
                ballList[i].node.style.border = '3px solid #fff'

                // 如果长度等于2，就进行位置对调
                if (secQueen.length == 2) {
                    if ((secQueen[0].x == secQueen[1].x || secQueen[0].y == secQueen[1].y) && (Math.abs((secQueen[0].x - secQueen[0].y) - (secQueen[1].x - secQueen[1].y)) == 1)) {
                        // 调换两个ball的位置 
                    } else {
                        secQueen[0].node.style.border = 'none'
                        secQueen.shift()
                    }
                }
                break
            }
        }
    } else {
        if (secQueen.length == 0) return
        secQueen[0].node.style.border = 'none'
        secQueen.shift()
    }
})
