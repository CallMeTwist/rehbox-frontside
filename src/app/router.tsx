import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "@/features/shared/components/PublicLayout";
import PTLayout from "@/features/shared/components/PTLayout";
import ClientLayout from "@/features/shared/components/ClientLayout";

// Auth pages
import Landing from "@/features/auth/pages/Landing";
import Login from "@/features/auth/pages/Login";
import RegisterPT from "@/features/auth/pages/RegisterPT";
import RegisterClient from "@/features/auth/pages/RegisterClient";
import VettingPendingScreen from "@/features/auth/components/VettingPendingScreen";

// PT pages
import PTHome from "@/features/pt-dashboard/pages/Home";
import ExerciseLibrary from "@/features/pt-dashboard/pages/ExerciseLibrary";
import MyClients from "@/features/pt-dashboard/pages/MyClients";
import ClientDetail from "@/features/pt-dashboard/pages/ClientDetail";
import CreatePlan from "@/features/pt-dashboard/pages/CreatePlan";
import EditPlan from "@/features/pt-dashboard/pages/EditPlan";
import PTShop from "@/features/pt-dashboard/pages/Shop";
import PTMessages from "@/features/pt-dashboard/pages/Messages";
import PTProfile from "@/features/pt-dashboard/pages/Profile";

// Client pages
import ClientHome from "@/features/client-dashboard/pages/Home";
import MyPlan from "@/features/client-dashboard/pages/MyPlan";
import PlanBuild from "@/features/client-dashboard/pages/PlanBuild";
import ClientExercises from "@/features/client-dashboard/pages/Exercises";
import ExerciseSession from "@/features/client-dashboard/pages/ExerciseSession";
import Progress from "@/features/client-dashboard/pages/Progress";
import Rewards from "@/features/client-dashboard/pages/Rewards";
import ClientShop from "@/features/client-dashboard/pages/Shop";
import Chat from "@/features/client-dashboard/pages/Chat";
import Reminders from "@/features/client-dashboard/pages/Reminders";
import ClientProfile from "@/features/client-dashboard/pages/Profile";

// Subscription / Payment Gate
import PaymentGate from "@/features/client-dashboard/components/PaymentGate";

import NotFound from "@/pages/NotFound";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/physio" element={<RegisterPT />} />
        <Route path="/register/client" element={<RegisterClient />} />
        <Route path="/pending-vetting" element={<VettingPendingScreen />} />
        <Route path="/subscription" element={<PaymentGate />} />
      </Route>

      {/* PT routes */}
      <Route path="/pt" element={<PTLayout />}>
        <Route index element={<Navigate to="/pt/home" replace />} />
        <Route path="home" element={<PTHome />} />
        <Route path="library" element={<ExerciseLibrary />} />
        <Route path="clients" element={<MyClients />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="plans/create" element={<CreatePlan />} />
        <Route path="plans/:planId/edit" element={<EditPlan />} />
        <Route path="shop" element={<PTShop />} />
        <Route path="messages" element={<PTMessages />} />
        <Route path="profile" element={<PTProfile />} />
      </Route>

      {/* Client routes */}
      <Route path="/client" element={<ClientLayout />}>
        <Route index element={<Navigate to="/client/home" replace />} />
        <Route path="home" element={<ClientHome />} />
        <Route path="plan" element={<MyPlan />} />
        <Route path="plan/build" element={<PlanBuild />} />
        <Route path="exercises" element={<ClientExercises />} />
        <Route path="session/:exerciseId" element={<ExerciseSession />} />
        <Route path="progress" element={<Progress />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="shop" element={<ClientShop />} />
        <Route path="chat" element={<Chat />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
