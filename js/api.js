var API = (function () {
  const USER_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";
  //封装get函数
  function getPath(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(USER_URL + path, { headers });
  }
  //封装post函数
  function postPath(path, obj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(USER_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(obj),
    });
  }
  /**
   * 注册一个账号
   * @param {用户对象} userInfo 包括loginId、loginPwd、nickname
   * @returns Promise  返回的是响应头
   */
  async function reg(userInfo) {
    const headResp = await postPath("/api/user/reg", userInfo);
    return await headResp.json();
  }
  /**
   * 登录一个已有的账号
   * @param {用户账号和密码} loginInfo
   * @returns Promise 返回的是响应头
   */
  async function login(loginInfo) {
    const headResp = await postPath("/api/user/login", loginInfo);
    const result = await headResp.json();
    //表示登陆成功
    if (!result.code) {
      // 把令牌保存起来
      const token = headResp.headers.get("authorization");
      // console.log(headResp.headers);
      // console.log(token);
      // console.log(headResp.headers.authorization);
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }
  /**
   * 验证一个账号是否存在
   * @param {用户账号} loginId
   */
  async function exists(loginId) {
    const headResp = await getPath("/api/user/exists?loginId=" + loginId);
    return await headResp.json();
  }
  /**
   * 当前用户登录信息
   */
  async function profile() {
    const headResp = await getPath("/api/user/profile");
    return await headResp.json();
  }
  /**
   * 发送聊天消息
   */
  async function sendChat(content) {
    const headResp = await postPath("/api/chat", {
      content,
    });
    return await headResp.json();
  }

  /**
   * 得到聊天历史记录
   */
  async function getHistory() {
    const headResp = await getPath("/api/chat/history");
    return headResp.json();
  }
  /**
   * 注销账号
   */
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
