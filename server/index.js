import express from 'express'
import pg from 'pg'
import cors from 'cors'

// express 객체 생성
const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());

// 본문 요청 파싱 - 상품등록, 회원가입
app.use(express.json());

// DB 연결
const db = new pg.Client(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
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

// 요청 검증은 DB 쿼리 전에 수행합니다.
app.param('id', (req, res, next, id) => {
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1 || Number(id) > 2147483647) {
        return res.status(400).send('올바른 상품 번호를 입력해주세요.');
    }
    next();
});
const validateProduct = (req, res, next) => {
    const { pName, category, price, description, image } = req.body ?? {};
    if (typeof pName !== 'string' || !pName.trim() || pName.length > 100 ||
        !['마우스', '키보드', '모니터', '주변기기'].includes(category) ||
        !Number.isSafeInteger(price) || price <= 0 || price > 2147483647 ||
        typeof description !== 'string' || !description.trim() ||
        (image != null && (typeof image !== 'string' || image.length > 255))) {
        return res.status(400).send('상품명, 카테고리, 가격, 설명을 올바르게 입력해주세요.');
    }
    next();
};
app.post('/api/products', validateProduct);
app.put('/api/products/:id', validateProduct);
app.post('/api/users', (req, res, next) => {
    const { username, password, name, email } = req.body ?? {};
    if (typeof username !== 'string' || !/^(?=.*[a-z])(?=.*\d)[a-z0-9]{4,12}$/.test(username) ||
        typeof password !== 'string' || password.length < 8 || password.length > 255 ||
        typeof name !== 'string' || !name.trim() || name.length > 50 ||
        typeof email !== 'string' || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).send('회원가입 정보를 올바르게 입력해주세요. 비밀번호는 8자 이상이어야 합니다.');
    }
    next();
});
app.post('/api/users/login', (req, res, next) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
        return res.status(400).send('아이디와 비밀번호를 입력해주세요.');
    }
    next();
});

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
        if (!result.rows[0]) return res.status(404).send("상품을 찾을 수 없습니다.");
        res.json(result.rows[0]);
    }catch(err){
        console.error("상품 조회 오류!!", err);
        res.status(500).send("상품 조회 오류!!")
    }
});

// 상품 등록
app.post("/api/products", async (req, res) => {
    const { pName, category, price, description, image} = req.body;
    const sql = "INSERT INTO products(p_name, category, price, description, "
       + " image) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    try{
        const result = await db.query(sql, [pName.trim(), category, price, description.trim(), image ?? null]);
        res.status(201).json(result.rows[0]);
    }catch(err){
         console.error("상품 등록 오류!!", err);
        res.status(500).send("상품 등록 오류!!")
    }
})

app.delete("/api/products/:id", async (req, res) => {
  const pid = req.params.id;
  const sql = "DELETE FROM products WHERE id = $1";
  try {
    const result = await db.query(sql, [pid]);
    if (!result.rowCount) return res.status(404).send("상품을 찾을 수 없습니다.");
    res.send("상품 삭제 완료!!");
  } catch (err) {
    console.log("상품 삭제 오류!", err);
    res.status(500).send("상품 삭제 중 오류가 발생했습니다.");
  }
});

// 상품 수정
app.put("/api/products/:id", async (req, res) => {
  const pid = req.params.id;
  const { pName, category, price, description, image } = req.body;
  const sql = "UPDATE products SET p_name=$1, category=$2, price=$3, "
        + "description=$4, image=$5 WHERE id=$6 RETURNING *";
  try{
    // image를 보내지 않으면 null로 저장되므로, 수정할 때는 기존 image도 함께 보냅니다.
    const result = await db.query(sql, [pName.trim(), category, price, description.trim(), image ?? null, pid]);
    if (!result.rowCount) return res.status(404).send("상품을 찾을 수 없습니다.");
    res.json(result.rows[0]);
  }catch(err){
    console.log("상품 수정 오류!", err);
    res.status(500).send("상품 수정 중 오류가 발생했습니다.");
  }      
});

app.get("/api/users", async (req, res) => {
  // password는 빼고 필요한 컬럼만 조회합니다.
  const sql = "SELECT id, username, name, email, role, created_at FROM users";
  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.log("회원 조회 오류!", err);
    res.status(500).send("회원 조회 중 오류가 발생했습니다.");
  }
});

// 회원 가입
app.post("/api/users", async (req, res) => {
  const { username, password, name, email} = req.body;
  const sql = "INSERT INTO users(username, password, name, email) "
        + "VALUES ($1, $2, $3, $4) RETURNING id, username, name, email, role, created_at";
  try{
    const result = await db.query(sql, [username, password, name.trim(), email.trim()]);
    res.status(201).json(result.rows[0]);
  }catch(err){
    if (err.code === "23505") return res.status(409).send("이미 사용 중인 아이디 또는 이메일입니다.");
    console.log("회원 가입 오류!", err);
    res.status(500).send("회원 가입 중 오류가 발생했습니다.");
  }
});

// 로그인
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  // 비밀번호로 비교만 하고, 응답에는 password를 넣지 않습니다.
  const sql = "SELECT id, username, name, email, role, created_at FROM users "
        + "WHERE username = $1 AND password = $2";
  try {
    const result = await db.query(sql, [username, password]);
    if (result.rows.length === 0) {
      return res.status(401).send("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    res.json({
      message: "로그인 성공",
      user: result.rows[0]
    });
  } catch (err) {
    console.log("회원 로그인 오류!", err);
    res.status(500).send("로그인 중 오류가 발생했습니다.");
  }
});


// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행중... http://localhost:${PORT}`);
})
