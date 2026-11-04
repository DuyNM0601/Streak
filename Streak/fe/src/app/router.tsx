import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { GuidePage } from "./routes/guide";
import { HomePage } from "./routes/home";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
