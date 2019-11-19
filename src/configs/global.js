/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue
 * 通过this.global调用
 */

// 后台管理服务器地址
export const baseUrl = 'http://localhost:8030'

export const defaultDialogWidth = '60%'

export default {
  baseUrl,
  defaultDialogWidth
}
