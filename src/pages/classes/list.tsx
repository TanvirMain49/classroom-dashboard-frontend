import { ProtectedCreateButton } from "@/components/refine-ui/buttons/protected-create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Subject, User } from "@/types";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type ClassListItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  bannerUrl?: string;
  subject?: {
    name: string;
  };
  teacher?: {
    name: string;
  };
  capacity: number;
};

function ClassList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectSubject, setSelectSubject] = useState("all");
  const [selectTeacher, setSelectTeacher] = useState("all");
  // console.log("Teacher and subject values: ", selectSubject, selectTeacher);

  const classColumn = useMemo<ColumnDef<ClassListItem>[]>(
    () => [
      {
        id: "banner",
        accessorKey: "bannerUrl",
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => {
          const bannerUrl = getValue<string>();
          return bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Class banner"
              className="ml-2 h-10 w-10 rounded-md object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-muted-foreground ml-2">No image</span>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 200,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => {
          const subjectName = getValue<string>();

          return subjectName ? (
            <Badge variant="secondary">{subjectName}</Badge>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          );
        },
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 200,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => {
          const teacherName = getValue<string>();

          return teacherName ? (
            <span className="text-foreground">{teacherName}</span>
          ) : (
            <span className="text-muted-foreground">Not assigned</span>
          );
        },
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 120,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => {
          const capacity = getValue<number>();

          return <span className="text-foreground">{capacity}</span>;
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<"active" | "inactive">();
          const variant: "default" | "secondary" =
            status === "active" ? "default" : "secondary";

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const subjectFilters = selectSubject === 'all'? [] :
    [
      {
        field: "subject",
        operator: "eq" as const,
        value: selectSubject
      }
    ];

  const teacherFilters = selectTeacher === 'all'? [] :
    [
      {
        field: "teacher",
        operator: "eq" as const,
        value: selectTeacher
      }
    ];

    const searchFilters = searchQuery? 
    [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]: [];

  const classTable = useTable<ClassListItem>({
    columns: classColumn,
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters]
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQuery?.data?.data ?? [];
  const teachers = teachersQuery?.data?.data ?? [];
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* subject dropdown */}
            <Select value={selectSubject} onValueChange={setSelectSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject?.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Teacher dropdown */}
            <Select value={selectTeacher} onValueChange={setSelectTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher?.name}>
                    {teacher?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <ProtectedCreateButton resource="classes" />
          </div>
        </div>
      </div>
      <DataTable table={classTable} />
    </ListView>
  );
}

export default ClassList;
