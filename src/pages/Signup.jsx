import { useState } from 'react'
import '../styles/login.css'
export default function Signup(){
    const [form, setForm] = useState({
        m_id : '',
        m_pw : '',
        m_name : '',
        m_email:'',
        m_phone:'',
        m_addr:'',
        m_addr2:''
    });
    const [isVerified,setIsVerified] = useState(false);
    const [canVerity,setCanVerity] = useState(true);
    const [code,setCode]=useState("");

    const handleChange = (e)=>{
        setForm({...form, [e.target.name] : e.target.value});
    };

    const handleSignup = async ()=>{
        // Axios로 SpringBoot 서버에 POST로 요청
    }
    const handleSendCode = ()=>{

    }

    return(
      <div className="login-wrapper">
            <h2>회원가입</h2>
            <input type="text"
                name='m_id'
                placeholder="아이디 입력하세요"
                value={form.m_id}
                onChange={handleChange}
            />
            <input type="password"
                name='m_pw'
                placeholder="패스워드 입력하세요"
                value={form.m_pw}
                onChange={handleChange}
            />
            <input type="text"
                name='m_name'
                placeholder="이름 입력하세요"
                value={form.m_name}
                onChange={handleChange}
            />
            <input type="text"
                name='m_phone'
                placeholder="전화번호 입력하세요"
                value={form.m_phone}
                onChange={handleChange}
            />
            <input type="text"
                name='m_addr'
                placeholder="주소 입력하세요"
                value={form.m_addr}
                onChange={handleChange}
            />
            <input type="text"
                name='m_addr2'
                placeholder="상세주소 입력하세요"
                value={form.m_addr2}
                onChange={handleChange}
            />

            <div className='email-row'>
                <input type="text"
                    name='m_email'
                    placeholder="이메일 입력하세요"
                    value={form.m_email}
                    onChange={handleChange}
                />
                <button onClick={handleSendCode} disabled={!form.m_email}>인증메일보내기</button>
            </div>

            {canVerity && (
                <div className='email-row'>
                    <input type="text"
                        placeholder="인증코드 입력"
                        value={code}
                        onChange={(e)=>setCode(e.target.value)}
                    />
                    <button onClick={handleSendCode} disabled={!form.m_email}>인증확인</button>
                </div>
            )}

            <button onClick={handleSignup} disabled={!isVerified}>회원가입</button>
        </div>

    )
}