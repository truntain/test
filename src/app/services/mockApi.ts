// src/app/services/mockApi.ts
import type { ApiClient, ApiResponse } from "./apiClient";

// --- 1. TYPES DEFINITION (Đã thêm export đầy đủ) ---
export type Household = {
  id: string;
  householdId: string;
  ownerName: string;
  phone: string;
  address: string;
  moveInDate: string;
  status: string;
  apartmentId: string;
};

export type Resident = {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  relationshipToHead: string;
  status: string;
  householdId: string;
};

export type Vehicle = {
  id: string;
  type: string;
  plate: string;
  brand: string;
  color: string;
  status: string;
  householdId: string;
};

export type FeeItem = {
  id: string;
  name: string;
  type: string; // SERVICE, VEHICLE
  unit: string; // M2, SLOT, FIXED
  cost: number;
  status: string; // ACTIVE, INACTIVE
};

export type FeePeriod = {
  id: string;
  name: string; // T10/2023
  status: string; // DRAFT, OPEN, CLOSED
  startDate: string;
  endDate: string;
};

export type Obligation = {
  id: string;
  feeItemName: string;
  periodYm: string;
  expected: number;
  paid: number;
  status: string;
  dueDate: string;
  householdId: string;
};

export type Apartment = {
  id: string;
  block: string;
  floor: string;
  unit: string;
  area: number;
  status: string; // EMPTY, OCCUPIED
};

export type Notification = {
  id: string;
  title: string;
  content: string;
  type: string; // INFO, ALERT, FEE
  status: string; // DRAFT, PUBLISHED
  createdDate: string;
  targetType: string; // ALL, SPECIFIC
};

export type ReportSummary = {
  totalHouseholds: number;
  totalPersons: number;
  totalFees: number;
  totalReceivable: number; // Tổng phải thu
  totalCollected: number;  // Đã thu
  collectionRate: number;  // Tỷ lệ
};

// --- 2. INITIAL MOCK DATA (Dữ liệu mẫu) ---

let apartments: Apartment[] = [
  { id: "a1", block: "A", floor: "02", unit: "05", area: 75, status: "OCCUPIED" },
  { id: "a2", block: "A", floor: "03", unit: "01", area: 100, status: "OCCUPIED" },
  { id: "a3", block: "B", floor: "05", unit: "10", area: 60, status: "EMPTY" },
];

let householdList: Household[] = [
  {
    id: "1", householdId: "HK001", ownerName: "Nguyễn Văn A", phone: "0912345678",
    address: "A-02-05", moveInDate: "2023-01-01", status: "ACTIVE", apartmentId: "a1",
  },
  {
    id: "2", householdId: "HK002", ownerName: "Trần Văn B", phone: "0987654321",
    address: "A-03-01", moveInDate: "2023-02-15", status: "ACTIVE", apartmentId: "a2",
  },
];

let feeItems: FeeItem[] = [
  { id: "f1", name: "Phí quản lý", type: "SERVICE", unit: "M2", cost: 7000, status: "ACTIVE" },
  { id: "f2", name: "Gửi xe ô tô", type: "VEHICLE", unit: "SLOT", cost: 1200000, status: "ACTIVE" },
  { id: "f3", name: "Gửi xe máy", type: "VEHICLE", unit: "SLOT", cost: 80000, status: "ACTIVE" },
];

let feePeriods: FeePeriod[] = [
  { id: "p1", name: "10/2023", status: "CLOSED", startDate: "2023-10-01", endDate: "2023-10-31" },
  { id: "p2", name: "11/2023", status: "OPEN", startDate: "2023-11-01", endDate: "2023-11-30" },
];

let obligations: Obligation[] = [
  {
    id: "o1", feeItemName: "Phí quản lý", periodYm: "10/2023",
    expected: 525000, paid: 525000, status: "PAID", dueDate: "2023-10-31", householdId: "1"
  },
  {
    id: "o2", feeItemName: "Gửi xe máy", periodYm: "11/2023",
    expected: 80000, paid: 0, status: "UNPAID", dueDate: "2023-11-30", householdId: "1"
  },
];

let residents: Resident[] = [
    { id: "r1", fullName: "Nguyễn Thị C", dob: "1990-01-01", gender: "Female", idNumber: "123456789", relationshipToHead: "Vợ", status: "Present", householdId: "1"},
    { id: "r2", fullName: "Nguyễn Văn Con", dob: "2015-05-05", gender: "Male", idNumber: "", relationshipToHead: "Con", status: "Present", householdId: "1"}
];

let vehicles: Vehicle[] = [
    { id: "v1", type: "Motorbike", plate: "29A-12345", brand: "Honda", color: "Đỏ", status: "Active", householdId: "1"}
];

let notifications: Notification[] = [
  { id: "n1", title: "Thông báo thu phí T10", content: "Đề nghị cư dân đóng phí...", type: "FEE", status: "PUBLISHED", createdDate: "2023-10-01", targetType: "ALL" },
  { id: "n2", title: "Bảo trì thang máy", content: "Bảo trì thang máy B...", type: "ALERT", status: "DRAFT", createdDate: "2023-10-05", targetType: "ALL" },
];

// --- 3. HELPER FUNCTIONS ---
const generateObligationsForPeriod = (periodId: string) => {
  const period = feePeriods.find(p => p.id === periodId);
  if (!period) return;

  householdList.forEach(hh => {
    const apt = apartments.find(a => a.id === hh.apartmentId);
    if (!apt) return;

    // Phí quản lý
    const managementFee = feeItems.find(f => f.name === "Phí quản lý");
    if (managementFee) {
      obligations.push({
        id: `gen-${Date.now()}-${Math.random()}`,
        feeItemName: managementFee.name,
        periodYm: period.name,
        expected: apt.area * managementFee.cost,
        paid: 0,
        status: "UNPAID",
        dueDate: period.endDate,
        householdId: hh.id
      });
    }
  });
};

// --- 4. API IMPLEMENTATION (Đầy đủ CRUD) ---
export const mockApi: ApiClient = {
  async get<T = any>(url: string): Promise<ApiResponse<T>> {
    console.log(`[MockAPI] GET ${url}`);

    // Global lists
    if (url === "/apartments") return { data: apartments as T };
    if (url === "/fee-items") return { data: feeItems as T };
    if (url === "/fee-periods") return { data: feePeriods as T };
    if (url === "/fee-obligations") return { data: obligations as T };
    if (url === "/households") return { data: householdList as T };
    if (url === "/residents") return { data: residents as T };
    if (url === "/vehicles") return { data: vehicles as T };

    // Sub-resources / Details
    if (url.startsWith("/households/")) {
        const parts = url.split("/");
        const idOrSub = parts[2]; 

        if (url.endsWith("/residents")) {
            const hhResidents = residents.filter(r => r.householdId === idOrSub);
            return { data: hhResidents as T };
        }
        if (url.endsWith("/vehicles")) {
             const hhVehicles = vehicles.filter(v => v.householdId === idOrSub);
             return { data: hhVehicles as T };
        }
        if (url.endsWith("/fee-obligations")) {
             const hhObligations = obligations.filter(o => o.householdId === idOrSub);
             return { data: hhObligations as T };
        }
        
        // Detail Household
        const hh = householdList.find(h => h.id === idOrSub || h.householdId === idOrSub);
        if (hh) return { data: hh as T };
    }

    // NOTIFICATIONS
    if (url.startsWith("/notifications")) {
       return { data: notifications as T };
    }

    // REPORTS
    if (url.startsWith("/reports/summary")) {
        // Mock tính toán báo cáo
        const totalReceivable = obligations.reduce((sum, o) => sum + o.expected, 0);
        const totalCollected = obligations.reduce((sum, o) => sum + o.paid, 0);
        const rate = totalReceivable > 0 ? (totalCollected / totalReceivable) * 100 : 0;

        const reportData: ReportSummary = {
            totalHouseholds: householdList.length,
            totalPersons: residents.length,
            totalFees: feeItems.length,
            totalReceivable,
            totalCollected,
            collectionRate: parseFloat(rate.toFixed(2))
        };
        return { data: reportData as T };
    }

    return { data: [] as T };
  },

  async post<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    console.log(`[MockAPI] POST ${url}`, body);

    if (url === "/apartments") {
        const newItem = { id: `a${Date.now()}`, ...body };
        apartments = [newItem, ...apartments];
        return { data: newItem as T };
    }
    if (url === "/households") {
        const newItem = { id: `${Date.now()}`, ...body, status: "ACTIVE" };
        householdList = [newItem, ...householdList];
        if (body.apartmentId) {
            apartments = apartments.map(a => a.id === body.apartmentId ? {...a, status: "OCCUPIED"} : a);
        }
        return { data: newItem as T };
    }
    if (url === "/fee-items") {
        const newItem = { id: `f${Date.now()}`, ...body };
        feeItems = [newItem, ...feeItems];
        return { data: newItem as T };
    }
    if (url === "/fee-periods") {
        const newItem = { id: `p${Date.now()}`, ...body, status: "DRAFT" };
        feePeriods = [newItem, ...feePeriods];
        return { data: newItem as T };
    }
    if (url.match(/\/fee-periods\/.*\/generate/)) {
        const periodId = url.split("/")[2];
        generateObligationsForPeriod(periodId);
        return { data: { success: true } as T };
    }

    if (url === "/notifications") {
        const newItem = { 
            id: `n${Date.now()}`, 
            ...body, 
            status: "DRAFT", 
            createdDate: new Date().toISOString().split('T')[0] 
        };
        notifications = [newItem, ...notifications];
        return { data: newItem as T };
    }

    return { data: {} as T };
  },

  async put<T = any>(url: string, body?: any): Promise<ApiResponse<T>> {
    console.log(`[MockAPI] PUT ${url}`, body);
    
    if (url.startsWith("/apartments/")) {
        const id = url.split("/").pop();
        apartments = apartments.map(i => i.id === id ? { ...i, ...body } : i);
        return { data: body as T };
    }
    if (url.startsWith("/households/")) {
        const id = url.split("/").pop();
        householdList = householdList.map(h => h.id === id ? { ...h, ...body } : h);
        return { data: body as T };
    }
    return { data: {} as T };
  },

  async patch<T = any>(url: string): Promise<ApiResponse<T>> {
      console.log(`[MockAPI] PATCH ${url}`);
      
      if (url.startsWith("/fee-obligations/") && url.endsWith("/pay")) {
        const id = url.split("/")[2];
        obligations = obligations.map(o => 
            o.id === id ? { ...o, paid: o.expected, status: "PAID" } : o
        );
        return { data: { success: true } as T };
      }

      if (url.startsWith("/notifications/") && url.endsWith("/publish")) {
        const id = url.split("/")[2];
        notifications = notifications.map(n => n.id === id ? { ...n, status: "PUBLISHED" } : n);
        return { data: { success: true } as T };
      }
      return { data: {} as T };
  },

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    console.log(`[MockAPI] DELETE ${url}`);

    if (url.startsWith("/apartments/")) {
        const id = url.split("/").pop();
        apartments = apartments.filter(i => i.id !== id);
        return { data: { success: true } as T };
    }
    if (url.startsWith("/households/")) {
        const id = url.split("/").pop();
        const hh = householdList.find(h => h.id === id);
        if (hh) {
            apartments = apartments.map(a => a.id === hh.apartmentId ? {...a, status: "EMPTY"} : a);
        }
        householdList = householdList.filter(h => h.id !== id);
        return { data: { success: true } as T };
    }
    return { data: {} as T };
  },
};