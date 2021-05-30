import { getCalendarData, dateUtil } from '../utils/index'
import { renderCalendar } from '../render'

function updateDatePropertyOfTodoLabel(todos, dates, showLabelAlways) {
  const datesInfo = [...dates]
  for (let todo of todos) {
    let targetIdx = datesInfo.findIndex(
      item => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(todo)
    )
    let target = datesInfo[targetIdx]
    if (!target) continue

    target.flowSrc = todo.flowSrc
  }
  return datesInfo
}

function deleteDatePropertyOfTodoLabel(todos, dates, showLabelAlways) {
  const datesInfo = [...dates]
  for (let todo of todos) {
    let targetIdx = datesInfo.findIndex(
      item => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(todo)
    )
    let target = datesInfo[targetIdx]
    if (!target) continue

    delete target.flowSrc
  }
  return datesInfo
}

export default () => {
  return {
    name: 'flower',
    beforeRender(calendarData = {}, calendarConfig = {}, component) {
      console.log('----components/calendar-v3/plugins/flower.beforeRender', calendarData, calendarConfig, component);

      const { flowers = [], dates = [] } = calendarData
      const dateWithTodoInfo = updateDatePropertyOfTodoLabel(
        flowers,
        dates
      )

      return {
        calendarData: {
          ...calendarData,
          dates: dateWithTodoInfo
        },
        calendarConfig,
      }
    },
    methods(component) {
      return {
        setFlowers: (options = {}) => {
          const calendar = getCalendarData('calendar', component)
          if (!calendar || !calendar.dates) {
            return Promise.reject('请等待日历初始化完成后再调用该方法')
          }
          const {
            showLabelAlways,
            dates: todoDates = []
          } = options
          const { flowers = [] } = calendar
          const tranformStr2NumOfTodo = todoDates.map(date =>
            dateUtil.tranformStr2NumOfDate(date)
          )
          const calendarData = {
            dates: calendar.dates,
            flowers: dateUtil.uniqueArrayByDate(
              flowers.concat(tranformStr2NumOfTodo)
            )
          }
          const existCalendarData = getCalendarData('calendar', component)
          return renderCalendar.call(component, {
            ...existCalendarData,
            ...calendarData
          })
        },
        deleteFlowers(flowers = []) {
          if (!(flowers instanceof Array) || !flowers.length)
            return Promise.reject('deleteFlowers()应为入参为非空数组')
          const existCalendarData = getCalendarData('calendar', component)
          const allTodos = existCalendarData.flowers || []
          const toDeleteTodos = flowers.map(item => dateUtil.toTimeStr(item))
          const remainTodos = allTodos.filter(
            item => !toDeleteTodos.includes(dateUtil.toTimeStr(item))
          )
          const { dates, curYear, curMonth } = existCalendarData
          const _dates = [...dates]
          
          deleteDatePropertyOfTodoLabel(flowers, _dates)

          return renderCalendar.call(component, {
            ...existCalendarData,
            dates: _dates,
            flowers: remainTodos
          })
        },
      }
    },
  };
}
