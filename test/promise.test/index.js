import { expect } from 'chai'
import Promise from '../../src/promise/index'

describe('Promise.resolve是否生效', () => {
    it('Promise.resolve生效', () => {
        let value
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1000)
            }, 5000)
        }).then(data => {
            value = data
            expect(value).to.equal(1000)
        })
    })
})

describe('Promise.reject是否生效', () => {
    it('Promise.reject生效', () => {
        let value
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(1000)
            }, 5000)
        }).then(
            resolve => {},
            data => {
                value = data
                expect(value).to.equal(1000)
            }
        )
    })
})

describe('Promise.catch是否生效', () => {
    it('Promise.catch生效', () => {
        let value
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(1000)
            }, 5000)
        })
            .then()
            .catch(err => {
                value = err
                expect(value).to.equal(1000)
            })
    })
})

describe('Promise.all是否生效', () => {
    it('Promise.all生效', () => {
        const list = []
        const async1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list.push('async1'))
            }, 1000)
        })
        const async2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list.push('async2'))
            }, 1000)
        })
        const async3 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list.push('async3'))
            }, 1000)
        })

        Promise.all([async1, async2, async3]).then(() => {
            expect(list.length).to.equal(3)
        })
    })
})

describe('Promise.race是否生效', () => {
    it('Promise.race生效', () => {
        const list = []
        const async1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list.push('async1'))
            }, 1000)
        })
        const async2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list.push('async2'))
            }, 1000)
        })
        const async3 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(list.push('async3'))
            }, 1000)
        })

        Promise.race([async1, async2, async3]).then(() => {
            expect(list.length).to.equal(1)
        })
    })
})
