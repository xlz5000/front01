import { useEffect, useState } from "react";
import { guestBookList } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

import "./GuestBookList.css";
import { Button } from "@mui/material";

export default function GuestBookList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const m_idx = localStorage.getItem("tokens");
        // const response = await myPage(m_idx);
        const response = await guestBookList();
        console.log(response);

        if (response.data.success) {
          setList(response.data.data);
        } else {
          setError("방명록을 불러올수 없습니다.");
        }
      } catch (err) {
        console.error("가져오기 실패", err);
        setError("방명록을 불러올수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ colors: "red" }}>{error}</div>;
  return (
    <div className="guestbook-container">
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/insertguestbook")}
      >
        글쓰기
      </Button>
      {list.map((k, idx) => (
        <div key={idx} className="guestbook-card">
          <Link to={`/searchguestbook/${k.gb_idx}`} className="guestbook-link">
            제목: {k.gb_subject}
          </Link>
          <div className="guestbook-meta">
            작성자: {k.gb_name} <br />
            내용: {k.gb_content}
          </div>
        </div>
      ))}
    </div>
  );
}
