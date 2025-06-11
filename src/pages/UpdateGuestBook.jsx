import { useEffect, useState } from "react";
import { searchguestbook, updateGuestBookOk } from "../api/auth";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateGuestBook.css";

export default function UpdateGuestBook() {
  const { gb_idx } = useParams();
  const [form, setForm] = useState({
    gb_subject: "",
    gb_name: "",
    gb_email: "",
    gb_content: "",
    gb_pw: "",
    gb_file: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [pwdCheck, setPwdCheck] = useState(false);
  const [inputPw, setInputPw] = useState("");
  const [pwdTried, setPwdTried] = useState(false); // 비밀번호 시도 여부
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await searchguestbook(gb_idx);
        if (response.data.success) {
          setForm(response.data.data);
        } else {
          setError("방명록 데이터를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("가져오기 실패", err);
        setError("오류 발생: 데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gb_idx]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("gb_subject", form.gb_subject);
      formData.append("gb_name", form.gb_name);
      formData.append("gb_email", form.gb_email);
      formData.append("gb_content", form.gb_content);
      formData.append("gb_pw", form.gb_pw);
      if (form.gb_file) {
        formData.append("gb_file", form.gb_file);
      }

      const response = await updateGuestBookOk(gb_idx, formData); // API가 FormData 수용해야 함

      if (response.data.success) {
        alert("수정이 완료되었습니다.");
        navigate("/guestbooklist");
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("수정 오류:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, gb_file: e.target.files[0] });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="search-container">
      <div className="search-title">방명록 수정</div>

      <div className="form-group">
        <label htmlFor="gb_subject">제목</label>
        <input
          type="text"
          id="gb_subject"
          name="gb_subject"
          value={form.gb_subject}
          onChange={handleChange}
          placeholder="제목"
        />
      </div>

      <div className="form-group">
        <label htmlFor="gb_name">작성자</label>
        <input
          type="text"
          id="gb_name"
          name="gb_name"
          value={form.gb_name}
          onChange={handleChange}
          placeholder="작성자"
          disabled
        />
      </div>

      <div className="form-group">
        <label htmlFor="gb_email">이메일</label>
        <input
          type="email"
          id="gb_email"
          name="gb_email"
          value={form.gb_email}
          onChange={handleChange}
          placeholder="이메일"
          disabled
        />
      </div>

      <div className="form-group">
        <label htmlFor="gb_content">내용</label>
        <textarea
          id="gb_content"
          name="gb_content"
          value={form.gb_content}
          onChange={handleChange}
          placeholder="내용"
        />
      </div>

      <div className="form-group">
        <label htmlFor="gb_file">첨부파일</label>
        <input
          type="file"
          id="gb_file"
          name="gb_file"
          onChange={handleFileChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="gb_f_name">첨부파일</label>
        <input
          type="password"
          id="gb_pw"
          name="gb_pw"
          value={form.gb_pw}
          onChange={handleChange}
          placeholder="비밀번호"
        />
      </div>

      <div className="button-group">
        <button className="btn edit-btn" onClick={handleUpdate}>
          수정 완료
        </button>
        <button
          className="btn cancel-btn"
          onClick={() => navigate("/guestbooklist")}
        >
          취소
        </button>
      </div>
    </div>
  );
}
