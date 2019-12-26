function domain() {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境下，本地地址
    return 'http://localhost:3001/'
  }
  return 'http://www.firepage.xyz/'// 正式域名
}


export default domain()
