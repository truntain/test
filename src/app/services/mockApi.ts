// mockApi.ts
import type { ApiClient, ApiResponse } from "./apiClient";

type Household = {
  id: string;
  householdId: string;
  ownerName: string;
  phone: string;
  address: string;
  moveInDate: string;
  status: string;
  apartmentId: string;
};

type Resident = {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  relationshipToHead: string;
  status: string;
};

type Vehicle = {
  id: string;
  type: string;
  plate: string;
  brand: string;
  color: string;
  status: string;
};

type Obligation = {
  id: string;
  feeItemName: string;
  periodYm: string;
  expected: number;
  paid: number;
  status: string;
  dueDate: string;
};

type Apartment = {
  id: string;
  block: string;
  floor: string;
  unit: string;
};

// Mock data
let householdList: Household[] = [
  {
    id: "1",
    householdId: "HK001",
    ownerName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "B1-02-05",
    moveInDate: "2023-01-01",
    status: "ACTIVE",
    apartmentId: "a1",
  },
  {
    id: "2",
    householdId: "HK002",
    ownerName: "Trần Văn B",
    phone: "0987654321",
    address: "A2-03-01",
    moveInDate: "2023-02-15",
    status: "ACTIVE",
    apartmentId: "a2",
  },
];

let residents: Resident[] = [
  {
    id: "r1",
    fullName: "Nguyễn Văn A",
    dob: "1980-01-01",
    gender: "MALE",
    idNumber: "123456789",
    relationshipToHead: "Chủ hộ",
    status: "ACTIVE",
  },
  {
    id: "r2",
    fullName: "Trần Thị B",
    dob: "1985-05-05",
    gender: "FEMALE",
    idNumber: "987654321",
    relationshipToHead: "Vợ",
    status: "ACTIVE",
  },
];

let vehicles: Vehicle[] = [
  {
    id: "v1",
    type: "CAR",
    plate: "30A-12345",
    brand: "Toyota",
    color: "Trắng",
    status: "ACTIVE",
  },
];

let obligations: Obligation[] = [
  {
    id: "o1",
    feeItemName: "Phí vệ sinh",
    periodYm: "2023-12",
    expected: 100000,
    paid: 0,
    status: "UNPAID",
    dueDate: "2023-12-31",
  },
];

let apartments: Apartment[] = [
  { id: "a1", block: "B1", floor: "02", unit: "05" },
  { id: "a2", block: "A2", floor: "03", unit: "01" },
  { id: "a3", block: "C3", floor: "01", unit: "10" },
];

export const mockApi: ApiClient = {
  async get<T = any>(url: string): Promise<ApiResponse<T>> {
    if (url === "/households") return { data: householdList as T };
    if (
      url.startsWith("/households/") &&
      !url.includes("/residents") &&
      !url.includes("/vehicles") &&
      !url.includes("/fee-obligations")
    ) {
      const id = url.split("/").pop()!;
      // tìm theo id hoặc householdId
      const hh = householdList.find(
        h => h.id === id || h.householdId === id
      );
      return { data: hh as T };
}

    if (url.endsWith("/residents")) return { data: residents as T };
    if (url.endsWith("/vehicles")) return { data: vehicles as T };
    if (url.endsWith("/fee-obligations")) return { data: obligations as T };
    if (url === "/apartments") return { data: apartments as T };
    return { data: {} as T };
  },

  async post<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    if (url.endsWith("/residents")) {
      const newItem: Resident = { id: `r${Date.now()}`, ...body };
      residents = [newItem, ...residents];
      return { data: newItem as T };
    }
    if (url.endsWith("/vehicles")) {
      const newItem: Vehicle = { id: `v${Date.now()}`, ...body };
      vehicles = [newItem, ...vehicles];
      return { data: newItem as T };
    }
    if (url === "/households") {
      const newHousehold: Household = { id: `${Date.now()}`, ...body };
      householdList = [newHousehold, ...householdList];
      return { data: newHousehold as T };
    }
    return { data: {} as T };
  },

  async put<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    if (url.startsWith("/residents/")) {
      const id = url.split("/").pop()!;
      residents = residents.map(r => (r.id === id ? { ...r, ...body } : r));
      return { data: residents.find(r => r.id === id)! as T };
    }
    if (url.startsWith("/vehicles/")) {
      const id = url.split("/").pop()!;
      vehicles = vehicles.map(v => (v.id === id ? { ...v, ...body } : v));
      return { data: vehicles.find(v => v.id === id)! as T };
    }
    if (url.startsWith("/households/")) {
      const id = url.split("/").pop()!;
      householdList = householdList.map(h => (h.id === id ? { ...h, ...body } : h));
      return { data: householdList.find(h => h.id === id)! as T };
    }
    return { data: {} as T };
  },

  async patch<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    if (url.endsWith("/move-out")) {
      const id = url.split("/")[2];
      householdList = householdList.map(h => (h.id === id ? { ...h, status: "MOVED_OUT" } : h));
      return { data: householdList.find(h => h.id === id)! as T };
    }
    if (url.startsWith("/fee-obligations/") && url.endsWith("/pay")) {
      const id = url.split("/")[2];
      obligations = obligations.map(o =>
        o.id === id ? { ...o, paid: o.expected, status: "PAID", note: body?.note || "" } : o
      );
      return { data: obligations.find(o => o.id === id)! as T };
    }
    return { data: {} as T };
  },

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    if (url.startsWith("/vehicles/")) {
      const id = url.split("/").pop()!;
      vehicles = vehicles.filter(v => v.id !== id);
      return { data: { success: true } as T };
    }
    if (url.startsWith("/households/")) {
      const id = url.split("/").pop()!;
      householdList = householdList.filter(h => h.id !== id);
      return { data: { success: true } as T };
    }
    return { data: {} as T };
  },
};
