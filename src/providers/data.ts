// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });



// ================================================================
// Mock Data Provider for Refine
// ================================================================
//
// • Provides a mock data provider to test Refine frontend UI
// • Uses MOCK_SUBJECTS as temporary data for 'subjects' resource
// • Implements getList, getOne, create, update, deleteOne methods
// • Other CRUD methods throw errors as placeholders (mock)
// • Compatible with useTable, useForm, CreateButton, etc.
// • Can be replaced with real API provider later
// ================================================================

import { MOCK_SUBJECTS } from "@/constants/mock-data";
import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";

export const dataProvider: DataProvider = {

  // -------------------------
  // Get list of items
  // -------------------------
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }: GetListParams): Promise<GetListResponse<TData>> => {

    // If resource is not 'subjects', return empty array
    if (resource !== 'subjects') {
      return { data: [] as TData[], total: 0 };
    }

    // Return mock subjects data
    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },

  // -------------------------
  // Get single item by ID (mock not implemented)
  // -------------------------
  getOne: async () => {
    throw new Error('This function is not present in mock');
  },

  // -------------------------
  // Create new item (mock not implemented)
  // -------------------------
  create: async () => {
    throw new Error('This function is not present in mock');
  },

  // -------------------------
  // Update existing item (mock not implemented)
  // -------------------------
  update: async () => {
    throw new Error('This function is not present in mock');
  },

  // -------------------------
  // Delete item (mock not implemented)
  // -------------------------
  deleteOne: async () => {
    throw new Error('This function is not present in mock');
  },

  // -------------------------
  // API URL getter (mock returns empty string)
  // -------------------------
  getApiUrl: () => ''
};
