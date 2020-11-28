/**
 * 操作符类型
 */
type OperationType = '+' | '-' | '*' | '/';
class Big {
  /**
   * 当前值
   */
  private v: number;
  /**
   * 构造函数
   * @param v 初始值
   */
  constructor(v: number) {
    this.v = v;
  }

  /**
   * 转换整数，返回倍数及整数值，比如
   * 1000 >>> { times: 1, num: 100 }   ===> 100
   * 3.14 >>> { times: 100, num: 3.14} ===> 314
   * @param n number
   */
  private toInteger(n: number) {
    const ret = { times: 1, num: 0 };
    if (Number.isInteger(n)) {
      ret.num = n;
      return ret;
    }
    ret.times = Math.pow(10, n.toString().split('.')[1].length);
    ret.num = parseInt((n * ret.times + 0.5).toString(), 10);
    return ret;
  }
  /**
   * 执行运算
   * @param m 数值m
   * @param n 数值n
   * @param key 运算符
   */
  private operation(m: number = 0, n: number = 0, key: OperationType) {
    const o1 = this.toInteger(m);
    const o2 = this.toInteger(n);

    const n1 = o1.num;
    const n2 = o2.num;

    const t1 = o1.times;
    const t2 = o2.times;

    const max = Math.max(t1, t2);
    let result = null;
    switch (key) {
      case '+':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2;
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2);
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2;
        }
        result /= max;
        break;
      case '-':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        result /= max;
        break;
      case '*':
        result = (n1 * n2) / (t1 * t2);
        break;
      case '/':
        result = (n1 / n2) * (t2 / t1);
        break;
      default:
        result = 0;
    }
    return new Big(result);
  }
  /**
   *
   * @param n
   */
  private numeric(n: number | Big) {
    return n instanceof Big ? n.v : n;
  }

  /**
   * 加
   * @param n
   */
  public plus(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '+');
  }
  /**
   * 减
   * @param n
   */
  public minus(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '-');
  }
  /**
   * 乘
   * @param n
   */
  public multipliedBy(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '*');
  }
  /**
   * 除
   * @param n
   */
  public dividedBy(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '/');
  }
  /**
   * 解析
   */
  public parse() {
    return this.v;
  }
}

export default Big;
