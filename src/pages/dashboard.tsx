/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, memo } from "react";
import { useLink, useList } from "@refinedev/core";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  ShieldCheck,
  Users,
  TrendingUp,
  Calendar,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface UserByRole {
  role: string;
  total: number;
}

interface SubjectByDepartment {
  departmentId: number;
  departmentName: string;
  totalSubjects: number;
}

interface ClassBySubject {
  subjectId: number;
  subjectName: string;
  totalClasses: number;
}

interface ChartData {
  userByRole: UserByRole[];
  subjectsByDepartment: SubjectByDepartment[];
  classesBySubject: ClassBySubject[];
}

interface Teacher {
  id: string;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface ClassListItem {
  id: number;
  name: string;
  createdAt: string;
  createdAtMs: string | number;
  subject: Subject;
  teacher: Teacher;
}

interface LatestTeacher {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  createdAtMs: string | number;
}

interface Overview {
  user: number | string;
  teachers: number | string;
  admins: number | string;
  subjects: number | string;
  departments: number | string;
  classes: number | string;
}

interface DashboardStats {
  chartData: ChartData;
  latestClasses: ClassListItem[];
  latestTeachers: LatestTeacher[];
  overview: Overview;
}

const SkeletonCard = memo(() => (
  <div className="rounded-lg border border-border bg-muted/20 p-4 animate-pulse">
    <div className="h-4 w-24 bg-muted rounded mb-3"></div>
    <div className="h-8 w-16 bg-muted rounded"></div>
  </div>
));

const SkeletonListItem = memo(() => (
  <div className="flex items-center justify-between rounded-md px-3 py-2 animate-pulse">
    <div className="flex items-center gap-3 flex-1">
      <div className="h-4 w-4 bg-muted rounded"></div>
      <div className="flex-1">
        <div className="h-4 w-32 bg-muted rounded mb-2"></div>
        <div className="h-3 w-24 bg-muted rounded"></div>
      </div>
    </div>
    <div className="h-6 w-12 bg-muted rounded"></div>
  </div>
));

const SkeletonChart = memo(() => (
  <div className="h-80 w-full bg-muted rounded-lg animate-pulse"></div>
));


const roleColors = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7"];


interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  isLoading?: boolean;
}

const KPICard = memo<KPICardProps>(
  ({ label, value, icon: Icon, accent, isLoading }) => (
    <div className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className="mt-2 text-2xl font-semibold">
        {isLoading ? "..." : value}
      </div>
    </div>
  )
);

KPICard.displayName = "KPICard";

interface ClassItemProps {
  item: ClassListItem;
  index: number;
  Link: any;
}

const ClassItem = memo<ClassItemProps>(({ item, index, Link }) => (
  <Link
    to={`/classes/show/${item.id}`}
    className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
  >
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-muted-foreground">
        #{index + 1}
      </span>
      <div>
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.subject?.name ?? "No subject"} ·{" "}
          {item.teacher?.name ?? "No teacher"}
        </p>
      </div>
    </div>
    <Badge variant="secondary">New</Badge>
  </Link>
));

ClassItem.displayName = "ClassItem";

interface TeacherItemProps {
  teacher: LatestTeacher;
  index: number;
  Link: any;
}

const TeacherItem = memo<TeacherItemProps>(({ teacher, index, Link }) => (
  <Link
    to={`/faculties/show/${teacher.id}`}
    className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
  >
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-muted-foreground">
        #{index + 1}
      </span>
      <div>
        <p className="text-sm font-medium">{teacher.name}</p>
        <p className="text-xs text-muted-foreground">{teacher.email}</p>
      </div>
    </div>
    <Badge variant="secondary">New</Badge>
  </Link>
));

TeacherItem.displayName = "TeacherItem";

interface DepartmentItemProps {
  dept: SubjectByDepartment;
  index: number;
}

const DepartmentItem = memo<DepartmentItemProps>(({ dept, index }) => {
  console.log("Dept: ", dept);
  return(
  <div className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40">
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-muted-foreground">
        #{index + 1}
      </span>
      <div>
        <p className="text-sm font-medium">{dept.departmentName}</p>
        <p className="text-xs text-muted-foreground">
          {dept.totalSubjects} subjects
        </p>
      </div>
    </div>
    <Badge>{dept.totalSubjects}</Badge>
  </div>
)
});

DepartmentItem.displayName = "DepartmentItem";

interface SubjectItemProps {
  subject: ClassBySubject;
  index: number;
}

const SubjectItem = memo<SubjectItemProps>(({ subject, index }) => (
  <div className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40">
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-muted-foreground">
        #{index + 1}
      </span>
      <div>
        <p className="text-sm font-medium">{subject.subjectName}</p>
        <p className="text-xs text-muted-foreground">
          {subject.totalClasses} classes
        </p>
      </div>
    </div>
    <Badge>{subject.totalClasses}</Badge>
  </div>
));

SubjectItem.displayName = "SubjectItem";

const Dashboard = memo(() => {
  const Link = useLink();

  const { query: statsQuery } = useList<any>({
    resource: "stats/chart",
    pagination: { mode: "off" },
    queryOptions: {
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: false, 
      retry: 2, 
    },
  });
  const {isLoading, isError } = statsQuery;

  const statsData: DashboardStats = statsQuery.data?.data ?? {
    chartData: {
      userByRole: [],
      subjectsByDepartment: [],
      classesBySubject: [],
    },
    latestClasses: [],
    latestTeachers: [],
    overview: {
      user: 0,
      teachers: 0,
      admins: 0,
      subjects: 0,
      departments: 0,
      classes: 0,
    },
  };

  const { chartData, latestClasses, latestTeachers, overview:overviewData } = statsData;


  // Users by role with filtering and conversion
  const usersByRole = useMemo(() => {
    return (chartData?.userByRole || [])
      .map((item) => ({
        role: item.role,
        total: typeof item.total === "number" ? item.total : Number(item.total),
      }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [chartData?.userByRole]);

  // Subjects by department with filtering and sorting
  const subjectsByDepartment = useMemo(() => {
    if (!Array.isArray(chartData?.subjectsByDepartment)) return [];
    return (chartData.subjectsByDepartment || [])
      .map((item) => ({
        departmentId: item.departmentId,
        departmentName: item.departmentName || "Unassigned",
        totalSubjects:
          typeof item.totalSubjects === "number"
            ? item.totalSubjects
            : Number(item.totalSubjects),
      }))
      .filter((item) => item.totalSubjects > 0)
      .sort((a, b) => b.totalSubjects - a.totalSubjects)
      .slice(0, 5);
  }, [chartData?.subjectsByDepartment]);

  // Classes by subject with filtering and sorting
  const classesBySubject = useMemo(() => {
    if (!Array.isArray(chartData?.classesBySubject)) return [];
    return (chartData.classesBySubject || [])
      .map((item) => ({
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        totalClasses:
          typeof item.totalClasses === "number"
            ? item.totalClasses
            : Number(item.totalClasses),
      }))
      .filter((item) => item.totalClasses > 0)
      .sort((a, b) => b.totalClasses - a.totalClasses)
      .slice(0, 5);
  }, [chartData?.classesBySubject]);

  // Top departments (already sorted in backend, just slice)
  const topDepartments = useMemo(() => {
    return subjectsByDepartment
      .sort((a, b) => b.totalSubjects - a.totalSubjects)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        departmentId: item.departmentId || index,
      }));
  }, [subjectsByDepartment]);

  // Top subjects (already sorted in backend, just slice)
  const topSubjects = useMemo(() => {
    return classesBySubject
      .sort((a, b) => b.totalClasses - a.totalClasses)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        subjectId: item.subjectId || index,
      }));
  }, [classesBySubject]);

  // Memoize KPI array
  const kpis = useMemo(
    () => [
      {
        label: "Total Users",
        value: overviewData.user,
        icon: Users,
        accent: "text-blue-600",
      },
      {
        label: "Teachers",
        value: overviewData.teachers,
        icon: GraduationCap,
        accent: "text-amber-600",
      },
      {
        label: "Admins",
        value: overviewData.admins,
        icon: ShieldCheck,
        accent: "text-emerald-600",
      },
      {
        label: "Subjects",
        value: overviewData.subjects,
        icon: BookOpen,
        accent: "text-purple-600",
      },
      {
        label: "Departments",
        value: overviewData.departments,
        icon: Building2,
        accent: "text-cyan-600",
      },
      {
        label: "Classes",
        value: overviewData.classes,
        icon: Layers,
        accent: "text-rose-600",
      },
    ],
    [overviewData]
  );


  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted-foreground">
          A quick snapshot of the latest activity and key metrics.
        </p>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : (
              kpis.map((kpi) => (
                <KPICard
                  key={kpi.label}
                  label={kpi.label}
                  value={kpi.value}
                  icon={kpi.icon}
                  accent={kpi.accent}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users by Role Pie Chart */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <SkeletonChart />
            ) : usersByRole.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No user data available
              </p>
            ) : (
              <>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="total"
                        nameKey="role"
                        data={usersByRole}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                      >
                        {usersByRole.map((entry, index) => (
                          <Cell
                            key={`${entry.role}-${index}`}
                            fill={roleColors[index % roleColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2">
                  {usersByRole.map((entry, index) => (
                    <span
                      key={entry.role}
                      className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            roleColors[index % roleColors.length],
                        }}
                      />
                      {entry.role} · {entry.total}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                New Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {isLoading ? "..." : latestClasses.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Most recent classes added
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                New Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {isLoading ? "..." : latestTeachers.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Most recent teachers added
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          {/* Subjects per Department */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Subjects per Department
            </h3>
            {isLoading ? (
              <SkeletonChart />
            ) : subjectsByDepartment.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No data available
              </p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectsByDepartment}>
                    <XAxis
                      dataKey="departmentName"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="totalSubjects"
                      fill="#f97316"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Classes per Subject */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Classes per Subject
            </h3>
            {isLoading ? (
              <SkeletonChart />
            ) : classesBySubject.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No data available
              </p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classesBySubject}>
                    <XAxis dataKey="subjectName" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="totalClasses"
                      fill="#0ea5e9"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest Classes */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Newest Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </>
            ) : latestClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent classes.
              </p>
            ) : (
              latestClasses.map((item, index) => (
                <ClassItem
                  key={item.id}
                  item={item}
                  index={index}
                  Link={Link}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Latest Teachers */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Newest Teachers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </>
            ) : latestTeachers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent teachers.
              </p>
            ) : (
              latestTeachers.map((teacher, index) => (
                <TeacherItem
                  key={teacher.id}
                  teacher={teacher}
                  index={index}
                  Link={Link}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>


      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Departments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departments with Most Subjects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </>
            ) : topDepartments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No department data available.
              </p>
            ) : (
              topDepartments.map((dept, index) => (
                <DepartmentItem
                  key={`${dept.departmentId}-${index}`}
                  dept={dept}
                  index={index}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Subjects */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subjects with Most Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </>
            ) : topSubjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No subject data available.
              </p>
            ) : (
              topSubjects.map((subject, index) => (
                <SubjectItem
                  key={`${subject.subjectId}-${index}`}
                  subject={subject}
                  index={index}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;