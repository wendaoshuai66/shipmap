// import store from '@/store'
export default{
  bind(el, binding, vnode) {
    const dialogHeaderEl = binding.value && typeof binding.value === 'number' ? el.querySelector('.map_dialog_title') : el.querySelector(binding.value.dragTitle)
    const dragDom = el
    dragDom.style.cssText += ';'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()
    /**
	 * z-index 切换
	 */
    dragDom.onmousedown = (e) => {
      var arryClass = document.querySelectorAll('.map_dialog')
      for (const v of arryClass) {
        v.classList.remove('maxIndex')
      }
      dragDom.classList.add('maxIndex')
    }
    const _flag = typeof binding.value === 'number' ? binding.value !== 0 : true
    if (_flag) {
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dialogHeaderEl.onmousedown = (e) => {
        // var arryClass = document.querySelectorAll('.map_dialog')
        // for (const v of arryClass) {
        //   v.classList.remove('maxIndex')
        // }
        // dragDom.classList.add('maxIndex')
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop

        // const dragDomWidth = dragDom.offsetWidth
        // const dragDomheight = dragDom.offsetHeight
        //
        // const screenWidth = document.body.clientWidth
        // const screenHeight = document.body.clientHeight

        // const minDragDomLeft = dragDom.offsetLeft
        // const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
        //
        // const minDragDomTop = dragDom.offsetTop
        // const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

        // 获取到的值带px 正则匹配替换
        let styL = getStyle(dragDom, 'left')
        let styT = getStyle(dragDom, 'top')

        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
        } else {
          styL = +styL.replace(/\px/g, '')
          styT = +styT.replace(/\px/g, '')
        }

        document.onmousemove = function(e) {
          // 通过事件委托，计算移动的距离
          const left = e.clientX - disX
          const top = e.clientY - disY

          // 边界处理
          // if (-(left) > minDragDomLeft) {
          //   left = -minDragDomLeft
          // } else if (left > maxDragDomLeft) {
          //   left = maxDragDomLeft
          // }
          //
          // if (-(top) > minDragDomTop) {
          //   top = -minDragDomTop
          // } else if (top > maxDragDomTop) {
          //   top = maxDragDomTop
          // }

          // 移动当前元素
          // console.log(top, 'top')
          // if (top > 8 && -(top) < -8) {
          //   dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
          // }
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
          // const widths = {
          //   left: left + styL,
          //   top: top + styT
          // }
          // store.dispatch('setMemory ', widths)
          // emit onDrag event
        //  vnode.child.$emit('dragDialog')
        }

        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    } else {
      return false
    }
  }
}
