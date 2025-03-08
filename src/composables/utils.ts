// import { ElNotification, ElMessageBox} from 'element-plus'
import nprogress from 'nprogress'

export function toast(message:string, type = 'success', dangerouslyUseHTMLString=true){
  ElNotification({
    message,
    type: type,
    dangerouslyUseHTMLString,
    duration: 3000
  })
}

export function showModel(content:string, type= 'warning', title='Warning'){
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type,
    }
  )
}
// 显示全屏loading
export function showFullLoading() {
  nprogress.start()
}
// 隐藏全屏loading
export function hideFullLoading() {
  nprogress.done()
}
// 弹出输入框
export function showPrompt(tip: string, value = '',) {
  return  ElMessageBox.prompt(tip, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  })
}
