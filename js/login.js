(function () {
  const loginIdValidator = new FieldValidator("txtLoginId", async function (
    val
  ) {
    if (!val) {
      return "账号不能为空";
    }
  });

  const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
    if (!val) {
      return "密码不能为空";
    }
  });

  //验证表单是否可以提交
  const form = $(".user-form");

  form.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate(
      loginIdValidator,
      loginPwdValidator
    );
    if (!result) {
      //验证通过
      return;
    } else {
      //new FormData(form)拿到表单数据
      //es6详细版entries拿到所有的键值对
      const formData = Object.fromEntries(new FormData(form).entries());
      const resp = await API.login(formData);
      if (!resp.code) {
        location.href = "/index.html";
      } else {
        loginIdValidator.p.innerText = "账号或密码错误";
        loginPwdValidator.input.value = "";
      }
    }
  };
})();
