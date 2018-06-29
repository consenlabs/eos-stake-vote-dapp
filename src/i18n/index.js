import queryString from 'query-string'
import zh from './zh-CN'
import en from './en-US'

export function getCurrentLanguage() {
  const queryLocale = queryString.parse(window.location.search).locale
  if (queryLocale) {
    localStorage.setItem('locale', queryLocale)
  }

  const localeLanguage = queryLocale || localStorage.getItem('locale')
  const currentLanguage = localeLanguage || window.navigator.language.split('-')[0] || 'en'
  return /zh/.test(currentLanguage) ? 'zh' : 'en'
}

export default getCurrentLanguage() === 'zh' ? zh : en
