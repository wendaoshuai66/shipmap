export default{
  bind(el, binding, vnode) {
    const dragDom = el
    const tableDiv1 = el.querySelector('.el-table')
    const tableDiv = el.querySelector('.el-table__body-wrapper')
    const _flag = typeof binding.value === 'number' ? binding.value !== 0 : true
    if (_flag) {
      const resizeEl = document.createElement('div')
      dragDom.appendChild(resizeEl)
      // 在弹窗右下角加上一个10-10px的控制块
      resizeEl.style.cursor = 'se-resize'
      resizeEl.style.position = 'absolute'
      resizeEl.style.height = '10px'
      resizeEl.style.width = '10px'
      resizeEl.style.right = '0px'
      resizeEl.style.bottom = '0px'
      // 鼠标拉伸弹窗
      resizeEl.onmousedown = (e) => {
        // 记录初始x位置
        // const clientX = e.clientX
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - resizeEl.offsetLeft
        const disY = e.clientY - resizeEl.offsetTop
        const tableHeight = dragDom.clientHeight
        document.onmousemove = function(e) {
          e.preventDefault() // 移动时禁用默认事件
          // 通过事件委托，计算移动的距离
          const x = e.clientX - disX // + (e.clientX - clientX) 这里 由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
          const y = e.clientY - disY
          // 比较是否小于最小宽高
          dragDom.style.width = `${x}px`
          if (tableHeight > 270) {
            if (y > 270) {
              dragDom.style.height = `${y}px`
              tableDiv.style.maxHeight = `${y - 80}px`
              tableDiv1.style.maxHeight = `${y - 10}px`
            }
          } else {
            return false
          }
          // dragDom.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
          // dragDom.style.height = y > minHeight ? `${y}px` : minHeight + 'px';
        }
        // 拉伸结束
        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  }
}
