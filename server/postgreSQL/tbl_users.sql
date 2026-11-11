
-- tsdb/jsuser 접속 확인
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(12)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(50)  NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  role        VARCHAR(10)  NOT NULL DEFAULT 'user'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 초기 데이터 (연습용, 비밀번호 평문)
INSERT INTO users (username, password, name, email, role) VALUES
  ('admin0', 'a1234567', '관리자', 'admin0@spaceshop.com', 'admin'),
  ('ko12',  'k1234567',  '고담덕', 'ko12@example.com',  'user');

SELECT * FROM users;