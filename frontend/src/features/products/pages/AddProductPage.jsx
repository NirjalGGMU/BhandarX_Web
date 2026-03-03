import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Package } from 'lucide-react'
import productService from '../../../services/productService'
import Button from '../../../components/ui/Button'
import ProductForm from '../components/ProductForm'
import toast from 'react-hot-toast'

const AddProductPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async ({ productData, files }) => {
      const response = await productService.createProduct(productData)
      const productId = response.data.data._id

      if (files && files.length > 0) {
        await productService.uploadProductImages(productId, files)
      }

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      queryClient.invalidateQueries(['dashboard'])
      toast.success('Product created with images!')
      navigate('/products')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product')
    }
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="group">
            <ArrowLeft className="w-5 h-5 group-hover transition-transform" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create New Product
            </h1>
            <p className="text-gray-500 flex items-center gap-1.5 text-sm">
              <Package className="w-4 h-4 text-green-600" />
              Fill in the details to expand your catalog
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        onSubmit={(productData, files) => createMutation.mutate({ productData, files })}
        isLoading={createMutation.isPending}
      />
    </div>
  )
}

export default AddProductPage
