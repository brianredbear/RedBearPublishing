import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Actionopolis from "./pages/Actionopolis";
import Comics from "./pages/Comics";
import NotFound from "./pages/NotFound";
import PostPage from "./pages/Post";
import { HomeOrArchiveRedirect } from "./pages/Redirects";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeOrArchiveRedirect />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/category/actionopolis" element={<Actionopolis />} />
        <Route
          path="/category/actionopolis/page/2"
          element={<Navigate to="/category/actionopolis" replace />}
        />
        <Route path="/books" element={<Navigate to="/category/actionopolis" replace />} />
        <Route path="/:slug" element={<PostPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
