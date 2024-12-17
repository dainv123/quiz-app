import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = lazy(() => import("./layout/Layout"));
const QuizUser = lazy(() => import("./page/Quiz/User"));
const QuizAdmin = lazy(() => import("./page/Quiz/Admin"));
const NoPage = lazy(() => import("./page/NoPage/NoPage"));

const App: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QuizUser />} />
          <Route path="/quiz/admin" element={<QuizAdmin />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </Suspense>
    <ToastContainer />
  </BrowserRouter>
);

export default App;
