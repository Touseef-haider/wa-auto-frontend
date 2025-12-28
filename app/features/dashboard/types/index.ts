
export type DashboardAnalytic = {
    total_files:number,
    total_products?: number,
    total_messages: number
    last_upload:{
        filename: string
        updated_at: string
    }    
}

export type DashboardAnalyticResponseType = {
    message: string,
    data: DashboardAnalytic
}
