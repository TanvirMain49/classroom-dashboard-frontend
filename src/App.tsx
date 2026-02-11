import { Refine} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/dashboard";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectCreate from "./pages/subjects/create";
import SubjectList from "./pages/subjects/list";
import { dataProvider } from "./providers/data";
import ClassList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "hs0f2S-XF3poq-EQkJK4",
              }}
              resources={[
                {
                  name:'dashboard',
                  list:'/',
                  meta:{
                    label:'Home',
                    icon: <Home/>
                  }
                },
                {
                  name:'subjects',
                  list:'/subjects',
                  create:'/subjects/create',
                  meta:{
                    label:'Subject',
                    icon: <BookOpen/>
                  }
                },
                {
                  name:'classes',
                  list:'/classes',
                  create:'/classes/create',
                  meta:{
                    label:'Class',
                    icon: <GraduationCap/>
                  }
                }
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet/>
                  </Layout>
                }>
                    <Route path="/" element={ <Dashboard/> } />
                    <Route path="subjects">
                      <Route index element={<SubjectList/>} />
                      <Route path="create" element={<SubjectCreate/>}/>
                    </Route>
                    <Route path="classes">
                      <Route index element={<ClassList/>} />
                      <Route path="create" element={<ClassCreate/>} />
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
