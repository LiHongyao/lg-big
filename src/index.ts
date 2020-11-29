/**
 * 操作符类型运算符
 * +：加法运算
 * -：减法运算
 * *：乘法运算
 * /：除法运算
 */
type OperationType = '+' | '-' | '*' | '/';

class Big {
  /**
   * Big值
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
        result = (n1 * t2) / (t1 * n2);
        break;
      default:
        result = 0;
    }
    return new Big(result);
  }
  /**
   * 数值化
   * @param n
   */
  private numeric(n: number | Big) {
    return n instanceof Big ? n.v : n;
  }

  /**
   * 加法运算
   * @param n
   */
  public plus(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '+');
  }
  /**
   * 减法运算
   * @param n
   */
  public minus(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '-');
  }
  /**
   * 乘法运算
   * @param n
   */
  public multipliedBy(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '*');
  }
  /**
   * 触发运算
   * @param n
   */
  public dividedBy(n: number | Big) {
    return this.operation(this.v, this.numeric(n), '/');
  }
  /**
   * 解析结果
   */
  public parse() {
    return this.v;
  }
  /**
   * 小数点后固定指定位数，比如固定小数点后5位数字，则有
   * 30 ==> 30.00000
   * 3.14 ===> 3.14000
   * @param n
   */
  public static digits(v: number | Big, len: number = 2) {
    if (Number.isInteger(v)) {
      return `${v}.${Array(len).fill(0).join('')}`;
    } else {
      const [prefix, suffix] = v.toString().split('.');
      const sLen = suffix.length;
      if (sLen > len) {
        return `${prefix}.${suffix.slice(0, len)}`;
      } else if (sLen < len) {
        return `${prefix}.${suffix}${Array(len - sLen)
          .fill(0)
          .join('')}`;
      } else {
        return `${prefix}.${suffix}`;
      }
    }
  }
  public digits(len: number) {
    return Big.digits(this.v, len);
  }
  /**
   * 人民币格式处理
   * - 非数字：返回0
   * - 整数：直接返回
   * - 小数：保留小数点后两位，超出两位则截取
   * @param v
   */
  public static rmb(v: string | number) {
    if (isNaN(Number(v))) {
      return '0';
    } else {
      const foo = v.toString();
      if (/^[0-9]+$/.test(foo)) {
        return foo;
      } else {
        const [prefix, suffix] = foo.split('.');
        const sLen = suffix.length;
        if (sLen > 2) {
          return `${prefix}.${suffix.slice(0, 2)}`;
        } else if (sLen < 2) {
          return `${foo}0`;
        } else {
          return foo;
        }
      }
    }
  }
  public rmb() {
    return Big.rmb(this.v);
  }
}

export default Big;
