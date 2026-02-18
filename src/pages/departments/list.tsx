import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

type DepartmentListItem = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  totalSubjects?: number | null;
};

const DepartmentList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const departmentsColumns = useMemo<ColumnDef<DepartmentListItem>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        header: () => <p className="column-title ml-3">Code</p>,
        cell: ({ getValue }) => {
          const code = getValue<string>();
          return code ? (
            <Badge>{code}</Badge>
          ) : (
            <span className="text-muted-foreground ml-2">No code</span>
          );
        },
      },
      {
        id: "Name",
        accessorKey: "name",
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "Subjects",
        accessorKey: "totalSubjects",
        header: () => <p className="column-title">Subjects</p>,
        cell: ({ getValue }) => {
          const total = getValue<number>();
          return <Badge variant="secondary">{total ?? 0}</Badge>;
        },
      },
      {
        id: "description",
        accessorKey: "description",
        size: 320,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => {
          const description = getValue<string>();

          return description ? (
            <span className="truncate line-clamp-2">{description}</span>
          ) : (
            <span className="text-muted-foreground">No description</span>
          );
        },
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="departments"
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

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
        {
          field: "code",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const departmentsTable = useTable<DepartmentListItem>({
    columns: departmentsColumns,
    refineCoreProps: {
      resource: "departments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters],
      },
      sorters: {
        initial:[
          {
            field:'id',
            order: 'desc'
          }
        ]
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              placeholder="Search by name and code"
              className="pl-10 w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
          <CreateButton resource="departments" />
        </div>
      </div>
      <DataTable table={departmentsTable} />
    </ListView>
  );
};

export default DepartmentList;
