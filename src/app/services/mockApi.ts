// src/app/services/mockApi.ts
import type { ApiClient, ApiResponse } from "./apiClient";

// --- 1. TYPES DEFINITION ---
export type HouseholdStatus = 'ACTIVE' | 'INACTIVE' | 'TEMPORARY'; 

export type Household = {
  id: string;
  householdId: string;
  ownerName: string;
  phone: string;
  address: string;
  moveInDate: string;
  status: HouseholdStatus; // Hoặc để string như cũ nếu bạn muốn
  apartmentId: string;
};

export type Resident = {
  id: string;
  fullName: string;
  dateOfBirth: string;     // Đã sửa từ 'dob' để khớp frontend
  gender: string;          // MALE, FEMALE, OTHER
  identityCard: string;    // Đã sửa từ 'idNumber' để khớp frontend
  phone?: string;          // Thêm trường này
  relationshipToHead: string;
  status: string;          // ACTIVE, TEMPORARY, ABSENT...
  householdId: string;
  isHead?: boolean;        // Thêm trường xác định chủ hộ
};

export type Vehicle = {
  id: string;
  type: string;       // MOTORBIKE, CAR, ELECTRIC_BIKE, BICYCLE
  plate: string;      // Biển số
  brand: string;      // Hãng xe
  color: string;      // Màu xe
  status: string;     // ACTIVE, INACTIVE
  householdId: string;// Mã hộ sở hữu
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

export type ApartmentStatus = 'EMPTY' | 'OCCUPIED' | 'MAINTENANCE'; 

export type Apartment = {
  id: string;
  block: string;
  floor: string;
  unit: string;
  area: number;
  status: ApartmentStatus; // Sử dụng type vừa định nghĩa
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
  { 
    id: "ap001", block: "A", floor: "05", unit: "12", 
    area: 72.5, status: "OCCUPIED" 
  },
  { 
    id: "ap002", block: "B", floor: "12", unit: "04", 
    area: 95.0, status: "EMPTY" 
  },
  { 
    id: "ap003", block: "A", floor: "08", unit: "02", 
    area: 55.0, status: "OCCUPIED" 
  },
  { 
    id: "ap004", block: "C", floor: "03", unit: "06", 
    area: 110.0, status: "MAINTENANCE" // Ví dụ thêm trạng thái đang bảo trì
  },
  { 
    id: "ap005", block: "B", floor: "15", unit: "09", 
    area: 82.0, status: "EMPTY" 
  },
];

let householdList: Household[] = [
  {
    id: "1", householdId: "HK001", ownerName: "Lê Thị Cẩm Tú", phone: "0905123456",
    address: "A-05-12", moveInDate: "2023-03-10", status: "ACTIVE", apartmentId: "a101",
  },
  {
    id: "2", householdId: "HK002", ownerName: "Phạm Minh Hoàng", phone: "0934567890",
    address: "B-12-04", moveInDate: "2023-05-20", status: "ACTIVE", apartmentId: "b204",
  },
  {
    id: "3", householdId: "HK003", ownerName: "Vũ Thu Hà", phone: "0918889999",
    address: "A-08-01", moveInDate: "2023-06-15", status: "ACTIVE", apartmentId: "a305",
  },
  {
    id: "4", householdId: "HK004", ownerName: "Đặng Tuấn Kiệt", phone: "0387776666",
    address: "C-03-09", moveInDate: "2023-08-01", status: "INACTIVE", apartmentId: "c109",
  },
  {
    id: "5", householdId: "HK005", ownerName: "Ngô Bảo Châu", phone: "0971222333",
    address: "B-15-02", moveInDate: "2023-09-05", status: "ACTIVE", apartmentId: "b502",
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
    // Hộ 1 (ID: "1") - Gia đình ông Nguyễn Văn A
    { 
        id: "r1", 
        fullName: "Nguyễn Văn A", 
        dateOfBirth: "1985-05-15", 
        gender: "MALE", 
        identityCard: "001085000123", 
        phone: "0912345678",
        relationshipToHead: "Chủ hộ", 
        status: "ACTIVE", 
        householdId: "1",
        isHead: true 
    },
    { 
        id: "r2", 
        fullName: "Trần Thị B", 
        dateOfBirth: "1987-08-20", 
        gender: "FEMALE", 
        identityCard: "001087000456", 
        phone: "0987654321",
        relationshipToHead: "Vợ", 
        status: "ACTIVE", 
        householdId: "1",
        isHead: false 
    },
    { 
        id: "r3", 
        fullName: "Nguyễn Văn C", 
        dateOfBirth: "2010-01-10", 
        gender: "MALE", 
        identityCard: "", // Trẻ em chưa có CCCD
        relationshipToHead: "Con", 
        status: "ACTIVE", 
        householdId: "1",
        isHead: false 
    },
    // Khách ở nhờ nhà hộ 1
    { 
        id: "r4", 
        fullName: "Lê Văn D", 
        dateOfBirth: "1995-12-05", 
        gender: "MALE", 
        identityCard: "025095000789", 
        phone: "0909090909",
        relationshipToHead: "Cháu", 
        status: "TEMPORARY", // Tạm trú
        householdId: "1",
        isHead: false 
    },
    
    // Hộ 2 (ID: "2") - Gia đình ông Trần Văn B
    { 
        id: "r5", 
        fullName: "Trần Văn B", 
        dateOfBirth: "1980-03-22", 
        gender: "MALE", 
        identityCard: "030098000999", 
        phone: "0911223344",
        relationshipToHead: "Chủ hộ", 
        status: "ACTIVE", 
        householdId: "2",
        isHead: true 
    }
];

let vehicles: Vehicle[] = [
    { 
        id: "v1", 
        type: "CAR", 
        plate: "30A-123.45", 
        brand: "Toyota Vios", 
        color: "Đen", 
        status: "ACTIVE", 
        householdId: "HK001" 
    },
    { 
        id: "v2", 
        type: "MOTORBIKE", 
        plate: "29-B1 567.89", 
        brand: "Honda Vision", 
        color: "Đỏ", 
        status: "ACTIVE", 
        householdId: "HK001" 
    },
    { 
        id: "v3", 
        type: "ELECTRIC_BIKE", 
        plate: "29-MD1 999.88", 
        brand: "VinFast Klara", 
        color: "Trắng", 
        status: "ACTIVE", 
        householdId: "HK002" 
    },
    { 
        id: "v4", 
        type: "CAR", 
        plate: "51F-888.88", 
        brand: "Mercedes C300", 
        color: "Xanh Canvas", 
        status: "INACTIVE", // Xe đang gửi chỗ khác hoặc đi vắng dài ngày
        householdId: "HK002" 
    },
    { 
        id: "v5", 
        type: "BICYCLE", 
        plate: "", // Xe đạp không có biển
        brand: "Thống Nhất", 
        color: "Xanh dương", 
        status: "ACTIVE", 
        householdId: "HK003" 
    }
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

    if (url === "/residents") {
        const newItem = { id: `r${Date.now()}`, ...body };
        residents = [newItem, ...residents];
        return { data: newItem as T };
    }
    
    if (url === "/vehicles") {
        const newItem = { id: `v${Date.now()}`, ...body };
        vehicles = [newItem, ...vehicles];
        return { data: newItem as T };
    }

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

    if (url.startsWith("/residents/")) {
        const id = url.split("/").pop();
        // Cập nhật trong mảng residents
        residents = residents.map(r => r.id === id ? { ...r, ...body } : r);
        return { data: body as T };
    }

    if (url.startsWith("/vehicles/")) {
        const id = url.split("/").pop();
        // Cập nhật trong mảng vehicles
        vehicles = vehicles.map(v => v.id === id ? { ...v, ...body } : v);
        return { data: body as T };
    }
    
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

    if (url.startsWith("/residents/")) {
        const id = url.split("/").pop();
        residents = residents.filter(r => r.id !== id);
        return { data: { success: true } as T };
    }

    if (url.startsWith("/vehicles/")) {
        const id = url.split("/").pop();
        vehicles = vehicles.filter(v => v.id !== id);
        return { data: { success: true } as T };
    }

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