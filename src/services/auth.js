const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  async login(email, password) {
    await delay(700)
    if (!email || !password) return { ok:false, error:'Please fill in all fields.' }
    if (password.length < 4) return { ok:false, error:'Invalid email or password.' }
    return { ok:true }
  },
  async register(data) {
    await delay(700)
    if (!data.name || !data.email || !data.password) return { ok:false, error:'Please fill in all required fields.' }
    if (data.password !== data.confirm) return { ok:false, error:'Passwords do not match.' }
    return { ok:true }
  }
}
