const DIV = document.querySelector("#contanier")
console.log(DIV.clientWidth *10/ 100, DIV.clientHeight *10/ 100);
const clinetWidth = DIV.clientWidth
const clientHeight = DIV.clientHeight
const mandanNumber = [1, 2, 3, 4, 5]

// for (let i = 0; i < 8; i++) {
//     let line = document.createElement('span')
//     line.style.position = 'absolute'
//     line.style.borderLeft = '1px solid black'
//     line.style.left = `${100*i}px`
//     line.style.height = '100vh'
//     DIV.appendChild(line)
   
// }
// for (let i = 0; i < 9; i++) {
//     let line = document.createElement('span')
//     line.style.position = 'absolute'
//     line.style.borderTop = '1px solid black'
//     line.style.top = `${100*i}px`
//     line.style.width = '100vw'
//     DIV.appendChild(line)
// }


class Ball{
    constructor(node,x,y) {
        this.node = node
        this.x = x
        this.y = y
    }
}
const ballList=  []
for (let i = 0; i < 48; i++) {
    let ball = document.createElement('div')
    ball.style.background = '#fff'
    ball.style.width = '100px'
    ball.style.lineHeight = '100px'
    ball.style.borderRadius = '50%'
    ball.style.display = 'inline-block'
    ball.style.fontSize = '14px'
    ball.style.fontWeight = '600'
    ball.style.textAlign='center'
    ball.innerText = Math.ceil(Math.random() * 5)
    const a = new Ball(ball, Math.floor((i / 8)) + 1, i % 8 + 1) //1 1,9 2,17  3
    ballList.push(a)
    DIV.appendChild(ball)
}

function createColor() { 
    const a = Math.ceil(Math.random()*255)
    const b = Math.ceil(Math.random()*255)
    const c = Math.ceil(Math.random()*255)
    return `rgb(${a},${b},${c})` 
}


 
const secQueen = []

window.addEventListener('click', (e) => {
    if (e.clientX < 800 && e.clientY < 600) {
        const x = Math.ceil(e.clientY / 100)
        const y = Math.ceil(e.clientX / 100)
        console.log('当前点击的坐标x-y:', Math.ceil(e.clientY / 100), Math.ceil(e.clientX / 100));
        let parentNode = ballList[0].node.parentNode
        console.log(parentNode);
        for (let i = 0; i < ballList.length; i++) {
            if (ballList[i].x == x && ballList[i].y == y) {
                ballList[i].node.style.background = 'hotpink'
                secQueen.push({x,y,index:i})
                console.log(secQueen);
                if(secQueen.length==2){
                    console.log('进入');
                    if (Math.abs(secQueen[0].x - secQueen[1].x) == 1 || Math.abs(secQueen[0].y - secQueen[1].y) == 1) {
                        let originalIndex = secQueen[0].index
                        let replaceIndex = secQueen[1].index
                        parentNode.insertBefore(ballList[replaceIndex].node, ballList[originalIndex].node)
                    }else{
                        ballList[secQueen[0].index].node.style.background = '#fff'
                        secQueen.shift()
                    }
                }
                
                break
            }
        }

    }
})

//初始化游戏的方法
function initGame(ball, ) {
    
}
