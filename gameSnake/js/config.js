// 游戏相关配置
// 地图坐标数组
var gridData = []
// 网格的行列
var tr = 40
var td = 28
// 蛇身体大小
var snakeBody = 20

// 新旧蛇头的位置关系
var directionNum = {
  top: { x: 0, y: -1, flag: 'top' },
  bottom: { x: 0, y: 1, flag: 'bottom' },
  left: { x: -1, y: 0, flag: 'left' },
  right: { x: 1, y: 0, flag: 'right' }
}

// 蛇相关的配置信息

var snake = {
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

// 食物相关的配置信息
var food = {
  x: 0,
  y: 0,
  domContent: ''
}

// 游戏分数
var score = 0

// 停止计时器的变量
var timerStop = null
// 计时器时间
var time = 100

// 空格暂停游戏(切换暂停、开始)
var spaceFlag = false

// 食物名数组
var foodBgArr = ['food_binggan.png', 'food_caomei.png', 'food_jianguo.png', 'food_mogu.png', 'food_nangua.png', 'food_regou.png', 'food_shutiao.png', 'food_xuegao.png', 'notFood.png']

// 食物数组
var foodArr = []
// 每次生成食物数量
var generateFoodNum = 10
