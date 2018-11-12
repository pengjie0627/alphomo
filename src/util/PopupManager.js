import { addClass, removeClass } from 'util/DomUtil'

let hasModal = false

const getModal = function () {
  let modalDom = PopupManager.modalDom
  if (modalDom) {
    hasModal = true
  } else {
    hasModal = false
    modalDom = document.createElement('div')
    PopupManager.modalDom = modalDom

    modalDom.addEventListener('touchmove', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

    modalDom.addEventListener('click', function () {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick()
    })
  }

  return modalDom
}

const instances = {}
// const clearListeners = []

const PopupManager = {
  zIndex: 2000,
  idSeed: 1,

  modalFade: true,

  getInstance: function (id) {
    return instances[id]
  },

  register: function (id, instance) {
    if (id && instance) {
      instances[id] = instance
    }
  },

  deregister: function (id) {
    if (id) {
      instances[id] = null
      delete instances[id]
    }
  },

  nextZIndex: function () {
    return PopupManager.zIndex++
  },

  nextId: function () {
    return PopupManager.idSeed++
  },

  modalStack: [],

  doOnModalClick: function () {
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1]
    if (!topItem) return

    const instance = PopupManager.getInstance(topItem.id)
    if (instance && instance.closeOnClickModal) {
      instance.hide()
    }
  },

  openModal: function (id, zIndex, dom, modalClass, modalFade) {
    if (!id || zIndex === undefined) return
    this.modalFade = modalFade

    const modalStack = this.modalStack

    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i]
      if (item.id === id) {
        return
      }
    }

    const modalDom = getModal()

    addClass(modalDom, 'v-modal')
    if (this.modalFade && !hasModal) {
      addClass(modalDom, 'v-modal-enter')
    }
    if (modalClass) {
      let classArr = modalClass.trim().split(/\s+/)
      classArr.forEach(item => addClass(modalDom, item))
    }
    setTimeout(() => {
      removeClass(modalDom, 'v-modal-enter')
    }, 200)

    if (dom && dom.nodeType !== 11) {
      dom.appendChild(modalDom)
    } else {
      document.body.appendChild(modalDom)
    }

    if (zIndex) {
      modalDom.style.zIndex = zIndex
    }
    modalDom.tabIndex = 0
    modalDom.style.display = ''

    this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass, target: dom || document.body })
  },

  closeModal: function (id) {
    const modalStack = this.modalStack
    const modalDom = getModal()

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1]
      if (topItem.id === id) {
        if (topItem.modalClass) {
          let classArr = topItem.modalClass.trim().split(/\s+/)
          classArr.forEach(item => removeClass(modalDom, item))
        }

        modalStack.pop()
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex
          let newTop = modalStack[modalStack.length - 1]
          newTop.target.appendChild(modalDom)
        }
      } else {
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1)
            break
          }
        }
      }
    }

    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, 'v-modal-leave')
      }
      setTimeout(() => {
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom)
          modalDom.style.display = 'none'
          PopupManager.modalDom = undefined
        }
        removeClass(modalDom, 'v-modal-leave')
      }, 200)
      // clearListeners.forEach(listener => {
      //   listener()
      // })
    }
  },

  hasModal(element) {
    const modalDom = getModal()
    if (modalDom && modalDom.style.zIndex) {
      let index = parseInt(modalDom.style.zIndex)
      while (element && element.style && !element.style.zIndex) {
        element = element.parentElement
      }
      if(element){
        return index > parseInt(element.style.zIndex)
      }else{
        return true
      }
    }
    return false
  },

  getTop() {
    return getTopPopup()
  }
}

const getTopPopup = function () {
  if (PopupManager.modalStack.length > 0) {
    const topPopup = PopupManager.modalStack[PopupManager.modalStack.length - 1]
    if (!topPopup) return
    const instance = PopupManager.getInstance(topPopup.id)

    return instance
  }
}

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 27) {
    const topPopup = getTopPopup()

    if (topPopup && topPopup.closeOnPressEscape) {
      topPopup.handleClose
        ? topPopup.handleClose()
        : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close())
    }
  }
})

export default PopupManager
