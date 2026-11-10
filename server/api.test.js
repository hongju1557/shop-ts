import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import express from 'express';
import cors from 'cors';

// 실제 라우터를 실행하고 DB 경계만 대체하여 개발 DB를 변경하지 않습니다.
const source = (await readFile(new URL('./index.js', import.meta.url), 'utf8'))
    .replace(/^import .*$/gm, '')
    .replace(/\/\/ 서버 실행[\s\S]*$/, 'return app;');

test('상품 CRUD, 회원가입, 로그인 API 계약', async t => {
    let query = async () => ({ rows: [], rowCount: 0 });
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const factory = new AsyncFunction('express', 'cors', 'process', 'console', 'pg', source);
    const app = await factory(express, cors, { env: {} }, { log() {}, error() {} },
        { Client: class {
            async connect() {}
            query(...args) { return query(...args); }
        } },
    );
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const request = (path, method = 'GET', body) => fetch(
        `http://127.0.0.1:${server.address().port}/api${path}`,
        { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) },
    );
    const product = { pName: '마우스', category: '마우스', price: 1000, description: '설명', image: '/images/mouse.png' };
    const row = { id: 42, p_name: product.pName, category: product.category, price: product.price, description: product.description, image: product.image };

    await t.test('상품 등록은 DB ID와 저장된 데이터를 반환', async () => {
        query = async (sql, values) => {
            assert.match(sql, /INSERT INTO products.*RETURNING \*/);
            assert.equal(values[4], product.image);
            return { rows: [row], rowCount: 1 };
        };
        const response = await request('/products', 'POST', product);
        assert.equal(response.status, 201);
        assert.deepEqual(await response.json(), row);
    });
    await t.test('수정은 이미지와 DB ID를 유지', async () => {
        query = async (sql, values) => {
            assert.match(sql, /UPDATE products.*RETURNING \*/);
            assert.equal(values[4], product.image);
            assert.equal(values[5], '42');
            return { rows: [{ ...row, price: 2000 }], rowCount: 1 };
        };
        const response = await request('/products/42', 'PUT', { ...product, price: 2000 });
        assert.equal(response.status, 200);
        assert.equal((await response.json()).price, 2000);
    });
    await t.test('잘못된 상품 입력은 DB 접근 전에 거절', async () => {
        query = async () => { throw new Error('DB must not be called'); };
        for (const price of [-1, 1.5, '1000', 2147483648]) {
            assert.equal((await request('/products', 'POST', { ...product, price })).status, 400);
        }
        assert.equal((await request('/products/abc')).status, 400);
    });
    await t.test('없는 상품 조회·수정·삭제는 404', async () => {
        query = async () => ({ rows: [], rowCount: 0 });
        for (const method of ['GET', 'PUT', 'DELETE']) {
            assert.equal((await request('/products/42', method, method === 'PUT' ? product : undefined)).status, 404);
        }
    });
    await t.test('삭제 성공 및 DB 실패 응답', async () => {
        query = async () => ({ rows: [], rowCount: 1 });
        assert.equal((await request('/products/42', 'DELETE')).status, 200);
        query = async () => { throw new Error('database unavailable'); };
        assert.equal((await request('/products', 'POST', product)).status, 500);
        assert.equal((await request('/products')).status, 500);
    });
    const signup = { username: 'test12', password: 'password12', name: '테스트', email: 'test@example.com', role: 'admin' };
    const user = { id: 7, username: signup.username, name: signup.name, email: signup.email, role: 'user' };
    await t.test('회원가입은 비밀번호 없는 응답과 서버 기본 권한 사용', async () => {
        query = async (sql, values) => {
            assert.match(sql, /RETURNING id, username, name, email, role/);
            assert.doesNotMatch(sql.split('RETURNING')[0], /role/);
            assert.equal(values.length, 4);
            return { rows: [user], rowCount: 1 };
        };
        const response = await request('/users', 'POST', signup);
        assert.equal(response.status, 201);
        assert.deepEqual(await response.json(), user);
    });
    await t.test('중복 회원 및 유효하지 않은 가입', async () => {
        query = async () => { throw Object.assign(new Error('duplicate'), { code: '23505' }); };
        assert.equal((await request('/users', 'POST', signup)).status, 409);
        assert.equal((await request('/users', 'POST', { ...signup, password: 'short' })).status, 400);
    });
    await t.test('로그인 성공과 인증 실패를 구분', async () => {
        query = async () => ({ rows: [user], rowCount: 1 });
        const response = await request('/users/login', 'POST', signup);
        assert.equal(response.status, 200);
        assert.deepEqual((await response.json()).user, user);
        query = async () => ({ rows: [], rowCount: 0 });
        assert.equal((await request('/users/login', 'POST', signup)).status, 401);
    });
});
