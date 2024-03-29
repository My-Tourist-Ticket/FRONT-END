import AdminHeader from "@/components/Admin/AdminHeader"
import AdminNavbar from "@/components/Admin/AdminNavbar"
import Footer from "@/components/Footer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import axiosWithConfig from "@/utils/apis/axiosWithConfig"
import { Link } from "react-router-dom"

interface Tour {
  tour_name: string
}

interface RecentBooking {
  booking_id: string
  gross_amount: number
  tour: Tour
}

interface City {
  city_name: string
}

interface TopTour {
  id: number
  tour_name: string
  image: string
  thumbnail: string
  city: City
}

interface DashboardData {
  total_costumer: number
  total_pengelola: number
  total_transaction: number
  total_tour: number
  recent_booking: RecentBooking[]
  top_tours: TopTour[]
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const recent = dashboardData?.recent_booking || []
  const topTours = dashboardData?.top_tours || []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosWithConfig.get(
          "https://benarja.my.id/admin/dashboard"
        )
        setDashboardData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-[#dee2e6] ">
      <header>
        <AdminHeader />
      </header>
      <div>
        <div>
          <div className="flex">
            <AdminNavbar />

            <div className="w-full">
              {dashboardData && (
                <div className="flex m-6 justify-between">
                  <div className="bg-white shadow-xl p-4 rounded-lg text-center">
                    <p className="text-[18px] font-bold">
                      Total Customer <br />
                      <span className="text-[15px] font-semibold">
                        {dashboardData.total_costumer}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white shadow-xl p-4 rounded-lg text-center">
                    <p className="text-[18px] font-bold">
                      Total Manager <br />
                      <span className="text-[15px] font-semibold">
                        {dashboardData.total_pengelola}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white shadow-xl p-4 rounded-lg text-center">
                    <p className="text-[18px] font-bold">
                      Total Transaction <br />
                      <span className="text-[15px] font-semibold">
                        {dashboardData.total_transaction}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white shadow-xl p-4 rounded-lg text-center">
                    <p className="text-[18px] font-bold">
                      Total Tour <br />
                      <span className="text-[15px] font-semibold">
                        {dashboardData.total_tour}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white mt-10 mx-6 shadow-xl rounded-lg px-10 py-6">
                <p className="text-[20px] font-bold py-2">Recent Transaction</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-semibold text-[15px]">
                        No.
                      </TableHead>
                      <TableHead className="text-black font-semibold text-[15px]">
                        Booking Code
                      </TableHead>
                      <TableHead className="text-black font-semibold text-[15px]">
                        Tour Name
                      </TableHead>
                      <TableHead className="text-black font-semibold text-[15px]">
                        Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-black text-[12px]">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-black text-[12px]">
                          {booking.booking_id}
                        </TableCell>
                        <TableCell className="text-black text-[12px]">
                          {booking.tour?.tour_name}
                        </TableCell>
                        <TableCell className="text-black text-[12px]">
                          {booking.gross_amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="pt-4 px-6 font-bold text-[20px]">Top 5 Tour</p>

              <div className="px-6 pt-4 flex gap-5 pb-6">
                {topTours.map((tour) => (
                  <Link to={`/admin-tour/${tour.id}`}>
                    <Card className="w-[180px]" key={tour.id}>
                      <img
                        className="w-[250px] h-[130px]"
                        src={tour.image}
                        alt={tour.tour_name}
                      />
                      <div className="p-2">
                        <CardDescription className="flex justify-between">
                          <p className="font-bold pb-2 text-black text-[14px]">
                            {tour.tour_name}
                          </p>
                        </CardDescription>
                        <CardDescription className="flex items-center">
                          <img
                            className="w-[15px] h-[15px] ps-1"
                            src="/images/admin/pin.png"
                            alt="Location Pin"
                          />
                          <p className="ms-2 text-[12px]">
                            {tour.city?.city_name}
                          </p>
                        </CardDescription>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard
