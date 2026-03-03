import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts'
import Card from '../../../components/ui/Card'
import { BarChart3 } from 'lucide-react'

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white rounded-lg p-3 shadow-lg border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-2">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: p.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    )
}

const InventoryFlowChart = ({ data, isMounted }) => {
    return (
        <Card className="p-5 h-full" hover={false}>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Inventory Flow</h3>
                    <p className="text-xs text-gray-400 mt-0.5">7-day stock movement</p>
                </div>
                <div className="flex items-center gap-4">
                    {['Stock In', 'Stock Out'].map((label, i) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? '#16A34A' : '#94A3B8' }} />
                            <span className="text-xs text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: 280 }} className="relative">
                {isMounted && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#94A3B8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="Stock In"
                                stroke="#16A34A"
                                strokeWidth={3}
                                fill="url(#gIn)"
                                dot={{ r: 4, fill: '#16A34A', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Stock Out"
                                stroke="#94A3B8"
                                strokeWidth={3}
                                fill="url(#gOut)"
                                dot={{ r: 4, fill: '#94A3B8', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                        <BarChart3 size={36} className="text-gray-200 mb-3" />
                        <p className="text-sm text-gray-400">No movement data yet</p>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default InventoryFlowChart
