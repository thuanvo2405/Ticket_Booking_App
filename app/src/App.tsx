import { Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import Layout from "./components/layout/layout";
import ResetPasswordPage from "./page/ResetPasswordPage";
import MyTicketPage from "./page/MyTicketPage";
import ProfileLayout from "./components/layout/profilelayout";
import AdminPage from "./page/AdminPage";
import EventPage from "./page/EventPage";
import SearchPage from "./page/SearchPage";
import VerifyEmailPage from "./page/VerifyEmailPage";
import ProfilePage from "./page/ProfilePage";
import OrganizerPage from "./page/OrganizerPage";
import CreateEventPage from "./page/CreateEventPage";
import DashboardPage from "./page/DashboardPage";
import OrganizerLayout from "./components/layout/organizerlayout";
import NotFoundPage from "./page/NotFoundPage";
import MyEventPage from "./page/MyEventPage";
import AdminLayout from "./components/layout/adminlayout";
import EventManage from "./page/EventManage";
import AccountManage from "./page/AccountManage";
import DashboardManage from "./page/DashboardManage";
import SelectTicketPage from "./page/SelectTicketPage";
import PaymentInfoPage from "./page/PaymentInfoPage";
import PaymentResultPage from "./page/PaymentResult";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="event" element={<EventPage />} />
        <Route path="event/:maSuKien/:maSuatDien">
          <Route path="selected" element={<SelectTicketPage />} />
          <Route path=":madonhang/payment-info" element={<PaymentInfoPage />} />
        </Route>
        <Route element={<ProfileLayout />}>
          <Route path="my-profile" element={<ProfilePage />} />
          <Route path="my-tickets" element={<MyTicketPage />} />
        </Route>
        <Route path="payment-result" element={<PaymentResultPage />} />
      </Route>
      <Route path="organizer" element={<OrganizerLayout />}>
        <Route index element={<OrganizerPage />} />
        <Route path="create-event" element={<CreateEventPage />} />
        <Route path="my-events" element={<MyEventPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="account-manage" element={<AccountManage />} />
        <Route path="event-manage" element={<EventManage />} />
        <Route path="dashboard" element={<DashboardManage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
