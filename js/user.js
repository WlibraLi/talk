// 用户注册和登录表单项验证的通用代码
//对某一个表单项的验证
class FieldValidator {
  /**
   *构造器
   * @param {string} txtId
   * @param {function} validatorFunc
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    //文本框验证
    this.input.onblur = () => {
      this.validate();
    };
  }
  /**
   * 验证：成功返回true,失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 对所有的验证器进行统一的验证,
   * 如果所有的验证均通过则返回true,否则返回false
   * @param {[]} validator
   */
  static async validate(...validator) {
    //调用所有验证器的验证方法拿到每个验证方法返回的promise
    const prom = validator.map((r) => r.validate());
    //拿到所有的promise的验证结果
    const task = await Promise.all(prom);
    return task.every((r) => r);
  }
}
