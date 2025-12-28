import Button from "@/app/common/Button/Index";
import { getAnaylytics } from "../server-actions";
import { DashboardAnalytic } from "../types";
import ChatStarter from "../components/start-chat";

export default async function Dashboard() {

  const response = await getAnaylytics()
  let data:DashboardAnalytic = {
    last_upload:{
      filename:"",
      updated_at: ""
    },
    
    total_files:0,
    total_products:0,
    total_messages:0
  }
  if(response?.data){
    data = response.data
  }



  return (
    <div className="p-6 mt-6 bg-gray-100 min-h-screen font-sans text-gray-800">
      <h1 className="text-xl font-semibold mb-6">Dashboard Analytics</h1>

      {/* Summary Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Total Uploaded Files</h2>
          <p className="text-xl font-semibold mt-1">{data.total_files}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Total Chat Messages</h2>
          <p className="text-xl font-semibold mt-1">{data.total_messages}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Last Upload</h2>
          <p className="text-gray-600 mt-1">{data.last_upload.filename || "-"}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
          <p className="text-xl font-semibold mt-1">{data.total_products}</p>
        </div>
        <ChatStarter />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Uploaded Files */}

        {/* Chat Messages */}
        {/* <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-base font-semibold mb-4">Recent Chat Messages</h2>
          <ul className="divide-y divide-gray-200 text-sm">
            {chatMessages.map((msg) => (
              <li key={msg.id} className="py-2">
                <div className="flex justify-between">
                  <span className="font-medium">{msg.user}</span>
                  <span className="text-gray-400 text-xs">{msg.timestamp}</span>
                </div>
                <p className="text-gray-700">{msg.text}</p>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </div>
  );
}
