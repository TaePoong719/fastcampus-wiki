import GallerySidebar from "components/layout/GallerySiderbar";
import { useEffect, useMemo, useState } from "react";
import GalleryEdit from "./GalleryEdit";
import GalleryDetail from "./GalleryDetail";
import GalleryList from "./GalleryList";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import userData from "./UserData";
import { IsMobile } from "utils/mediaQuery";
import { useMediaQuery } from "react-responsive";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Gallery = () => {
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [galleryDatas, setGalleryData] = useState<userData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all"); // 초기값 설정
  const location = useLocation();
  const Navigate = useNavigate();

  let leftMargin = 200;
  let topMargin = 60;

  if (IsMobile()) {
    leftMargin = 0;
    topMargin = 100;
  }

  // 초기값
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const q = query(collection(db, "gallery"), orderBy("timestamp", "desc"));
  //     const data = await getDocs(q);
  //     console.log('API호출 : 초기 리스트 데이터 호출');
  //     const galleryData: userData[] = data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));

  //     setGalleryData(galleryData);
  //   };

  //   fetchData();
  // }, []);

  async function fetchGallery(): Promise<userData[]>{
    const q = query(collection(db, "gallery"), orderBy("timestamp", "desc"));
    const data = await getDocs(q);
    const galleryData: userData[] = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
    console.log('API호출 : 리스트들 호출!')

    return galleryData || []; // 데이터가 없을 경우 빈 배열 반환
  }

  const { isLoading, data } = useQuery<userData[]>(["galleryData"], fetchGallery)


  const galleryData = data || []; 
  console.log(galleryData);

  // 사이드바 쿼리구현
  const handleClick = (category: string) => {
    // 글 작성시에 메뉴 클릭하면 강제
    const path = location.pathname;
    const galleryPath = "/Gallery/";
    const subPath = path.substring(galleryPath.length);

    // 리스트페이지가 아닐 경우에 리스트로 이동
    if (subPath.startsWith("edit") || subPath.startsWith("detail/")) {
      Navigate("/Gallery");
    }

    setActiveCategory(category);
  };

  const filteredGalleryData = activeCategory === "all"
    ? galleryData
    : galleryData.filter(item => item.category === activeCategory);


  return (
    <>
      <GallerySidebar
        handleClick={handleClick}
        activeCategory={activeCategory}
      />
      <Container leftmargin={leftMargin} topmargin={topMargin}>
        <Routes>
          <Route
            path=""
            element={
              <GalleryList
                galleryData={filteredGalleryData}
                activeCategory={activeCategory}
              />
            }
          />
          <Route
            path="edit"
            element={
              <GalleryEdit
                onEdit={onEdit}
                setOnEdit={setOnEdit}
                setGalleryData={setGalleryData}
              />
            }
          />
          <Route
            path="edit/:id"
            element={
              <GalleryEdit
                onEdit={onEdit}
                setOnEdit={setOnEdit}
                setGalleryData={setGalleryData}
              />
            }
          />
          <Route
            path="detail/:id"
            element={
              <GalleryDetail
                onEdit={onEdit}
                setOnEdit={setOnEdit}
                setGalleryData={setGalleryData}
              />
            }
          />
        </Routes>
      </Container>
    </>
  );
};

const Container = styled.section<IContainer>`
  position: relative;
  left: ${(props) => props.leftmargin}px;
  height: calc(100% - ${(props) => props.topmargin}px);
  width: calc(100% - ${(props) => props.leftmargin}px);
  padding: 5px;
  box-sizing: border-box;
  img {
    max-width: 100%;
  }
`;

interface IContainer {
  leftmargin: number;
  topmargin: number;
}

export default Gallery;
