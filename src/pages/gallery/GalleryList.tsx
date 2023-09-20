import React, { useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import "../../style/Wiki.css";
import { AuthContext } from "provider/userContext";
import userData from "./UserData";

const GalleryList: React.FC<{ galleryData: userData[]; activeCategory: string }> = ({
  galleryData,
  activeCategory,
}) => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <section className="wiki__wrapper">
        <div className="wiki__header">
          <div className="wiki__title">
            {activeCategory === "notice" && "공지사항"}
            {activeCategory === "news" && "모집공고"}
            {activeCategory === "random" && "랜덤토크"}
          </div>
          {user?.displayName ? (
            <Link to="/Gallery/edit">
              <button type="button" className="wiki__btn-edit">
                새 글 작성
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="wiki__btn-edit"
              onClick={() => {
                const confirmed = window.confirm("로그인해야 이용할 수 있습니다. 로그인 하시겠습니까?");
                if (confirmed) {
                  navigate("/login");
                } else {
                  return;
                }
              }}
            >
              새 글 작성
            </button>
          )}
        </div>
        <ListWrapper>
          {galleryData.map((user) => {
            return (
              <div key={user.id}>
                <Link to={`/Gallery/detail/${user.id}`}>
                  <div className="Gallery__link">
                    <p className="img-bx">
                      <img src={user.thumbnail} alt="썸네일" />
                    </p>
                    <p className="Gallery__title">{user.title}</p>
                    <p className="Gallery__desc">
                      <span>{user.date}</span>
                      <span>{user.writer}</span>
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </ListWrapper>
      </section>
    </>
  );
};

// 스타일
const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
  > div {
    /* 수치 추후에 조정 */
    display: block;
    flex: 1 0 31%;
    max-width: 31%;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    a {
      width: 100%;
      display: block;
    }
  }
  .Gallery__link {
    width: 100%;
  }
  .img-bx {
    width: 100%;
    text-align: center;
    border-radius: 20px;
    background-color: #ddd;
    display: block;
    position: relative;
    overflow: hidden;
  }
  img {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    min-width: 1000%;
    min-height: 1000%;
    max-width: none;
    max-height: none;
    transform: translate(-50%, -50%) scale(0.1);
  }
  .img-bx:after {
    content: "";
    display: block;
    padding-bottom: 62.5%;
  }
  .Gallery__title {
    font-size: 16px;
    font-weight: 600;
    margin-top: 25px;
  }
  .Gallery__desc {
    font-size: 14px;
    font-weight: 400;
    margin-top: 0px;
    position: relative;
    overflow: hidden;
    left: -0.5em;
    > span {
      position: relative;
      display: inline-block;
      padding: 0 0.5em;
      color: #666;
      font-weight: 400;
      &:before {
        content: "";
        left: -1px;
        height: 0.8em;
        top: 50%;
        margin-top: -0.4em;
        position: absolute;
        border-left: 1px solid #b3b3b3;
      }
    }
  }
`;

export default GalleryList;