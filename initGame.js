const DIV = document.querySelector("#container")
const clinetWidth = DIV.clientWidth //页面宽度
const clientHeight = DIV.clientHeight //页面高度
const ballList = [] //球的合集
let secQueen = [] //当前选中的球队列 
let cacheList = [] //暂时存放小球
let cleanListX = [] //横向x需要消除的小球
let cleanListY = [] //纵向y需要消除的小球


class Queen {
    constructor() {
        this.temp = []
    }
    add(val) {
        this.temp.push(val)
    }

}
let animateQueen = new Queen()
class Ball {
    constructor(node, row, column, index, identification) {
        this.node = node
        this.row = row //第几行
        this.column = column //第几列
        this.identification = identification //ball对象的标识
        this.index = index //在ballList中的下标
    }
}

createBall()
cacheList = []
collectCleanBallY()

initGame()

function initGame() {
    setTimeout(() => {
        refreshBallList().then(() => {
            moveToBottom()
            createNewBall()
            collectCleanBallX();
            collectCleanBallY();
            if (cleanListX.length || cleanListY.length) {
                initGame()
            }
        })
    }, 0);
}



/**
 * 
 * 小球下移方法
 * 
 * */
function moveToBottom() {
    //判断是否为空，为空，若为空则把上方的小球往下挪
    for (let i = ballList.length - 1; i > -1; i--) {
        // console.log(ballList[i]);
        if (!ballList[i] && ballList[i - 8]) { //如果当前ball为空  并且 上一个ball存在
            const preNode = ballList[i - 8].node; // 拿到上一个节点
            // console.log('当前遍历到的节点',ballList[i],'当前节点的上一个节点',ballList[i - 8]);
            ballList[i] = ballList[i - 8] // 当前节点就等于上一个节点
            ballList[i].row++
            ballList[i].index += 8
            preNode.style.top = parseInt(preNode.style.top) + 100 + 'px'
            ballList[i - 8] = null
            moveToBottom();
        }

    }
}
/**
 * 重新填充小球的方法
 */
function createNewBall() {
    for (let i = 1; i < 9; i++) {
        let initCount = 1;
        for (let j = 6; j > 0; j--) {
            const index = j * 8 - i
            if (!ballList[index]) {
                const row = Math.floor((index / 8)) + 1
                const column = index % 8 + 1
                let ball = document.createElement('img')
                // ball.style.background = createColor()
                ball.style.display = 'inline-block'
                ball.src = createColor()
                ball.style.width = '100px'
                ball.style.height = '100px'
                ball.style.borderRadius = '50%'
                ball.style.position = 'absolute'
                ball.style.top = `-${(initCount) * 100}px`
                ball.style.left = `${(column - 1) * 100}px`
                ball.style.textAlign = 'center'
                // console.log(`这是第${row}行，第${column}列`,ballList[index]);
                let ballObj = new Ball(ball, row, column, index, ball.src)
                ballList[index] = ballObj
                DIV.appendChild(ball)
                initCount++
                setTimeout(() => {
                    ball.style.top = `${(row - 1 ) * 100}px`
                }, 10)
            }
        }
    }

}

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
    for (let i = 0; i < 48; i++) {
        // 计算球的 x坐标 和 y坐标
        const row = Math.floor((i / 8)) + 1
        const column = i % 8 + 1
        let ball = document.createElement('div')
        ball.style.background = createColor()
        ball.style.width = '100px'
        ball.style.height = '100px'
        ball.style.borderRadius = '50%'
        ball.style.position = 'absolute'
        ball.style.top = `${(row - 1) * 100}px`
        ball.style.left = `${(column - 1) * 100}px`
        // ball.innerText = i
        ball.style.textAlign = 'center'
        const ballObj = new Ball(ball, row, column, i, ball.src)
        ballList.push(ballObj)
        collectCleanBall(ballObj, 'row', cleanListX)
        // 将生成的ball添加到页面
        DIV.appendChild(ball)
    }
}

/**
 * 收集要清除小球的方法
 * ballObj：Ball对象
 * direction：横向还是纵向 ('row'/'column')
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
            collectCleanBall(ballObj, 'column', cleanListY)
        }
    }
}
// 收集要清除X纵向小球的方法
function collectCleanBallX() {
    for (let i = 0; i < 48; i++) {
        const ballObj = ballList[i]
        collectCleanBall(ballObj, 'row', cleanListX)
    }
}

// 生成随机颜色
function createColor() {
    const colorArray = [
        "assets/cat1.jpg",
        "assets/cat2.jpg",
        "assets/cat3.jpg",
        "assets/cat4.jpg",
        "assets/cat5.jpg",
        "assets/cat6.jpg",
    ];
    const len = colorArray.length
    const index = Math.floor(Math.random() * len)
    return `${colorArray[index]}`
}

// 消除符合要求的小球
function refreshBallList() {
    const allCleanBall = new Set([...cleanListX, ...cleanListY]);
    [...allCleanBall].forEach(item => {
        item.node.classList.add('tosmall')
    })
    cleanListX = []
    cleanListY = []
    console.log("🚀 ~ file: initGame.js ~ line 238 ~ refreshBallList ~ allCleanBall", allCleanBall)
    return new Promise((resolve, reject) => (
        setTimeout(() => {
            console.log(ballList);
            [...allCleanBall].forEach((item) => {
                if (item.node) {
                    const index = item.index;
                    ballList[index] = null;
                    DIV.removeChild(item.node);
                }
            });
            resolve()
        }, 1000)
    ))
}

// 清楚选中队列方法
function cleanSecQueen() {
    secQueen[0].node.style.border = 'none'
    secQueen[1].node.style.border = 'none'
    secQueen = []
}
// 调换两个节点位置
function replacePostion() {
    // 调换两个ball的位置 
    const firstNode = secQueen[0].node //第一个节点
    const lastNode = secQueen[1].node //第二个节点
    if (firstNode.style.top == lastNode.style.top) {
        [lastNode.style.left, firstNode.style.left] = [firstNode.style.left, lastNode.style.left]
    }
    if (firstNode.style.left == lastNode.style.left) {
        [lastNode.style.top, firstNode.style.top] = [firstNode.style.top, lastNode.style.top]
    }
    ballList[secQueen[0].index].node = lastNode
    ballList[secQueen[1].index].node = firstNode
    const firstTag = secQueen[0].identification
    const lastTag = secQueen[1].identification;
    [ballList[secQueen[0].index].identification, ballList[secQueen[1].index].identification] = [lastTag, firstTag]
}

// 给游戏区域添加点击事件
window.addEventListener('click', (e) => {
    if (e.clientX < 800 && e.clientY < 600) {
        const row = Math.ceil(e.clientY / 100)
        const column = Math.ceil(e.clientX / 100)

        if (secQueen[0] && secQueen[0].row == row && secQueen[0].column == column) {
            cleanSecQueen()
            return
        }
        // console.log('当前点击的坐标x-column:', Math.ceil(e.clientY / 100), Math.ceil(e.clientX / 100));
        for (let i = 0; i < ballList.length; i++) {
            if (ballList[i].row == row && ballList[i].column == column) {
                secQueen.push(ballList[i])
                ballList[i].node.style.border = '5px solid #fff'

                // 如果长度等于2，就进行位置对调
                if (secQueen.length == 2) {
                    if ((secQueen[0].row == secQueen[1].row || secQueen[0].column == secQueen[1].column) && (Math.abs((secQueen[0].row - secQueen[0].column) - (secQueen[1].row - secQueen[1].column)) == 1)) {
                        replacePostion();
                        // 换完位置后  搜索要清楚的横纵ball
                        collectCleanBallX();
                        collectCleanBallY();
                        console.log(cleanListX, cleanListY);
                        if (cleanListX.length || cleanListY.length) {
                            initGame()
                            cleanSecQueen()
                        } else {
                            console.log(ballList);
                            setTimeout(() => {
                                replacePostion()
                                cleanSecQueen();
                            }, 1100)
                        }

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
        cleanSecQueen()
    }
})