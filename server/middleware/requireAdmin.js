// 요청 본문의 role 대신 서버 세션과 DB의 최신 역할을 확인합니다.
export const createRequireAdmin = (db) => async (req, res, next) => {
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(401).send("로그인이 필요합니다.");
    }

    try {
        const result = await db.query("SELECT role FROM users WHERE id=$1", [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).send("로그인이 필요합니다.");
        }
        if (user.role !== "admin") {
            return res.status(403).send("관리자만 상품을 등록하거나 수정할 수 있습니다.");
        }
    } catch (err) {
        console.error("관리자 권한 확인 오류!!", err);
        return res.status(500).send("권한 확인 중 오류가 발생했습니다.");
    }

    next();
};
