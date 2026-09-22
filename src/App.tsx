import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomeOrArchiveRedirect } from "./pages/Redirects";

const Comics = lazy(() => import("./pages/Comics"));
const Actionopolis = lazy(() => import("./pages/Actionopolis"));
const PostPage = lazy(() => import("./pages/Post"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeOrArchiveRedirect />} />
        <Route
          path="/comics"
          element={
            <LazyPage>
              <Comics />
            </LazyPage>
          }
        />
        <Route
          path="/category/actionopolis"
          element={
            <LazyPage>
              <Actionopolis />
            </LazyPage>
          }
        />
        <Route
          path="/category/actionopolis/page/2"
          element={<Navigate to="/category/actionopolis" replace />}
        />
        <Route path="/books" element={<Navigate to="/category/actionopolis" replace />} />
        <Route
          path="/:slug"
          element={
            <LazyPage>
              <PostPage />
            </LazyPage>
          }
        />
        <Route
          path="*"
          element={
            <LazyPage>
              <NotFound />
            </LazyPage>
          }
        />
      </Route>
    </Routes>
  );
}
