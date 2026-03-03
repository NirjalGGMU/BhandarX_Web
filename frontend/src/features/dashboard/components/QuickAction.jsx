import { ChevronRight } from 'lucide-react'

const QuickAction = ({ action, onClick }) => (
    <button
        onClick={onClick}
        className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white text-left transition-all cursor-pointer hover:border-green-200 hover:bg-green-50/50 hover:shadow-sm active:scale-[0.98]"
    >
        <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 36, height: 36, background: action.iconBg }}
        >
            <action.icon size={17} style={{ color: action.iconColor }} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-gray-800 truncate group-hover:text-green-700 transition-colors">{action.label}</p>
        </div>
        <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500 shrink-0 transition-colors" />
    </button>
)

export default QuickAction
