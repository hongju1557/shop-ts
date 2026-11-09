import express from 'express'
import pg from 'pg'

// express 객체 생성
const app = express();
const PORT = 8000;

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
        res.send("상품 목록 조회 오류!!")
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
        res.send("상품 조회 오류!!")
    }
});

// 상품 등록
app.post("/api/products", async (req, res) => {
    const { pName, category, price, description, image} = req.body;
    const sql = "INSERT INTO products(p_name, category, price, description, "
       + " image) VALUES ($1, $2, $3, $4, $5)";
    try{
        await db.query(sql, [pName, category, price, description, image ?? null]);
        res.send("상품 등록 완료!");
    }catch(err){
         console.error("상품 등록 오류!!", err);
        res.send("상품 등록 오류!!")
    }
})

app.delete("/api/products/:id", async (req, res) => {
  const pid = req.params.id;
  const sql = "DELETE FROM products WHERE id = $1";
  try {
    await db.query(sql, [pid]);
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
        + "description=$4, image=$5 WHERE id=$6";
  try{
    // image를 보내지 않으면 null로 저장되므로, 수정할 때는 기존 image도 함께 보냅니다.
    await db.query(sql, [pName, category, price, description, image ?? null, pid]);
    res.send("상품 수정 완료!!");
  }catch(err){
    console.log("상품 수정 오류!", err);
    res.status(500).send("상품 수정 중 오류가 발생했습니다.");
  }      
});


// 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행중... http://localhost:${PORT}`);
})