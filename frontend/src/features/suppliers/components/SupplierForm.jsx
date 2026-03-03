import { useState } from 'react'
import {
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    AlertCircle
} from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Card from '../../../components/ui/Card'

const SupplierForm = ({ initialData = {}, onSubmit, isLoading, isEdit = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        code: initialData.code || '',
        contactPerson: initialData.contactPerson || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || '',
        website: initialData.website || '',
        status: initialData.status || 'active',
        category: initialData.category || 'General'
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-green-600" />
                            Company Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Company Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Global Logistics Inc."
                                required
                            />
                            <Input
                                label="Supplier Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Ex: SUP001"
                                required
                                disabled={isEdit}
                                hint="Unique identifier for the supplier (e.g., SUP001)"
                            />
                            <Input
                                label="Contact Person"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="Ex: John Doe"
                                icon={User}
                                required
                            />
                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={[
                                    { value: 'General', label: 'General' },
                                    { value: 'Logistics', label: 'Logistics' },
                                    { value: 'Manufacturing', label: 'Manufacturing' },
                                    { value: 'Wholesale', label: 'Wholesale' }
                                ]}
                                required
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="vendor@company.com"
                                icon={Mail}
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                icon={Phone}
                                required
                            />
                        </div>
                    </Card>

                    {/* Address Information */}
                    <Card className="p-8 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            Location & Presence
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Street Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Business Way"
                                containerClassName="md:col-span-2"
                            />
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                            />
                            <Input
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="United States"
                            />
                            <Input
                                label="Website URL"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                icon={Globe}
                                containerClassName="md:col-span-2"
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar / Actions */}
                <div className="space-y-6">
                    <Card className="p-6 sticky top-6 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <h4 className="text-sm font-semibold text-gray-500 mb-4">Supplier Status</h4>
                        <div className="space-y-4">
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={[
                                    { value: 'active', label: 'Active Partner' },
                                    { value: 'inactive', label: 'On Hold' }
                                ]}
                            />

                            <div className="p-4 rounded-xl bg-green-50 text-green-700 border border-green-200 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-xs leading-relaxed">
                                    Active suppliers can be linked to purchase orders and product sourcing.
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    id="onboard-supplier-btn"
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-3 text-base font-semibold"
                                    loading={isLoading}
                                >
                                    {isEdit ? 'Update Supplier' : 'Onboard Supplier'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    )
}

export default SupplierForm
