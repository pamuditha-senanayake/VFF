"use client";
import React, { useEffect, useState } from "react";
import { getMonthlySummary, FinancialSummary } from "@/services/financeApi";

export default function FinanceSummary() {
    const [summary, setSummary] = useState<FinancialSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Hardcoded to match our Supabase test data for the viva
    const currentYear = 2026;
    const currentMonth = 4; 

    useEffect(() => {
        async function fetchSummary() {
            try {
                const data = await getMonthlySummary(currentYear, currentMonth);
                setSummary(data);
            } catch (err) {
                setError("Failed to load financial data. Is your FastAPI server running?");
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, []);

    if (loading) return <div className="p-6 text-gray-500 animate-pulse">Loading financial summary...</div>;
    if (error) return <div className="p-6 text-red-500 font-semibold">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Income</h3>
                <p className="text-3xl font-black text-gray-800 mt-2">
                    ${summary?.income.toFixed(2)}
                </p>
            </div>

            {/* Expense Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Expenses</h3>
                <p className="text-3xl font-black text-gray-800 mt-2">
                    ${summary?.expense.toFixed(2)}
                </p>
            </div>

            {/* Net Balance Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Net Balance</h3>
                <p className={`text-3xl font-black mt-2 ${summary!.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${summary?.balance.toFixed(2)}
                </p>
            </div>
        </div>
    );
}