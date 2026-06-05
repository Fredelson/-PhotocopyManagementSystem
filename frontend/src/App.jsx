// ============================================
// ARAB UNITY SCHOOL
// App Routes
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MyRequests from "./pages/teacher/MyRequests";
import CreateRequest from "./pages/teacher/CreateRequest";
import RequestDetails from "./pages/teacher/RequestDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />

        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/my-requests" element={<MyRequests />} />
        <Route path="/teacher/create-request" element={<CreateRequest />} />
        <Route path="/teacher/request-details/:id" element={<RequestDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;