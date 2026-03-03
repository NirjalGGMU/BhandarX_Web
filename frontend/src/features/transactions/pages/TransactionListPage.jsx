const TransactionListPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Transaction History
        </h1>
        <p className="text-gray-600 mt-1">
          View all sales, purchases, and inventory transactions
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Complete transaction history with filters for date range, transaction type, and status will be displayed here.
        </p>
      </div>
    </div>
  )
}

export default TransactionListPage
