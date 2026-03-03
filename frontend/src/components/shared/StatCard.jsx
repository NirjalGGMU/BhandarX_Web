import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                vs last period
              </span>
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
          {Icon && <Icon className="w-5 h-5 text-green-600" />}
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
