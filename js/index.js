(async function () {
  // 验证是否登录，如未登录提示用户登录
  //需要的dom
  const dom = {
    loginId: $("#loginId"), //用户ID
    nickname: $("#nickname"), //头像昵称
    close: $(".close"), //关闭按钮
    chatContainer: $(".chat-container"), //聊天记录界面
    form: $(".msg-container"), //发送消息表单
    input: $("#txtMsg"), //填写消息的文本框
  };
  const resp = await API.profile();
  const user = resp.data; //拿到用户信息
  if (resp.code) {
    alert(resp.msg + "请重新登陆");
    location.href = "/login.html";
    return;
  }
  // 初始化界面
  async function init() {
    //下面代码是在登陆成功后运行的
    // 设置用户信息
    setUserInfo();
    //加载历史记录
    await setHistory();

    //设置用户信息
    function setUserInfo() {
      dom.loginId.innerText = user.loginId;
      dom.nickname.innerText = user.nickname;
    }
    //加载历史聊天记录到页面上
    async function setHistory() {
      const history = await API.getHistory();
      for (const item of history.data) {
        addChat(item);
      }
      setScroll();
    }

    bindEvent();
  }
  //绑定事件
  function bindEvent() {
    //注册注销事件
    //关闭窗口自动注销该账号
    dom.close.onclick = function () {
      API.loginOut();
      location.href = "/login.html";
    };
    //注册表单提交事件
    dom.form.onsubmit = async function (e) {
      e.preventDefault();
      sendMsg();
    };
  }
  //创建历史记录加到页面中
  //   content: "你好!";
  //   createdAt: 1654002607910;
  //   from: "Wlibra1016";
  //   to: null;
  function addChat(info) {
    const div = $$$("div");
    div.className = "chat-item";
    if (info.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = info.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = info.content;
    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatData(info.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    dom.chatContainer.appendChild(div);
  }
  //初始化日期格式
  function formatData(time) {
    const date = new Date(time);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDay().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  //设置聊天记录显示最后一条所在位置
  function setScroll() {
    dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;
  }
  //发送消息
  async function sendMsg() {
    const content = dom.input.value.trim();
    if (!content) {
      return;
    }
    //用户发送消息
    addChat({
      content,
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
    });
    dom.input.value = "";
    setScroll();
    //机器人回复消息
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    setScroll();
  }
  init();
})();
