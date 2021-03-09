const DIV = document.querySelector("#contanier")
const clinetWidth = DIV.clientWidth //页面宽度
const clientHeight = DIV.clientHeight//页面高度
const ballList = [] //球的合集
const secQueen = [] //当前选中的球队列 


createLine()
createBall()

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
        constructor(node, x, y, index) {
            this.node = node
            this.x = x //第几行
            this.y = y //第几列
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
        ball.style.position='absolute'
        ball.style.top = `${(x-1)*100}px`
        ball.style.left = `${(y-1)*100}px`
        const ballObj = new Ball(ball, x, y, i)
        ballList.push(ballObj)

        // 将生成的ball添加到页面
        DIV.appendChild(ball)
    }
}

// 生成随机颜色
function createColor() {
    const colorArray = ['#0b8b40', '#f5d920', '#d8132e', '#0863aa', '#d15b98', '#e96069']
    const len = colorArray.length
    const index = Math.floor(Math.random() * len)
    return `${colorArray[index]}`
}

// 给游戏区域添加点击事件
window.addEventListener('click', (e) => {
    if (e.clientX < 800 && e.clientY < 600) {
        const x = Math.ceil(e.clientY / 100)
        const y = Math.ceil(e.clientX / 100)
        // console.log('当前点击的坐标x-y:', Math.ceil(e.clientY / 100), Math.ceil(e.clientX / 100));
        for (let i = 0; i < ballList.length; i++) {
            if (ballList[i].x == x && ballList[i].y == y) {
                secQueen.push(ballList[i])
                ballList[i].node.style.border = '3px solid #fff'

                // 如果长度等于2，就进行位置对调
                if (secQueen.length == 2) {
                    if ((secQueen[0].x == secQueen[1].x || secQueen[0].y == secQueen[1].y) && (Math.abs((secQueen[0].x + - secQueen[0].y) - (secQueen[1].x + - secQueen[1].y)) == 1)) {
                        // 调换两个ball的位置 
                    } else {
                        secQueen[0].node.style.border = 'none'
                        secQueen.shift()
                    }
                }
                break
            }
        }

    }else{
        secQueen[0].node.style.border = 'none'
        secQueen.shift()
    }
})


