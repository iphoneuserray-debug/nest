export interface DataCard {
    totalCompany: number;
    totalEmployee: number;
    totalRevenue: number;
    totalCountry: number;
};

export interface Doughnut {
    levelList: number[];
    level: number[];
};

export interface LineData {
    yearList: string[];
    companyByYear: number[];
};

export interface Widgets {
    datacard: DataCard;
    doughnut: Doughnut;
    line: LineData;
};


