import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import Carousel from "components/template/Carousel";
import StudyTimeRanking from "components/template/StudyTimeRanking";

const RecentPost = lazy(() => import("components/template/RecentPost"));

const Home = () => {
  return (
    <Container>
      <Carousel />
      <StudyTimeRanking />
      <Suspense fallback={<div>로딩 중...</div>}>
        <RecentPost />
      </Suspense>
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;

export default Home;
