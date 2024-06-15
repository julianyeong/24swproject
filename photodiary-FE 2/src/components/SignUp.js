import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // 스타일을 별도의 CSS 파일로 분리

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const navigate = useNavigate();

  // 유효성 검사 함수
  const validateUsername = () => {
    if (username.length < 6 || username.length > 20) {
      setUsernameError('아이디는 6자 이상 20자 이하로 입력해주세요.');
    } else {
      setUsernameError('');
    }
  };

  const validatePassword = () => {
    if (password.length < 8 || password.length > 20) {
      setPasswordError('비밀번호는 8자 이상 20자 이하로 입력해주세요.');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
    } else {
      setEmailError('');
    }
  };

  const validatePhoneNumber = () => {
    const phoneNumberRegex = /^\d{11}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      setPhoneNumberError('유효한 휴대폰 번호를 입력해주세요.');
    } else {
      setPhoneNumberError('');
    }
  };

  // 입력 필드가 변경될 때마다 유효성 검사 수행
  useEffect(() => {
    validateUsername();
  }, [username]);

  useEffect(() => {
    validatePassword();
  }, [password]);

  useEffect(() => {
    validateConfirmPassword();
  }, [confirmPassword]);

  useEffect(() => {
    validateEmail();
  }, [email]);

  useEffect(() => {
    validatePhoneNumber();
  }, [phoneNumber]);

  const handleSignup = async (event) => {
    event.preventDefault();

    // 유효성 검사 결과 확인을 위한 로그 추가
    console.log("유효성 검사 결과:");
    console.log("usernameError:", usernameError);
    console.log("passwordError:", passwordError);
    console.log("confirmPasswordError:", confirmPasswordError);
    console.log("emailError:", emailError);
    console.log("phoneNumberError:", phoneNumberError);

    // 유효성 검사를 통과하지 못한 경우 경고 메시지 표시
    if (usernameError || passwordError || confirmPasswordError || emailError || phoneNumberError) {
      alert('유효성 검사를 통과하지 못했습니다. 모든 필드를 올바르게 입력해주세요.');
      return;
    }

    const payload = {
      username,
      password,
      email,
      phoneNumber,
    };

    try {
      const response = await fetch('http://localhost:8081/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        alert('가입이 완료되었습니다!');
        // 폼 초기화
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhoneNumber('');
        // 초기화면으로 이동 (예: 로그인 화면)
        navigate('/');
      } else {
        const data = await response.json();
        console.error('Signup failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <div className="signup-container">
        <h1>Sign Up</h1>
        <p>Please Sign up to meet various services!</p>
        <form id="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디 입력 (6-20자)" required />
            <div id="username-error" className="error">{usernameError}</div>
          </div>
          <div className="input-group">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력 (8-20자)" required />
            <div id="password-error" className="error">{passwordError}</div>
          </div>
          <div className="input-group">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호 재입력" required />
            <div id="confirm-password-error" className="error">{confirmPasswordError}</div>
          </div>
          <div className="input-group">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소" required />
            <div id="email-error" className="error">{emailError}</div>
          </div>
          <div className="input-group">
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="휴대폰 번호 입력 ('-' 제외 11자리 입력)" required />
            <div id="phoneNumber-error" className="error">{phoneNumberError}</div>
          </div>
          <button type="submit">가입하기</button>
        </form>
      </div>
  );
};

export default SignUp;
