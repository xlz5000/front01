import { useEffect, useState } from "react";
import { searchguestbook } from "../api/auth";
import { useParams, useNavigate } from "react-router-dom";
import { deleteGuestBook } from "../api/auth";
import "./SearchGuestBook.css";

export default function SearchGuestBook() {
  const { gb_idx } = useParams();
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [pwdCheck, setPwdCheck] = useState(false);
  const [inputPw, setInputPw] = useState("");
  const [pwdTried, setPwdTried] = useState(false); // 비밀번호 시도 여부
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (gb_idx) => {
      try {
        //const m_idx = localStorage.getItem("tokens");
        // const response = await myPage(m_idx);
        const response = await searchguestbook(gb_idx);
        console.log(response);

        if (response.data.success) {
          setSearch(response.data.data);
        } else {
          setError("방명록세부사항항을 불러올수 없습니다.");
        }
      } catch (err) {
        console.error("가져오기 실패", err);
        setError("방명록세부사항을 불러올수 없습니다.오류임");
      } finally {
        setLoading(false);
      }
    };

    fetchData(gb_idx);
  }, [gb_idx]);

  const handleEdit = () => {
    navigate(`/updateguestbook/${gb_idx}`);
  };

  const handleDelete = async (gb_idx) => {
    try {
      const response = await deleteGuestBook(gb_idx);

      console.log("응답 전체:", response.data);
      if (response.data.success) {
        alert("삭제되었습니다.");
        navigate("/guestbooklist");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handlePwd = (e) => {
    setPwdTried(true);
    if (inputPw === search.gb_pw) {
      setPwdCheck(true);
    } else {
      setPwdCheck(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ colors: "red" }}>{error}</div>;
  return (
    <div className="search-container">
      <div className="search-title">방명록 세부사항</div>
      <div className="search-field">제목: {search.gb_subject}</div>
      <div className="search-field">작성자: {search.gb_name}</div>
      <div className="search-field">이메일: {search.gb_email}</div>
      <div className="search-field">내용: {search.gb_content}</div>
      <div className="search-field">작성일: {search.gb_regdate}</div>
      <div className="search-field">
        첨부파일:{" "}
        <a
          href={`http://localhost:8080/uploads/${search.gb_f_name}`}
          download={search.gb_f_name}
          className="download-link"
        >
          {search.gb_f_name}
        </a>
      </div>

      <input
        type="password"
        name="inputPw"
        value={inputPw}
        onChange={(e) => setInputPw(e.target.value)}
        placeholder="비밀번호 입력"
      />
      <button className="btn edit-btn" onClick={handlePwd}>
        비밀번호 확인
      </button>

      <p style={{ color: "red" }}>
        비밀번호 확인을 누르셔야 수정, 삭제가 가능합니다.
      </p>
      <div className="button-group">
        <button
          className="btn edit-btn"
          onClick={handleEdit}
          disabled={!pwdCheck}
        >
          수정하기
        </button>
        <button
          className="btn delete-btn"
          onClick={() => handleDelete(gb_idx)}
          disabled={!pwdCheck}
        >
          삭제하기
        </button>

        {pwdTried && !pwdCheck && (
          <p style={{ color: "red" }}>비밀번호가 틀렸습니다</p>
        )}
        {pwdTried && pwdCheck && (
          <p style={{ color: "blue" }}>비밀번호가 일치합니다</p>
        )}
      </div>
    </div>
  );
}
