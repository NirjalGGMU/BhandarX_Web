import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Building2 } from 'lucide-react'
import supplierService from '../../../services/supplierService'
import Button from '../../../components/ui/Button'
import SupplierForm from '../components/SupplierForm'
import toast from 'react-hot-toast'

const AddSupplierPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: (data) => supplierService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['suppliers'])
            toast.success('Supplier onboarded successfully!')
            navigate('/admin/suppliers')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to onboard supplier')
        }
    })

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/suppliers')} className="group">
                        <ArrowLeft className="w-5 h-5 group-hover transition-transform" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Onboard New Supplier
                        </h1>
                        <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                            <Building2 className="w-4 h-4 text-green-600" />
                            Add a new business partner to your network
                        </p>
                    </div>
                </div>
            </div>

            <SupplierForm
                onSubmit={(data) => createMutation.mutate(data)}
                isLoading={createMutation.isPending}
            />
        </div>
    )
}

export default AddSupplierPage
