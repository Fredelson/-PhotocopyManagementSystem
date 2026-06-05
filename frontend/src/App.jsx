// ============================================
// ARAB UNITY SCHOOL
// App Routes
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/teacher/Dashboard";
import MyRequests from "./pages/teacher/MyRequests";
import CreateRequest from "./pages/teacher/CreateRequest";
import RequestDetails from "./pages/teacher/RequestDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/my-requests" element={<MyRequests />} />
        <Route path="/teacher/create-request" element={<CreateRequest />} />
        <Route path="/teacher/request-details/:id" element={<RequestDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;