"use server";

import {
  getDonations,
  getDonationsCount,
  type DonationsFilter,
} from "../services/donations";
import { adminAction } from "./safe-action";
import type { Donation } from "../database.types";

const PAGE_SIZE = 10;

export interface DonationsFilterParams {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

export interface FilteredDonationsResult {
  donations: Donation[];
  totalCount: number;
}

export const fetchFilteredDonations = adminAction(
  async (params: DonationsFilterParams): Promise<FilteredDonationsResult> => {
    const { search, dateFrom, dateTo, page = 1 } = params;
    const offset = (page - 1) * PAGE_SIZE;

    const filters: DonationsFilter = {
      search,
      dateFrom,
      dateTo,
      limit: PAGE_SIZE,
      offset,
    };
    const countFilters: Omit<DonationsFilter, "limit" | "offset"> = {
      search,
      dateFrom,
      dateTo,
    };

    const [donations, totalCount] = await Promise.all([
      getDonations(filters),
      getDonationsCount(countFilters),
    ]);

    return { donations, totalCount };
  }
);
