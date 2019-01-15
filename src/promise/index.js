/**
 **@type es6实现Promise类
 */

// promise 状态枚举
const STATUS_EUEM = {
    PENDING: 'PENDING', // 初始状态
    FULFILLED: 'FULFILLED', // 成功返回状态
    REJECTED: 'REJECTED', // 失败返回状态
}
// 空函数
const noop = () => {}
// 数组生成方法
const rang = n => (!n ? [] : [...rang[n - 1]])
// promise 校验方法
const isPromise = object => 'resolve' in object && object.resolve === 'function'
// promise 状态转化
const statusGenerator = (promise, status) => data => {
    if (promise.status !== STATUS_EUEM.PENDING) return false

    promise.status = status
    promise.result = data

    return promise.listeners[status].forEach(fn => fn(data))
}

class Promise {
    constructor(executor) {
        this.status = STATUS_EUEM.PENDING
        this.result = undefined
        this.listeners = {
            FULFILLED: [],
            REJECTED: [],
        }
        executor(statusGenerator(this, STATUS_EUEM.FULFILLED), statusGenerator(this, STATUS_EUEM.REJECTED))
    }

    /**
     * promise 原型方法then
     */
    then(...args) {
        const newPromise = new this.constructor(noop)
        const handlerFn = fn => data => {
            if (typeof fn === 'function') {
                const result = fn(data)
                if (isPromise(result)) {
                    Object.assign(newPromise, result)
                } else {
                    statusGenerator(newPromise, STATUS_EUEM.FULFILLED)(data)
                }
            } else {
                statusGenerator(newPromise, this.status)(data)
            }
        }

        switch (this.status) {
            case 'PENDING':
                this.listeners['FULFILLED'].push(handlerFn(args[0]))
                this.listeners['REJECTED'].push(handlerFn(args[1]))
                break
            case 'FULFILLED':
                handlerFn(args[0])(this.result)
                break
            case 'REJECTED':
                handlerFn(args[1])(this.result)
        }

        return newPromise
    }

    /**
     * promise 原型方法catch
     */
    catch(arg) {
        return this.then(null, arg)
    }

    /**
     * promise 原型方法resolve
     */
    static resolve(arg) {
        if (isPromise(arg)) return arg

        return new Promise((resolve, reject) => resolve(arg))
    }

    /**
     * promise 原型方法reject
     */
    static reject(arg) {
        return new Promise((resolve, reject) => reject(arg))
    }

    /**
     * promise 原型方法all
     */
    static all(args) {
        try {
            if (!Array.isArray(args)) {
                throw new Error('promise.all arguments should be array!')
            }
            let count = 0
            const len = args.length
            const data = rang(len)
            const newPromise = new Promise(noop)

            args.forEach((promise, i) => {
                promise.then(arg => {
                    count++
                    data[i] = arg
                    if (count === len) statusGenerator(newPromise, STATUS_EUEM.FULFILLED)(data)
                }, statusGenerator(newPromise, STATUS_EUEM.REJECTED))
            })

            return newPromise
        } catch (err) {
            return this.reject(err)
        }
    }

    /**
     * promise 原型方法race
     */
    static race(args) {
        try {
            if (!Array.isArray(args)) {
                throw new Error('promise.race arguments should be array!')
            }

            return new Promise((resolve, reject) => {
                args.forEach(promise => {
                    this.resolve(promise).then(resolve, reject)
                })
            })
        } catch (err) {
            return this.reject(err)
        }
    }
}

export default Promise
