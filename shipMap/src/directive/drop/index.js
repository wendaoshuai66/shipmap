import drop from './drop'

const install = function(Vue) {
  Vue.directive('map-drop', drop)
}

if (window.Vue) {
  window['map-drag-dialog'] = drop
  Vue.use(install); // eslint-disable-line
}

drop.install = install
export default drop
