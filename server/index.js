import express from 'express'
import pg from 'pg'
import cors from 'cors'
import bcrypt from "bcrypt"
import session from 'express-session'
import { createRequireAdmin } from './middleware/requireAdmin.js'

// express 객체 생성
const app = express();
const PORT = 8000;

// 쿠키를 주고받을 프런트엔드 주소 (끝에 / 없음)
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}));

// 세션은 로그인 라우터보다 먼저 등록
app.use(session({
    secret: process.env.SESSION_SECRET || "space-shop-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

// 본문 요청 파싱 - 상품등록, 회원가입
app.use(express.json());

// DB 연결
const db = new pg.Client({
    host: "localhost",
    user: "jsuser",
    password: "pwjs",
    database: "tsdb"
})

try{
    await db.connect();
    console.log("PostgreSQL 연결 성공!");
}catch(err){
    console.error("PostgreSQL 연결 실패!", err.message);
}

const requireAdmin = createRequireAdmin(db);

// 기본 라우터
app.get("/", (req, res) => {
    res.send("<h1>쇼핑몰 서버 API 개발</h1>")
})

// 상품 목록 조회
app.get("/api/products", async (req, res) => {
    const sql = "SELECT * FROM products";
    try{
        const result = await db.query(sql); //db에서 꺼내온 데이터
        res.json(result.rows);  //요청한 곳에 반환
    }catch(err){
        // 500: 코드 오류
        console.error("상품 목록 조회 오류!!", err);
        res.status(500).send("상품 목록 조회 오류!!")
    }
});

// 상품 1건 조회
app.get("/api/products/:id", async (req, res) => {
    const pid = req.params.id;  //id 받아오기
    const sql = "SELECT * FROM products WHERE id = $1";
    try{
        const result = await db.query(sql, [pid]); //db에서 꺼내온 데이터
        res.json(result.rows[0]);  //요청한 곳에 반환
    }catch(err){
        console.error("상품 조회 오류!!", err);
        res.status(500).send("상품 조회 오류!!")
    }
});

// 상품 등록
app.post("/api/products", requireAdmin, async (req, res) => {
    const { pName, category, price, description, image} = req.body;
    const sql = "INSERT INTO products(p_name, category, price, description, "
       + " image) VALUES ($1, $2, $3, $4, $5)";
    try{
        await db.query(sql, [pName, category, price, description, image ?? null]);
        res.send("상품 등록 완료!");
    }catch(err){
         console.error("상품 등록 오류!!", err);
        res.status(500).send("상품 등록 오류!!")
    }
})

// 상품 삭제
app.delete("/api/products/:id", async (req, res) => {
    const pid = req.params.id;  //id 받아오기
    const sql = "DELETE FROM products WHERE id = $1";
    try{
        await db.query(sql, [pid]); //db에서 꺼내온 데이터
        res.send("상품 삭제 완료!")  //요청한 곳에 반환
    }catch(err){
        console.error("상품 삭제 오류!!", err);
        res.status(500).send("상품 삭제 오류!!")
    }
});

// 상품 수정
app.put("/api/products/:id", requireAdmin, async (req, res) => {
    const pid = req.params.id;
    const { pName, category, price, description, image} = req.body;
    const sql = "UPDATE products SET p_name=$1, category=$2, price=$3, "
         + " description=$4, image=$5 WHERE id = $6";
    try{
        await db.query(sql, [pName, category, price, description, image ?? null, pid]);
        res.send("상품 수정 완료!");
    }catch(err){
        console.error("상품 수정 오류!!", err);
        res.status(500).send("상품 수정 오류!!")
    }
})

// 회원 목록
app.get("/api/users", async (req, res) => {
    const sql = "SELECT id, username, name, email, role FROM users";
    try{
        const result = await db.query(sql);
        res.json(result.rows);  //요청한 곳으로 json형식으로 반환
    }catch(err){
        console.error("회원 목록 조회 오류!!", err);
        res.status(500).send("회원 목록 조회 오류!!")
    } 
});

// 로그인
app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send("아이디와 비밀번호를 입력해주세요.");
    }

    const sql =
        "SELECT id, username, password, name, email, role FROM users WHERE username=$1";

    try {
        const result = await db.query(sql, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).send("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // 입력한 비밀번호와 DB에 저장된 해시 비교
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        await new Promise((resolve, reject) => {
            req.session.regenerate(err => err ? reject(err) : resolve());
        });
        req.session.userId = user.id;
        await new Promise((resolve, reject) => {
            req.session.save(err => err ? reject(err) : resolve());
        });

        // 비밀번호 해시는 응답에서 제외
        res.json({
            message: "로그인 성공",
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("회원 로그인 중 오류!!", err);
        res.status(500).send("회원 로그인 중 오류!!");
    }
});

// 새로고침 후 세션으로 현재 로그인 사용자 조회
app.get("/api/users/me", async (req, res) => {
    if (!req.session.userId) return res.json({ user: null });
    try {
        const result = await db.query(
            "SELECT id, username, name, email, role FROM users WHERE id=$1",
            [req.session.userId]
        );
        res.json({ user: result.rows[0] ?? null });
    } catch (err) {
        console.error("로그인 상태 조회 오류!!", err);
        res.status(500).send("로그인 상태 조회 오류!!");
    }
});

app.post("/api/users/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("로그아웃 오류!!");
        res.clearCookie("connect.sid", { path: "/" });
        res.sendStatus(204);
    });
});

// 회원 가입
app.post("/api/users", async (req, res) => {
    const { username, password, name, email } = req.body;
    const sql = "INSERT INTO users(username, password, name, email) "
            + "VALUES ($1, $2, $3, $4)";
    try{
        //비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(sql, [username, hashedPassword, name, email]);
        res.send("회원 가입 완료!");
    }catch(err){
        console.error("회원가입 중 오류!!", err);
        if (err.code === '23505') {
            return res.status(409).send("이미 사용 중인 아이디 또는 이메일입니다.");
        }
        res.status(500).send("회원가입 중 오류!!")
    } 
});

// 회원 수정
app.put("/api/users/:id", async (req, res) => {
    const uid = req.params.id;
    const {name, email} = req.body;
    // RETURNING으로 수정한 회원 정보를 반환
    const sql = "UPDATE users SET name=$1, email=$2 WHERE id=$3 "
        + "RETURNING id, username, name, email, role, created_at";

    try {
        const result = await db.query(sql, [name, email, uid]);
        if (result.rows.length === 0) {
            return res.status(404).send("회원을 찾을 수 없습니다.");
        }

        res.json(result.rows[0]);
    } catch(err) {
        if(err.code==="23505"){
            return res.status(409).send("이미 사용중인 이메일입니다.");
        }
        console.error("회원 수정 중 오류!!", err);
        res.status(500).send("회원 수정 중 오류!!");
    }
})



// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행중... http://localhost:${PORT}`);
})

