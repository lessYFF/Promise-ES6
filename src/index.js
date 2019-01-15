/**
 **@type es6实现Promise类
 */

class Promise {
    // promise 状态枚举
    static const STATUS_EUEM =  {
        pending: 'PENDING',     // 初始状态
        fulfilled: 'FULFILLED', // 成功返回状态
        rejected: 'REJECTED'    // 失败返回状态
    };

    constructor(executor) {
        this.status = STATUS_EUEM.pending;
        this.result = null;

    }
}