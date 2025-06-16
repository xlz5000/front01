import { useEffect, useState } from "react";
//import "./InsertGuestBook.css";
import { insertGuestBook } from "../api/auth";
import { myPage } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function InsertGuestBook() {
  const [member, setMember] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    gb_name: "",
    gb_email: "",
    gb_pw: "",
    gb_content: "",
    gb_subject: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await myPage();
        console.log("myPage 응답:", response.data);
        if (response.data.success) {
          setMember(response.data.data);
        } else {
          setError("회원정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("가져오기 실패", err);
        setError("회원정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (member) {
      setForm((prev) => ({
        ...prev,
        gb_name: member.m_name,
        gb_email: member.m_email,
      }));
    }
  }, [member]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSignup = async () => {
    try {
      const formData = new FormData();
      formData.append("gb_name", form.gb_name);
      formData.append("gb_email", form.gb_email);
      formData.append("gb_pw", form.gb_pw);
      formData.append("gb_content", form.gb_content);
      formData.append("gb_subject", form.gb_subject);
      if (file) {
        formData.append("file", file);
      }

      console.log("전송할 데이터 (FormData):", [...formData.entries()]);

      const response = await insertGuestBook(formData); // FormData 넘김
      console.log("응답 전체:", response.data);

      if (response.data.success) {
        alert("방명록 작성 성공");
        navigate("/guestbooklist");
      } else {
        alert("작성 실패: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="wrapper">
      <h2>방명록 작성</h2>
      <input
        type="text"
        name="gb_subject"
        placeholder="제목 입력하세요"
        value={form.gb_subject}
        onChange={handleChange}
      />
      <input
        type="text"
        name="gb_content"
        placeholder="내용 입력하세요"
        value={form.gb_content}
        onChange={handleChange}
      />
      <input
        type="password"
        name="gb_pw"
        placeholder="패스워드 입력하세요"
        value={form.gb_pw}
        onChange={handleChange}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSignup}>작성하기</button>
    </div>
  );
}
