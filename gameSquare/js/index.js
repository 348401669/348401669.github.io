const step = document.getElementById('num')
const error = document.getElementById('error')
const desc = document.getElementById('desc')
const input = document.querySelector('input')
const seed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
let custom_seed = []
// 计算逆序数总和
const countInversions = arr => {
  // 定义变量inversions用于计数
  let inversions = 0
  // 遍历数组arr，从第一个元素开始，到倒数第二个元素结束
  for (let i = 0; i < arr.length - 1; i++) {
    // 内层循环，从i+1开始，到最后一个元素结束
    for (let j = i + 1; j < arr.length; j++) {
      // 如果arr[i]比arr[j]大，则计数加1
      if (arr[i] > arr[j]) {
        inversions++
      }
    }
  }
  // 返回计数结果
  return inversions
}
// 随机数组
const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
// 检查结果
const check = () => {
  console.log(document.querySelectorAll('td'))
  let flag = true
  document.querySelectorAll('td').forEach((item, i) => {
    if (i + 1 <= seed.length && i + 1 !== parseInt(item.innerText)) {
      flag = false
    }
  })
  if (flag) {
    error.innerText = '恭喜你通关啦!👌'
    // window.alert('✌️✌️✌️\n👍👍👍\nCongratulation, You Win !!!\n🎆🎆🎆\n🎇🎇🎇')
    openModal('✌️✌️✌️✌️✌️✌️<br>👍👍👍👍👍👍<br>Congratulation, You Win !!!<br>🎆🎆🎆🎆🎆🎆<br>🎇🎇🎇🎇🎇🎇')
  }
}
// 更新 td 数据
const init = () => {
  desc.style.visibility = 'hidden'
  const series = [] // 数列
  const data = custom_seed.length ? custom_seed : shuffle(seed)
  const tds = document.querySelectorAll('td')
  for (let i = 0; i < tds.length - 1; i++) {
    let td = tds[i]
    td.innerText = data[i]
    td.className = ''
    series.push(data[i])
  }
  error.innerText = ''
  step.innerText = 0
  const last = tds[tds.length - 1]
  last.className = 'current'
  last.innerText = ''
  // 数列（逆序数）计算，次局是否有解
  const total = countInversions(series)
  if (total % 2 !== 0) desc.style.visibility = 'visible'
  custom_seed = [] // 清空
  seed.sort() // 恢复
}
init()
// 重开
document.getElementById('reset').addEventListener('click', () => {
  input.value = ''
  init()
})
// 自定义数列
document.getElementById('confirm').addEventListener('click', () => {
  const value = input.value
  if (value) {
    custom_seed = value
      .split(',')
      .filter(item => {
        if (item) return item
      })
      .map(item => {
        return parseInt(item)
      })
    let sort_seed = []
    sort_seed = [...custom_seed]
    if (seed.toString() !== sort_seed.sort().toString()) {
      alert('指定数列错误，请输入1 ~ (n-1),并以英文逗号分隔')
      return
    }
    init()
  }
})
// 监听点击事件，移动方块处理
document.querySelector('table').addEventListener('click', event => {
  const target = event.target
  const current = document.querySelector('.current')

  const { x: cx, y: cy } = current.getBoundingClientRect()
  const { x: tx, y: ty } = target.getBoundingClientRect()
  const w = Math.abs(cx - tx)
  const h = Math.abs(cy - ty)
  // 140为两个格式的宽度或高度，格式为正方形
  if ((cx === tx || ty === cy) && w < 140 && h < 140) {
    if (target.nodeName === 'TD' && target !== current) {
      const innerText = target.innerText
      target.classList = 'current'
      target.innerText = ''
      // 当前空白块
      current.innerText = innerText
      current.classList.remove('current')
      // 更新步骤
      let num = step.innerText || 0
      num++
      step.innerText = num
      error.innerText = ''
      check()
    }
  } else {
    error.innerText = '😏不能这样移动😏'
  }
})



/**
 * 打模态框
 */
function openModal(str) {
  document.getElementById('myModal').style.display = 'block'
  var p = document.querySelector('#myModal .modal-content p')
  p.innerHTML = str
  p.style.textAlign = 'center'
  p.style.fontSize = '50px'
}

// 当用户点击span关闭对话框
document.getElementById('close').onclick = function () {
  document.getElementById('myModal').style.display = 'none'
}

// 当用户点击其他地方时关闭对话框
window.onclick = function (event) {
  if (event.target == document.getElementById('myModal')) {
    document.getElementById('myModal').style.display = 'none'
  }
}
