import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit3 } from 'lucide-react'
import productService from '../../../services/productService'
import Button from '../../../components/ui/Button'
import ProductForm from '../components/ProductForm'
import toast from 'react-hot-toast'

const EditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: productRes, isLoading: isFetching } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ productData, files }) => {
      const response = await productService.updateProduct(id, productData)

      if (files && files.length > 0) {
        await productService.uploadProductImages(id, files)
      }

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      queryClient.invalidateQueries(['product', id])
      queryClient.invalidateQueries(['dashboard'])
      toast.success('Product updated successfully')
      navigate(`/products/${id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product')
    }
  })

  const product = productRes?.data?.data

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
          <Button variant="ghost" size="sm" onClick={() => navigate(`/products/${id}`)} className="group">
            <ArrowLeft className="w-5 h-5 group-hover transition-transform" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Edit Product
            </h1>
            <p className="text-gray-500 flex items-center gap-1.5 text-sm font-medium">
              <Edit3 className="w-4 h-4 text-green-600" />
              Updating {product?.name} ({product?.sku})
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={(productData, files) => updateMutation.mutate({ productData, files })}
        isLoading={updateMutation.isPending}
        isEdit={true}
      />
    </div>
  )
}

export default EditProductPage
