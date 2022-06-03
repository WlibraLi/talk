(function () {
  const loginIdValidator = new FieldValidator("txtLoginId", async function (
    val
  ) {
    if (!val) {
      return "账号不能为空";
    }
    const resp = await API.exists(val);
    if (resp.data) {
      return "该账号已存在";
    }
  });
  const nicknameValidator = new FieldValidator("txtNickname", function (val) {
    if (!val) {
      return "昵称不能为空";
    }
  });

  const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
    if (!val) {
      return "密码不能为空";
    }
  });

  const loginPwdAgainValidator = new FieldValidator(
    "txtLoginPwdConfirm",
    function (val) {
      if (!val) {
        return "请确认密码";
      }
      if (val !== loginPwdValidator.input.value) {
        return "两次密码不一致，请重新确认";
      }
    }
  );
  //验证表单是否可以提交
  const form = $(".user-form");

  form.onsubmit = async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validate(
      loginIdValidator,
      nicknameValidator,
      loginPwdValidator,
      loginPwdAgainValidator
    );
    if (!result) {
      //验证通过
      return;
    } else {
      //new FormData(form)拿到表单数据
      //es6详细版entries拿到所有的键值对
      const formData = Object.fromEntries(new FormData(form).entries());
      const resp = await API.reg(formData);
      if (!resp.code) {
        location.href = "./login.html";
      }
    }
  };
})();
