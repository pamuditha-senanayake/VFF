const API_BASE_URL = "http://127.0.0.1:8000/api/finance";

export interface FinancialSummary {
    month: number;
    year: number;
    income: number;
    expense: number;
    balance: number;
}

export const getMonthlySummary = async (year: number, month: number): Promise<FinancialSummary> => {
    const response = await fetch(`${API_BASE_URL}/summary/monthly?year=${year}&month=${month}`);
    if (!response.ok) throw new Error("Failed to fetch summary");
    return response.json();
};