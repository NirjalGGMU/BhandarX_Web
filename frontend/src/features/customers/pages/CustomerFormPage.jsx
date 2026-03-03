import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import customerService from '../../../services/customerService'

const CustomerFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  })

  const [errors, setErrors] = useState({})

  // Fetch customer data if editing
  const { data: customerRes } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getById(id),
    enabled: isEdit,
  })

  useEffect(() => {
    if (customerRes?.data?.data) {
      const customer = customerRes.data.data
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        isActive: customer.isActive !== undefined ? customer.isActive : true,
      })
    }
  }, [customerRes])

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return customerService.update(id, data)
      }
      return customerService.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
      navigate('/customers')
    },
    onError: (error) => {
      const errorData = error.response?.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const mappedErrors = {}
        errorData.errors.forEach(err => {
          mappedErrors[err.field] = err.message
        })
        setErrors(mappedErrors)
      }
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    mutation.mutate(formData)
  }

  return (
    <div className="space-y-6 max-w-3xl pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Update customer information' : 'Create a new customer profile'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Form */}
      <Card className="p-6" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
            />

            <Input
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+1 234 567 8900"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="customer@example.com"
            />

            <Select
              label="Status"
              name="isActive"
              value={formData.isActive.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Enter full address"
          />

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={mutation.isPending}
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CustomerFormPage
