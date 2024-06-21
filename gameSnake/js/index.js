<<<<<<< HEAD
/**
 * 绘制蛇的方法
 * @param {*} snake
 */
function drawSnake(snake) {
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (!snake.snakePos[i].domContent) {
      // 进入此页面，说明是第一次创建
      snake.snakePos[i].domContent = document.createElement('div')
      snake.snakePos[i].domContent.style.position = `absolute`
      snake.snakePos[i].domContent.style.width = snakeBody + 'px'
      snake.snakePos[i].domContent.style.height = snakeBody + 'px'
      snake.snakePos[i].domContent.style.left = `${snake.snakePos[i].x * snakeBody}px`
      snake.snakePos[i].domContent.style.top = `${snake.snakePos[i].y * snakeBody}px`
      // 绘制蛇头
      if (snake.snakePos[i].flag === 'head') {
        snake.snakePos[i].domContent.style.background = `url(../img/doudou.png) no-repeat center/contain`
        snake.snakePos[i].domContent.style.borderRadius = `50%`
        // 根据方向设置蛇头的方向
        switch (snake.direction.flag) {
          case 'top': {
            snake.snakePos[i].domContent.style.transform = `rotate(-90deg)`
            break
          }
          case 'bottom': {
            snake.snakePos[i].domContent.style.transform = `rotate(90deg)`
            break
          }
          case 'left': {
            snake.snakePos[i].domContent.style.transform = `rotate(180deg)`
            break
          }
          case 'right': {
            snake.snakePos[i].domContent.style.transform = `rotate(0deg)`
            break
          }
        }
      } else {
        snake.snakePos[i].domContent.style.background = `#9ddbb1`
        snake.snakePos[i].domContent.style.borderRadius = '50%'
      }
      document.querySelector('.container').appendChild(snake.snakePos[i].domContent)
    }
  }
}
/**
 * 绘制食物
 */
function drawFood() {
  // 1 坐标随机
  // 2 不能生成在蛇头或蛇身上
  // 3 生成多个食物随机坐标

  for (var i = 0; i < generateFoodNum; i++) {
    while (true) {
      // 食物坐标foodItem
      var foodItem = {
        x: 0,
        y: 0,
        domContent: ''
      }
      // 构成一个死循环，直到生成符合要求的食物坐标才能退出该循环
      var isRepeat = false
      //   food.x = Math.floor(Math.random() * tr)
      //   food.y = Math.floor(Math.random() * td)

      foodItem.x = Math.floor(Math.random() * tr)
      foodItem.y = Math.floor(Math.random() * td)

      for (var j = 0; j < snake.snakePos.length; j++) {
        if (foodItem.x === snake.snakePos[j].x && foodItem.y === snake.snakePos[j].y) {
          isRepeat = true
          break
        }
      }
      if (!isRepeat) {
        foodArr.push(foodItem)
        break
      }
    }
  }
  // 4 创建多个食物div
  for (var i = 0; i < generateFoodNum; i++) {
    if (!foodArr[i].domContent) {
      foodArr[i].domContent = document.createElement('div')
      foodArr[i].domContent.classList.add('foodDom')
      foodArr[i].domContent.style.width = `${snakeBody}px`
      foodArr[i].domContent.style.height = `${snakeBody}px`
      foodArr[i].domContent.style.position = 'absolute'
      //   foodArr[i].domContent.dataset.index = i
    }
    foodArr[i].domContent.style.background = `url(../img/${foodBgArr[Math.floor(Math.random() * foodBgArr.length)]}) no-repeat center/contain`
    foodArr[i].domContent.style.left = `${foodArr[i].x * snakeBody}px`
    foodArr[i].domContent.style.top = `${foodArr[i].y * snakeBody}px`

    document.querySelector('.container').appendChild(foodArr[i].domContent)
  }
}
/**
 * 初始化游戏方法
 */
function initGame() {
  // 1 初始化地图
  for (var i = 0; i < tr; i++) {
    for (var j = 0; j < td; j++) {
      gridData.push({
        x: j,
        y: i
      })
    }
  }

  // 2 初始化蛇，绘制蛇
  drawSnake(snake)

  // 3 初始化食物，绘制食物
  drawFood()
}
/**
 * 碰撞检测函数
 */
function isCollide(newHead) {
  var collideCheckInfo = {
    isCollide: false,
    isAllEat: false,
    isEat: false
  }
  // 检测是否撞墙
  if (newHead.x < 0 || newHead.x >= tr || newHead.y < 0 || newHead.y >= td) {
    collideCheckInfo.isCollide = true
    return collideCheckInfo
  }
  // 检测是否碰到自己
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (snake.snakePos[i].x === newHead.x && snake.snakePos[i].y === newHead.y) {
      collideCheckInfo.isCollide = true
      return collideCheckInfo
    }
  }

  // 检测是否吃到东西
  for (var i = 0; i < foodArr.length; i++) {
    if (newHead.x === foodArr[i].x && newHead.y === foodArr[i].y) {
      score++
      document.querySelector('.eatNum').innerText = score
      document.querySelector('.snakeLength').innerText = `蛇的总长度为：${snake.snakePos.length + 1}`
      // 删除dom元素
      foodArr[i].domContent.parentElement.removeChild(foodArr[i].domContent)
      // 删除foodArr数组中对应元素
      var index = foodArr.indexOf(foodArr[i])
      foodArr.splice(index, 1)
      collideCheckInfo.isEat = true
    }
    if (foodArr.length === 0) {
      // 进入此if，说明所有一波食物都吃完了
      collideCheckInfo.isAllEat = true
    }
  }
  return collideCheckInfo
}

/**
 * 重置游戏场景函数
 */
function clearScene() {
  document.querySelector('.container').innerHTML = `
    <!-- 开始游戏按钮 -->
    <button class="startBtn" style="display:none"></button>
    <!-- 暂停游戏按钮 -->
    <button class="pauseBtn"></button>
    `
  score = 0
  document.querySelector('.eatNum').innerText = score
  snake = {
    // 蛇初始移动的方向
    direction: directionNum.right,
    // 蛇的初始位置
    snakePos: [
      { x: 0, y: 0, domContent: '', flag: 'body' },
      { x: 1, y: 0, domContent: '', flag: 'body' },
      { x: 2, y: 0, domContent: '', flag: 'body' },
      { x: 3, y: 0, domContent: '', flag: 'head' }
    ]
  }
  foodArr = []

  spaceFlag = true
}

/**
 * 控制蛇移动的函数
 */
function snakeMove() {
  var oldHead = snake.snakePos[snake.snakePos.length - 1]
  // 计算新蛇头坐标
  var newHead = {
    domContent: '',
    x: snake.snakePos[snake.snakePos.length - 1].x + snake.direction.x,
    y: snake.snakePos[snake.snakePos.length - 1].y + snake.direction.y,
    flag: 'head'
  }

  // 碰撞检测
  var collideCheckResult = isCollide(newHead)
  if (collideCheckResult.isCollide) {
    if (window.confirm(`游戏结束，您当前的得分为：${score}。是否重新开始游戏`)) {
      // '重置场景，重新开始游戏
      clearScene()
      initGame()
      pauseGame()
    } else {
      // 退出游戏'
      document.onkeydown = null
      document.querySelector('.container').onclick = null
      document.querySelector('.container .pauseBtn').onclick = null
      clearInterval(timerStop)
    }
    return
  }
  // 将旧蛇头替换为身体
  oldHead.flag = 'body'
  oldHead.domContent.style.background = '#9ddbb1 url(../img/yinxin.png) no-repeat center/contain'
  oldHead.domContent.style.borderRadius = '50%'
  snake.snakePos.push(newHead)

  // 判断是否吃到东西
  if (collideCheckResult.isAllEat) {
    drawFood()
  }
  if (!collideCheckResult.isEat) {
    // 没有吃到食物
    // 移除最后一节蛇尾,删除蛇尾
    document.querySelector('.container').removeChild(snake.snakePos[0].domContent)
    snake.snakePos.shift()
  }
  // 重新绘制蛇
  drawSnake(snake)
}
/**
 * 计时器移动函数
 */
function startGame() {
  timerStop = setInterval(() => {
    snakeMove()
  }, time)
}
/**
 * 暂停游戏
 */
function pauseGame() {
  clearInterval(timerStop)
  document.querySelector('.pauseBtn').style.display = 'block'
  //   timerStop = null
}

/**
 * 绑定事件
 */
function bindEvent() {
  // 1 键盘事件，用户按下上下左右键，蛇能够移动
  document.onkeydown = function (e) {
    if (e.key === 'ArrowUp' && snake.direction.flag !== 'bottom') {
      snake.direction = directionNum.top
    }
    if (e.key === 'ArrowDown' && snake.direction.flag !== 'top') {
      snake.direction = directionNum.bottom
    }
    if (e.key === 'ArrowLeft' && snake.direction.flag !== 'right') {
      snake.direction = directionNum.left
    }
    if (e.key === 'ArrowRight' && snake.direction.flag !== 'left') {
      snake.direction = directionNum.right
    }
    if (e.key === ' ') {
      if (!spaceFlag) {
        pauseGame()
      } else {
        clearInterval(timerStop)
        document.querySelector('.pauseBtn').style.display = 'none'
        startGame()
      }
      spaceFlag = !spaceFlag
    }
  }
  // 2 计时器自动调用蛇移动的方法
  startGame()
  // 3 点击整个容器，可以暂停游戏（事件委托的方式来做）
  document.querySelector('.container').onclick = function (e) {
    if (e.target.classList.contains('container')) {
      // 暂停操作
      console.log('e.target')
      document.querySelector('.pauseBtn').style.display = 'block'
      pauseGame()
    } else {
      //  恢复游戏操作
      pauseGame()
      document.querySelector('.pauseBtn').style.display = 'none'
      startGame()
      spaceFlag = false
    }
  }
}
// 游戏主方法
function main() {
  var num = window.prompt('请输入生成食物的数量')
  generateFoodNum = num ? num : 10
  document.querySelector('.startBtn').onclick = function (e) {
    // 阻止冒泡
    e.stopPropagation()
    // 隐藏开始按钮
    e.target.style.display = 'none'
    // 1 初始化游戏
    initGame()

    // 2 绑定事件
    bindEvent()
  }
}

main()
=======
/**
 * 绘制蛇的方法
 * @param {*} snake
 */
function drawSnake(snake) {
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (!snake.snakePos[i].domContent) {
      // 进入此页面，说明是第一次创建
      snake.snakePos[i].domContent = document.createElement('div')
      snake.snakePos[i].domContent.style.position = `absolute`
      snake.snakePos[i].domContent.style.width = snakeBody + 'px'
      snake.snakePos[i].domContent.style.height = snakeBody + 'px'
      snake.snakePos[i].domContent.style.left = `${snake.snakePos[i].x * snakeBody}px`
      snake.snakePos[i].domContent.style.top = `${snake.snakePos[i].y * snakeBody}px`
      // 绘制蛇头
      if (snake.snakePos[i].flag === 'head') {
        snake.snakePos[i].domContent.style.background = `url(../img/doudou.png) no-repeat center/contain`
        snake.snakePos[i].domContent.style.borderRadius = `50%`
        // 根据方向设置蛇头的方向
        switch (snake.direction.flag) {
          case 'top': {
            snake.snakePos[i].domContent.style.transform = `rotate(-90deg)`
            break
          }
          case 'bottom': {
            snake.snakePos[i].domContent.style.transform = `rotate(90deg)`
            break
          }
          case 'left': {
            snake.snakePos[i].domContent.style.transform = `rotate(180deg)`
            break
          }
          case 'right': {
            snake.snakePos[i].domContent.style.transform = `rotate(0deg)`
            break
          }
        }
      } else {
        snake.snakePos[i].domContent.style.background = `#9ddbb1`
        snake.snakePos[i].domContent.style.borderRadius = '50%'
      }
      document.querySelector('.container').appendChild(snake.snakePos[i].domContent)
    }
  }
}
/**
 * 绘制食物
 */
function drawFood() {
  // 1 坐标随机
  // 2 不能生成在蛇头或蛇身上
  // 3 生成多个食物随机坐标

  for (var i = 0; i < generateFoodNum; i++) {
    while (true) {
      // 食物坐标foodItem
      var foodItem = {
        x: 0,
        y: 0,
        domContent: ''
      }
      // 构成一个死循环，直到生成符合要求的食物坐标才能退出该循环
      var isRepeat = false
      //   food.x = Math.floor(Math.random() * tr)
      //   food.y = Math.floor(Math.random() * td)

      foodItem.x = Math.floor(Math.random() * tr)
      foodItem.y = Math.floor(Math.random() * td)

      for (var j = 0; j < snake.snakePos.length; j++) {
        if (foodItem.x === snake.snakePos[j].x && foodItem.y === snake.snakePos[j].y) {
          isRepeat = true
          break
        }
      }
      if (!isRepeat) {
        foodArr.push(foodItem)
        break
      }
    }
  }
  // 4 创建多个食物div
  for (var i = 0; i < generateFoodNum; i++) {
    if (!foodArr[i].domContent) {
      foodArr[i].domContent = document.createElement('div')
      foodArr[i].domContent.classList.add('foodDom')
      foodArr[i].domContent.style.width = `${snakeBody}px`
      foodArr[i].domContent.style.height = `${snakeBody}px`
      foodArr[i].domContent.style.position = 'absolute'
      //   foodArr[i].domContent.dataset.index = i
    }
    foodArr[i].domContent.style.background = `url(../img/${foodBgArr[Math.floor(Math.random() * foodBgArr.length)]}) no-repeat center/contain`
    foodArr[i].domContent.style.left = `${foodArr[i].x * snakeBody}px`
    foodArr[i].domContent.style.top = `${foodArr[i].y * snakeBody}px`

    document.querySelector('.container').appendChild(foodArr[i].domContent)
  }
}
/**
 * 初始化游戏方法
 */
function initGame() {
  // 1 初始化地图
  for (var i = 0; i < tr; i++) {
    for (var j = 0; j < td; j++) {
      gridData.push({
        x: j,
        y: i
      })
    }
  }

  // 2 初始化蛇，绘制蛇
  drawSnake(snake)

  // 3 初始化食物，绘制食物
  drawFood()
}
/**
 * 碰撞检测函数
 */
function isCollide(newHead) {
  var collideCheckInfo = {
    isCollide: false,
    isAllEat: false,
    isEat: false
  }
  // 检测是否撞墙
  if (newHead.x < 0 || newHead.x >= tr || newHead.y < 0 || newHead.y >= td) {
    collideCheckInfo.isCollide = true
    return collideCheckInfo
  }
  // 检测是否碰到自己
  for (var i = 0; i < snake.snakePos.length; i++) {
    if (snake.snakePos[i].x === newHead.x && snake.snakePos[i].y === newHead.y) {
      collideCheckInfo.isCollide = true
      return collideCheckInfo
    }
  }

  // 检测是否吃到东西
  for (var i = 0; i < foodArr.length; i++) {
    if (newHead.x === foodArr[i].x && newHead.y === foodArr[i].y) {
      score++
      document.querySelector('.eatNum').innerText = score
      document.querySelector('.snakeLength').innerText = `蛇的总长度为：${snake.snakePos.length + 1}`
      // 删除dom元素
      foodArr[i].domContent.parentElement.removeChild(foodArr[i].domContent)
      // 删除foodArr数组中对应元素
      var index = foodArr.indexOf(foodArr[i])
      foodArr.splice(index, 1)
      collideCheckInfo.isEat = true
    }
    if (foodArr.length === 0) {
      // 进入此if，说明所有一波食物都吃完了
      collideCheckInfo.isAllEat = true
    }
  }
  return collideCheckInfo
}

/**
 * 重置游戏场景函数
 */
function clearScene() {
  document.querySelector('.container').innerHTML = `
    <!-- 开始游戏按钮 -->
    <button class="startBtn" style="display:none"></button>
    <!-- 暂停游戏按钮 -->
    <button class="pauseBtn"></button>
    `
  score = 0
  document.querySelector('.eatNum').innerText = score
  snake = {
    // 蛇初始移动的方向
    direction: directionNum.right,
    // 蛇的初始位置
    snakePos: [
      { x: 0, y: 0, domContent: '', flag: 'body' },
      { x: 1, y: 0, domContent: '', flag: 'body' },
      { x: 2, y: 0, domContent: '', flag: 'body' },
      { x: 3, y: 0, domContent: '', flag: 'head' }
    ]
  }
  foodArr = []

  spaceFlag = true
}

/**
 * 控制蛇移动的函数
 */
function snakeMove() {
  var oldHead = snake.snakePos[snake.snakePos.length - 1]
  // 计算新蛇头坐标
  var newHead = {
    domContent: '',
    x: snake.snakePos[snake.snakePos.length - 1].x + snake.direction.x,
    y: snake.snakePos[snake.snakePos.length - 1].y + snake.direction.y,
    flag: 'head'
  }

  // 碰撞检测
  var collideCheckResult = isCollide(newHead)
  if (collideCheckResult.isCollide) {
    if (window.confirm(`游戏结束，您当前的得分为：${score}。是否重新开始游戏`)) {
      // '重置场景，重新开始游戏
      clearScene()
      initGame()
      pauseGame()
    } else {
      // 退出游戏'
      document.onkeydown = null
      document.querySelector('.container').onclick = null
      document.querySelector('.container .pauseBtn').onclick = null
      clearInterval(timerStop)
    }
    return
  }
  // 将旧蛇头替换为身体
  oldHead.flag = 'body'
  oldHead.domContent.style.background = '#9ddbb1 url(../img/yinxin.png) no-repeat center/contain'
  oldHead.domContent.style.borderRadius = '50%'
  snake.snakePos.push(newHead)

  // 判断是否吃到东西
  if (collideCheckResult.isAllEat) {
    drawFood()
  }
  if (!collideCheckResult.isEat) {
    // 没有吃到食物
    // 移除最后一节蛇尾,删除蛇尾
    document.querySelector('.container').removeChild(snake.snakePos[0].domContent)
    snake.snakePos.shift()
  }
  // 重新绘制蛇
  drawSnake(snake)
}
/**
 * 计时器移动函数
 */
function startGame() {
  timerStop = setInterval(() => {
    snakeMove()
  }, time)
}
/**
 * 暂停游戏
 */
function pauseGame() {
  clearInterval(timerStop)
  document.querySelector('.pauseBtn').style.display = 'block'
  //   timerStop = null
}

/**
 * 绑定事件
 */
function bindEvent() {
  // 1 键盘事件，用户按下上下左右键，蛇能够移动
  document.onkeydown = function (e) {
    if (e.key === 'ArrowUp' && snake.direction.flag !== 'bottom') {
      snake.direction = directionNum.top
    }
    if (e.key === 'ArrowDown' && snake.direction.flag !== 'top') {
      snake.direction = directionNum.bottom
    }
    if (e.key === 'ArrowLeft' && snake.direction.flag !== 'right') {
      snake.direction = directionNum.left
    }
    if (e.key === 'ArrowRight' && snake.direction.flag !== 'left') {
      snake.direction = directionNum.right
    }
    if (e.key === ' ') {
      if (!spaceFlag) {
        pauseGame()
      } else {
        clearInterval(timerStop)
        document.querySelector('.pauseBtn').style.display = 'none'
        startGame()
      }
      spaceFlag = !spaceFlag
    }
  }
  // 2 计时器自动调用蛇移动的方法
  startGame()
  // 3 点击整个容器，可以暂停游戏（事件委托的方式来做）
  document.querySelector('.container').onclick = function (e) {
    if (e.target.classList.contains('container')) {
      // 暂停操作
      console.log('e.target')
      document.querySelector('.pauseBtn').style.display = 'block'
      pauseGame()
    } else {
      //  恢复游戏操作
      pauseGame()
      document.querySelector('.pauseBtn').style.display = 'none'
      startGame()
      spaceFlag = false
    }
  }
}
// 游戏主方法
function main() {
  var num = window.prompt('请输入生成食物的数量')
  generateFoodNum = num ? num : 10
  document.querySelector('.startBtn').onclick = function (e) {
    // 阻止冒泡
    e.stopPropagation()
    // 隐藏开始按钮
    e.target.style.display = 'none'
    // 1 初始化游戏
    initGame()

    // 2 绑定事件
    bindEvent()
  }
}

main()
>>>>>>> c32b89e92c25fe5b3a0ef0b33a529389487731ac
