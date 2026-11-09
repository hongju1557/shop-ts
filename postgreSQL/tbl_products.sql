
-- tsdb(db) / jsuser(계정) 접속
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  p_name      VARCHAR(100) NOT NULL,
  category    VARCHAR(20)  NOT NULL
              CHECK (category IN ('마우스', '키보드', '모니터', '주변기기')),
  price       INTEGER      NOT NULL CHECK (price >= 0),
  description TEXT         NOT NULL DEFAULT '',
  image       VARCHAR(255),          -- 이미지 경로 (없으면 NULL)
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO products (p_name, category, price, description, image) VALUES
  ('무선 마우스', '마우스',   25000,  '조용한 클릭음의 2.4GHz 무선 마우스', '/images/mouse.png'),
  ('기계식 키보드', '키보드',   89000,  '청축 스위치, RGB 백라이트', '/images/keyboard.png');

-- 전체 조회
SELECT * FROM products;



