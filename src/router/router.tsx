import DonateScreen from "@/global/DonateScreen";
import ThankYouScreen from "@/global/ThanksScreen";
import AuthLayout from "@/layout/AuthLayout";
import Layout from "@/layout/Layout";
import LoginScreen from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import LandingPage from "@/pages/design/LandingPage";
import { MyChart } from "@/pages/screen/ChartScreen";
import Gallary from "@/pages/screen/Gallary";

import { MainQuestion } from "@/pages/screen/MainQuestion";
import UploadGallary from "@/pages/screen/UploadImages";
import ViewUsers from "@/pages/screen/ViewAllUserScreen";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        index: true,
        path: "gallary",
        element: <Gallary />,
      },
    ],
  },
  {
    path: "/donate",
    element: <DonateScreen />,
  },
  {
    path: "/just-chart",
    element: <MyChart />,
  },
  {
    path: "/thank-you/successful-payment/",
    element: <ThankYouScreen />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: "register",
        element: <Register />,
      },

      {
        path: "login",
        element: <LoginScreen />,
      },
      {
        index: true,
        path: "participate",
        element: <MainQuestion />,
      },
      {
        index: true,
        path: "gallary",
        element: <Gallary />,
      },
      {
        index: true,
        path: "upload-gallary",
        element: <UploadGallary />,
      },
      {
        index: true,
        path: "users",
        element: <ViewUsers />,
      },
    ],
  },
]);
