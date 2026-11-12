import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequireAdmin } from './requireAdmin.js';

const check = async ({ userId, role, missing = false, fail = false }) => {
    const queries = [];
    const db = { query: async (sql, params) => {
        queries.push({ sql, params });
        if (fail) throw new Error('DB unavailable');
        return { rows: missing ? [] : [{ role }] };
    } };
    const res = {
        statusCode: 200,
        status(code) { this.statusCode = code; return this; },
        send(message) { this.message = message; return this; }
    };
    let allowed = false;
    await createRequireAdmin(db)(
        { session: { userId }, body: { role: 'admin', userId: 999 } },
        res,
        () => { allowed = true; }
    );
    return { status: res.statusCode, allowed, queries };
};

test('로그인하지 않은 요청은 body에 admin을 넣어도 거절', async () => {
    const result = await check({});
    assert.equal(result.status, 401);
    assert.equal(result.allowed, false);
    assert.equal(result.queries.length, 0);
});

test('일반 회원은 거절하고 세션의 사용자 ID로 조회', async () => {
    const result = await check({ userId: 7, role: 'user' });
    assert.equal(result.status, 403);
    assert.equal(result.allowed, false);
    assert.deepEqual(result.queries[0].params, [7]);
});

test('관리자는 상품 처리로 진행', async () => {
    assert.equal((await check({ userId: 7, role: 'admin' })).allowed, true);
});

test('삭제된 회원의 세션은 거절', async () => {
    const result = await check({ userId: 7, missing: true });
    assert.equal(result.status, 401);
    assert.equal(result.allowed, false);
});

test('DB 오류가 발생하면 상품 처리로 진행하지 않음', async () => {
    const result = await check({ userId: 7, fail: true });
    assert.equal(result.status, 500);
    assert.equal(result.allowed, false);
});
