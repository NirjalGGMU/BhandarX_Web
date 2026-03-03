const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType = 'positive',
    iconBg = '#f0fdf4',
    iconColor = '#16a34a',
    className = ''
}) => {
    const changeBg   = changeType === 'positive' ? 'bg-green-50 text-green-700'
                     : changeType === 'negative' ? 'bg-red-50 text-red-600'
                     : 'bg-gray-100 text-gray-600'

    return (
        <div className={`card-base card-stat p-5 group hover:shadow-md transition-shadow duration-200 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                        {change && (
                            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${changeBg}`}>
                                {change}
                            </span>
                        )}
                    </div>
                </div>
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-3"
                    style={{ background: iconBg }}
                >
                    <Icon size={20} style={{ color: iconColor }} />
                </div>
            </div>
        </div>
    )
}

export default StatCard
