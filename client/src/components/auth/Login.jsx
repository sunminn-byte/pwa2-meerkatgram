import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './Login.css'
import { loginThunk } from '../../store/thunks/authThunk.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // const [emailErr, setEmailErr] = useState(null);
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    // 기존 이벤트 취소
    e.preventDefault();

    try {
      // 로그인 요청
      await dispatch(loginThunk({email, password})).unwrap();
      return navigate('/posts', { replace: true }); // history남기지 않음
    } catch (error) {
      const code = error.response?.data?.code;
      alert(`로그인 실패했습니다. ${code}`);
    }
  }

  // function validationAndSetEmail(e) {
  //   const val = e.target.value;

  //   if(/^[0-9]+$/.test(val)) {
  //     setEmail(e.target.value);
  //     setEmailErr(null);
  //   } else {
  //     setEmailErr('이메일 형식 오류');
  //   }
  // }

  function handleSocial(provider) {
    window.location.replace(`/api/auth/social/${provider}`);
  }

  return (
    <>
      <form className="login-container" onSubmit={handleLogin}>
        <input type="text" className="input-big-border" onChange={ e => { setEmail(e.target.value) } } placeholder='email' />
        <input type="password" className='input-big-border' onChange={ e => { setPassword(e.target.value) } } placeholder='password' />
        <button type="submit" className="btn-big bg-gray">Log in</button>
        <div className="text-on-line">or</div>
        <button type="button" className="btn-big bg-img-kakao" onClick={() => {handleSocial('kakao')}}></button>
        <button type="button" className="btn-big bg-light">Sign up</button>
      </form>
    </>
  )
}
