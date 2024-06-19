/**
 * 游戏主要逻辑
 */

// 雷数组
var mineArray = []
// 雷区
var mineArea = $('.mineArea')
// 格子额外信息
var tableData = []
// 插旗数组
var flagArray = []
// 难度按键
var btns = $$('.level>button')
// 插旗数
var flagNum = $('.flagNum')
// 雷数
var mineNumber = $('.mineNum')
/**
 * 初始化函数
 */
function initMine() {
  var arr = new Array(curLevel.row * curLevel.col)
  for (var i = 0; i < arr.length; i++) {
    arr[i] = i
  }
  arr.sort(() => 0.5 - Math.random())
  return arr.slice(0, curLevel.mineNum)
}
function initTalbe() {
  // 2 生成雷区表格
  var index = 0
  var table = document.createElement('table')
  for (var i = 0; i < curLevel.row; i++) {
    var tr = document.createElement('tr')
    tableData[i] = []
    for (var j = 0; j < curLevel.col; j++) {
      var td = document.createElement('td')
      var div = document.createElement('div')
      div.dataset.id = index
      div.classList.add('canFlag')

      //   td.innerHTML = 0
      tableData[i][j] = {
        row: i,
        col: j,
        type: 'number',
        value: 0,
        index,
        checked: false
      }
      if (mineArray.includes(tableData[i][j].index)) {
        tableData[i][j].type = 'mine'
        div.classList.add('mine')
      }

      td.appendChild(div)
      tr.appendChild(td)
      index++
    }
    table.appendChild(tr)
  }
  mineArea.appendChild(table)
}

function clearScene() {
  mineArea.innerHTML = ''
  flagArray = []
  flagNum.innerHTML = 0
  mineNumber.innerHTML = curLevel.mineNum
}
function init() {
  // 场景重置
  clearScene()
  // 1 随机生成所选配置对应数量的雷
  mineArray = initMine()
  // 2 生成表格及单元格js对象
  initTalbe()
  // 3.鼠标按下事件
  mineArea.onmousedown = function (e) {
    if (!e.target.classList.contains('flag')) {
      // 没插旗的单元格才能点击
      if (e.button === 0) {
        searchArea(e.target)
      }
    }
    if (e.button === 2) {
      flag(e.target)
    }
  }
}

function showAnswer() {
  var isAllRight = true
  // 1.显示所有雷
  var mineArr = $$('.mine')
  for (var i = 0; i < mineArr.length; i++) {
    mineArr[i].style.opacity = 1
  }
  // 2.分别设置正确、错误旗子的样式
  for (var i = 0; i < flagArray.length; i++) {
    if (flagArray[i].classList.contains('mine')) {
      flagArray[i].classList.add('right')
    } else {
      flagArray[i].classList.add('error')
      isAllRight = false
    }
  }
  // 3.游戏结束，不是全对，则弹出失败窗口
  if (!isAllRight || flagArray.length !== curLevel.mineNum) {
    gameOver(false)
  }
  // 4.游戏结束，清除点击事件。
  mineArea.onmousedown = null
}

function getTableItem(cell) {
  var index = cell.dataset.id
  var flatTableData = tableData.flat()
  var i = flatTableData.filter(item => item.index == index)[0]
  return i
}
function getBound(tableItem) {
  var rowTop = tableItem.row - 1 < 0 ? 0 : tableItem.row - 1
  var rowBottom = tableItem.row + 1 === curLevel.row ? curLevel.row - 1 : tableItem.row + 1
  var colLeft = tableItem.col - 1 < 0 ? 0 : tableItem.col - 1
  var colRight = tableItem.col + 1 === curLevel.col ? curLevel.col - 1 : tableItem.col + 1
  return {
    rowTop,
    rowBottom,
    colLeft,
    colRight
  }
}
function getMineNum(obj) {
  var count = 0
  var { rowTop, rowBottom, colLeft, colRight } = getBound(obj)
  for (var i = rowTop; i <= rowBottom; i++) {
    for (var j = colLeft; j <= colRight; j++) {
      if (tableData[i][j].type === 'mine') {
        count++
      }
    }
  }
  return count
}

function getDom(obj) {
  var divArr = $$('td>div')
  return divArr[obj.index]
}

function getAround(cell) {
  // 当前单元格没插旗，才进行区域搜索
  if (!cell.classList.contains('flag')) {
    cell.parentNode.style.border = 'none'
    cell.classList.remove('canFlag')
    var tableItem = getTableItem(cell)
    if (!tableItem) {
      return
    }
    tableItem.checked = true
    var mineNum = getMineNum(tableItem)
    if (!mineNum) {
      // cell.classList.add('zero')
      var { rowTop, rowBottom, colLeft, colRight } = getBound(tableItem)
      for (var i = rowTop; i <= rowBottom; i++) {
        for (var j = colLeft; j <= colRight; j++) {
          if (!tableData[i][j].checked) {
            getAround(getDom(tableData[i][j]))
          }
        }
      }
    } else {
      cell.innerHTML = mineNum
      var clr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
      cell.classList.add(clr[mineNum])
    }
  }
}

function searchArea(cell) {
  if (cell.classList.contains('mine')) {
    cell.classList.add('error')
    showAnswer()
    return
  } else {
    getAround(cell)
  }
}
function isWin() {
  for (var i = 0; i < flagArray.length; i++) {
    if (!flagArray[i].classList.contains('mine')) {
      return false
    }
  }
  return true
}

function gameOver(isWin) {
  var msg = ''
  if (isWin) {
    msg = 'CONGRATULATION, YOU WIN!!!'
  } else {
    msg = 'SORRY, YOU LOSE!!!'
  }
  // 异步显示弹窗
  setTimeout(() => {
    window.alert(msg)
  }, 0)
}
function flag(cell) {
  if (cell.classList.contains('canFlag')) {
    if (!flagArray.includes(cell)) {
      flagArray.push(cell)
      cell.classList.add('flag')
      if (flagArray.length === curLevel.mineNum) {
        if (isWin()) {
          gameOver(true)
        }
        showAnswer()
      }
    } else {
      var index = flagArray.indexOf(cell)
      flagArray.splice(index, 1)
      cell.classList.remove('flag')
    }
  }
  flagNum.innerHTML = flagArray.length
}
/**
 * 事件函数
 */

function bindEvent() {
  mineArea.oncontextmenu = function (e) {
    e.preventDefault()
  }
  $('.level').onclick = function (e) {
    for (btn of btns) {
      btn.classList.remove('active')
    }
    e.target.classList.add('active')
    switch (e.target.innerHTML) {
      case '简单': {
        curLevel = config.easy
        break
      }
      case '正常': {
        curLevel = config.normal

        break
      }
      case '困难': {
        curLevel = config.hard
        break
      }
    }
    init()
  }
}

/**
 * 主入口
 */
function main() {
  // 1 初始化
  init()
  // 2 绑定事件
  bindEvent()
}

main()
