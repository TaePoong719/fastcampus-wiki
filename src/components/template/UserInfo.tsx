import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { User } from "@firebase/auth";
import { storage, db } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"
import Swal from "sweetalert2";
import imageCompression from 'browser-image-compression';

const UserInfo: React.FC<Props> = ({ handlerLogout, user, isborder }) => {
  const [isLogout, setIsLogout] = useState(true); // Logout 모드(true) 또는 사진 추가 모드(false)가 가능합니다.
  const [userPhotoURL, setUserPhotoURL] = useState(user?.photoURL);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const reader = new FileReader();
  let isPending = false;
  const userClass = Number(localStorage.getItem(user.uid))

  
  // 사진저장버튼 클릭
  const handlerConfirmImage = useCallback(async () => {
    if (!isPending) {
      if (fileInputRef?.current) {
        const file = fileInputRef.current.files![0];
        const filename = user.uid + Date.now();
        const imageRef = ref(storage, `userImage/${filename}`);
        try {
          isPending = true;
          const compressedFile = await imageCompression(file,{
            maxWidthOrHeight: 150,
            fileType:"image/webp",
          })
          const snapshot = await uploadBytes(imageRef, compressedFile);
          const url = await getDownloadURL(snapshot.ref);
          setUserPhotoURL(url);
          await updateProfile(user, {
            photoURL: url,
          });
          await updateDoc(doc(db, "user", user.uid), {
            url,
          });
          Swal.fire({
            icon:"success",
            text: "사진이 성공적으로 수정됐습니다."
          })
        } catch (error) {
          // 이미지 업로드 실패 처리
          Swal.fire({
            icon:"error",
            text: "사진이 수정에 실패했습니다. 관리자에게 문의해주세요"
          })
        } finally {
          isPending = false;
          setIsLogout(true);
        }
      }
    }
  },[]) ;

  // 수정 버튼 클릭
  const handleEditImage = useCallback(() => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  },[]);

  // 파일을 바뀔 경우
  const handleFileChange = useCallback(() => {
    setIsLogout(false);
    let file = null;
    if (fileInputRef?.current) {
      // 미리보기로 img src를 변경해줌
      file = fileInputRef.current.files![0];
      reader.onload = (e) => {
        const base64DataUrl = e.target!.result as string;
        setUserPhotoURL(base64DataUrl);
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setIsLogout(true);
      }
    }
  },[]);

  return (
    <Container isborder={isborder}>
      <div className="userInfo__img-container">
        <img className="userInfo__user-img" src={userPhotoURL!} alt="유저 이미지" />
        <div className="userInfo__img-edit" onClick={handleEditImage}>
          <img src="/svg/icon/icon-edit.svg" alt="수정버튼" />
        </div>
        <FileInput type="file" accept="image/*" ref={fileInputRef} onInput={handleFileChange} />
      </div>

      <div className="userInfo__name-wrap">
        <img 
          src={process.env.PUBLIC_URL + `/webp/class_${userClass}.webp`} 
          alt="유저계급 아이콘" 
          />
        <h1>{user.displayName + "님"}</h1>
      </div>
      <div className="userInfo__name-wrap">
        <h3>{user.email}</h3>
      </div>
      

      <StyledButton onClick={isLogout ? handlerLogout : handlerConfirmImage}>
        <h4>{isLogout ? `로그아웃` : `사진저장`}</h4>
      </StyledButton>
    </Container>
  );
};

interface Props {
  handlerLogout: () => void;
  user: User;
  isborder: string;
}

const FileInput = styled.input`
  display: none;
`;

interface IContainer{
  isborder:string;
}

const Container = styled.section<IContainer>`
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 300px;
  height: 330px;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.Userinfo};
  color: ${(props) => props.theme.text};
  box-sizing: border-box;
  padding: 35px 0;
  gap: 20px;
  border: ${props=> props.isborder==="true" ? "var(--main-color) solid 2px;" : "none;"}
  .userInfo__img-container {
    position: relative;
  }
  .userInfo__user-img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    box-sizing: border-box;
    object-fit: cover;
  }
  .userInfo__img-edit {
    position: absolute;
    border-radius: 50%;
    background-color: white;
    width: 25px;
    height: 25px;
    padding: 5px;
    bottom: 0;
    right: 0;
    cursor: pointer;
  }
  .userInfo__name-wrap{
    display:flex;
    width: 75%;
    text-align:center;
    justify-content: center;
    img{
      width: 45px;
      height: 45px;
    }
    h1{
      padding: 10px 3px;
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    
    }
  }
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
  }
  h3 {
    font-size: 14px;
    margin: 0;
    margin-bottom: 16px;
    font-weight: 300;
  }
  h4 {
    margin: 0;
  }
`;
const StyledButton = styled.button`
  color: #ffffff;
  border: 0.8px solid var(--main-color);
  border-radius: 5px;
  width: 100px;
  height: 35px;
  background-color: var(--main-color);
  cursor: pointer;
  p {
    margin: 0 auto;
  }
`;

export default UserInfo;
