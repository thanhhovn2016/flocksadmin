import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const DashboardChart = (props:any) => {
  //   static demoUrl = 'https://codesandbox.io/s/synchronized-area-chart-kpg1s';

  return (
    <div style={{ width: "100%" }}>
      {/* <h4>A demo of synchronized AreaCharts</h4> */}
      <ResponsiveContainer width="100%" height={props?.height || 400}>
        <AreaChart
          width={500}
          height={200}
          data={props?.data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#99FB4D" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#99FB4D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="createdAt" />
          <YAxis />
          <Tooltip />
          <Area
            // type="monotone"
            // dataKey="uv"
            // stroke="#25AAE1"
            // fillOpacity={1}
            // fill="url(#colorPv)"
            // strokeOpacity={1}
            type="monotone"
          dataKey="available"
          stroke="#99FB4D"
          fillOpacity={1}
          fill="url(#colorUv)"
          strokeOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
