import { api } from "./http";

// 스프링 서버에 보낼 것을 모아 놓은 것

// 1. 로그인
export const login = (m_id, m_pw) => api.post("/members/login", { m_id, m_pw });

// 2. 회원가입
export const register = (member) => api.post("/members/register", member);

// 3. 마이페이지
// export const myPage =(m_idx) =>
//     api.post("/members/mypage",{m_idx})

export const myPage = () => api.get("/members/mypage");

export const guestBookList = () => api.get("/guestbook/guestbooklist");

export const searchguestbook = (gb_idx) =>
  api.get("/guestbook/searchguestbook", {
    params: { gb_idx },
  });

// guestbook 삽입
export const insertGuestBook = (formData) =>
  api.post("/guestbook/insertguestbook", formData);

export const deleteGuestBook = (gb_idx) =>
  api.get("/guestbook/deleteguestbook", {
    params: { gb_idx },
  });

export const updateGuestBookOk = (gb_idx, formData) =>
  api.post(`/guestbook/updateguestbookok/${gb_idx}`, formData); // URL에 gb_idx 포함

// 인터셉터
// 1.모든 요청을 가로챔
// - 요청이 발생하면 인터셉터에서 config 객체를 확인한다.
// 2.특수요청 제외
// - login, register
// 3. 제외한 나머지는 헤더에 JWT 토큰이 자동으로 추가되게 하자
api.interceptors.request.use(
  (config) => {
    const excludePaths = ["/members/login", "/members/register"]; // 제외할 목록
    if (!excludePaths.includes(config.url)) {
      const tokens = localStorage.getItem("tokens");
      if (tokens) {
        const parsed = JSON.parse(tokens); // 객체로 파싱
        if (parsed.accessToken) {
          config.headers.Authorization = `Bearer ${parsed.accessToken}`; // 문자열로 출력됨
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  // 정상적인 응답은 통과
  (res) => res,
  async (error) => {
    const { config, response } = error;
    // 401 에러 => accessToken 만료되면
    if (response?.status === 401 && !config._retry) {
      config._retry = true; // 한번만 재 시도하도록 설정
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const result = await api.post("/members/refresh", {
          refreshToken: tokens.refreshToken,
        });
        const { accessToken, refreshToken } = result.data.data;
        localStorage.setItem(
          "tokens",
          JSON.stringify({ accessToken, refreshToken })
        );

        config.headers.Authorization = `Bearer ${accessToken}`;
        return api(config);
      } catch (e) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
