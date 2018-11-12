import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import locale from 'element-ui/lib/locale'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en/index'
import zhLocale from './zh/index'

let userLanguage = navigator.language || navigator.userLanguage // 常规浏览器语言和IE浏览器
userLanguage = userLanguage.substr(0, 2)
if (userLanguage !== 'zh' && userLanguage !== 'en') {
  userLanguage = 'en'
}
Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}
const localLang = Cookies.get('_l_') ? Cookies.get('_l_').substr(0, 2) : null
const i18n = new VueI18n({
  locale: localLang || userLanguage, // set locale
  messages // set locale messages
})
export const currLanguage = userLanguage
export const isI18n = (i18n.locale === 'zh') ? 1 : 0
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
