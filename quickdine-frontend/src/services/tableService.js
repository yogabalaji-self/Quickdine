import api from "./api";

const TABLES_KEY = "quickdine_tables";

const INITIAL_TABLES = [
  { id: 1, tableNumber: "T-01", capacity: 2, status: "AVAILABLE" },
  { id: 2, tableNumber: "T-02", capacity: 4, status: "OCCUPIED" },
  { id: 3, tableNumber: "T-03", capacity: 4, status: "AVAILABLE" },
  { id: 4, tableNumber: "T-04", capacity: 6, status: "RESERVED" },
  { id: 5, tableNumber: "T-05", capacity: 8, status: "AVAILABLE" },
  { id: 6, tableNumber: "T-06", capacity: 2, status: "AVAILABLE" }
];

const getStoredTables = () => {
  const raw = localStorage.getItem(TABLES_KEY);
  if (!raw) {
    localStorage.setItem(TABLES_KEY, JSON.stringify(INITIAL_TABLES));
    return INITIAL_TABLES;
  }
  return JSON.parse(raw);
};

const saveStoredTables = (tables) => {
  localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
};

export const getTables = async () => {
  try {
    const res = await api.get("/api/tables");
    return res.data;
  } catch (e) {
    return getStoredTables();
  }
};

export const createTable = async (table) => {
  try {
    const res = await api.post("/api/tables", table);
    return res.data;
  } catch (e) {
    const tables = getStoredTables();
    const newT = { ...table, id: Date.now() };
    tables.push(newT);
    saveStoredTables(tables);
    return newT;
  }
};

export const updateTable = async (id, tableData) => {
  try {
    const res = await api.put(`/api/tables/${id}`, tableData);
    return res.data;
  } catch (e) {
    const tables = getStoredTables();
    const idx = tables.findIndex((t) => t.id === Number(id));
    if (idx !== -1) {
      tables[idx] = { ...tables[idx], ...tableData };
      saveStoredTables(tables);
      return tables[idx];
    }
    throw new Error("Table not found");
  }
};

export const deleteTable = async (id) => {
  try {
    await api.delete(`/api/tables/${id}`);
    return true;
  } catch (e) {
    const tables = getStoredTables();
    const filtered = tables.filter((t) => t.id !== Number(id));
    saveStoredTables(filtered);
    return true;
  }
};
