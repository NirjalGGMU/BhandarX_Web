const CustomerListPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Customers
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your customer database
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Customer list with contact information, purchase history, and account status will be displayed here.
        </p>
      </div>
    </div>
  )
}

export default CustomerListPage
