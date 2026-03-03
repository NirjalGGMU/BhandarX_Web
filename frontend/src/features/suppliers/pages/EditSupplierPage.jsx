import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit3 } from 'lucide-react'
import supplierService from '../../../services/supplierService'
import Button from '../../../components/ui/Button'
import SupplierForm from '../components/SupplierForm'
import toast from 'react-hot-toast'

const EditSupplierPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: supplierRes, isLoading: isFetching } = useQuery({
        queryKey: ['supplier', id],
        queryFn: () => supplierService.getById(id),
    })

    const updateMutation = useMutation({
        mutationFn: (data) => supplierService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['suppliers'])
            queryClient.invalidateQueries(['supplier', id])
            toast.success('Supplier updated successfully')
            navigate('/admin/suppliers')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update supplier')
        }
    })

    const supplier = supplierRes?.data?.data

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/suppliers')} className="group">
                        <ArrowLeft className="w-5 h-5 group-hover transition-transform" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Edit Supplier
                        </h1>
                        <p className="text-gray-500 flex items-center gap-1.5 text-sm font-medium">
                            <Edit3 className="w-4 h-4 text-green-600" />
                            Updating {supplier?.name}
                        </p>
                    </div>
                </div>
            </div>

            <SupplierForm
                initialData={supplier}
                onSubmit={(data) => updateMutation.mutate(data)}
                isLoading={updateMutation.isPending}
                isEdit={true}
            />
        </div>
    )
}

export default EditSupplierPage
