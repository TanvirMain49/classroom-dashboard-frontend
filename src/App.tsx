import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/dashboard";
import { BookOpen, Building2, GraduationCap, Home, Users2 } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectCreate from "./pages/subjects/create";
import SubjectList from "./pages/subjects/list";
import { dataProvider } from "./providers/data";
import ClassList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";
import DepartmentList from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentShow from "./pages/departments/show";
import FacultiesList from "./pages/faculties/list";
import FacultyShow from "./pages/faculties/show";
import SubjectShow from "./pages/subjects/show";
import Login from "./pages/login";
import Register from "./pages/register";
import { authProvider } from "./providers/auth";
import { ProtectedCreateRoute } from "./components/layout/protected-create-route";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "hs0f2S-XF3poq-EQkJK4",
                title: { text: "My Dashboard" },
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Home",
                    icon: <Home />,
                  },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  show: "/subjects/show/:id",
                  meta: {
                    label: "Subject",
                    icon: <BookOpen />,
                  },
                },
                {
                  name: "departments",
                  list: "/departments",
                  create: "/departments/create",
                  show: "/departments/show/:id",
                  meta: {
                    label: "Department",
                    icon: <Building2 />,
                  },
                },
                {
                  name: "users",
                  list: "/faculties",
                  show: "/faculties/show/:id",
                  meta: {
                    label: "Faculties",
                    icon: <Users2 />,
                  },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  show: "/classes/show/:id",
                  meta: {
                    label: "Class",
                    icon: <GraduationCap />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/" element={<Dashboard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectList />} />
                    <Route
                      path="create"
                      element={
                        <ProtectedCreateRoute resource="subjects">
                          <SubjectCreate />
                        </ProtectedCreateRoute>
                      }
                    />
                    <Route path="show/:id" element={<SubjectShow />} />
                  </Route>

                  <Route path="classes">
                    <Route index element={<ClassList />} />
                    <Route
                      path="create"
                      element={
                        <ProtectedCreateRoute resource="classes">
                          <ClassCreate />
                        </ProtectedCreateRoute>
                      }
                    />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>

                  <Route path="departments">
                    <Route index element={<DepartmentList />} />
                    <Route
                      path="create"
                      element={
                        <ProtectedCreateRoute resource="departments">
                          <DepartmentCreate />
                        </ProtectedCreateRoute>
                      }
                    />
                    <Route path="show/:id" element={<DepartmentShow />} />
                  </Route>

                  <Route path="faculties">
                    <Route index element={<FacultiesList />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
