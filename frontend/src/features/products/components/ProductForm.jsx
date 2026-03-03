import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Package,
    Tag,
    DollarSign,
    Layers,
    Barcode,
    FileText,
    AlertCircle,
    Truck,
    MapPin,
    Upload,
    X,
    Image as ImageIcon
} from 'lucide-react'
import categoryService from '../../../services/categoryService'
import supplierService from '../../../services/supplierService'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Card from '../../../components/ui/Card'
import { getProductImageUrl } from '../../../utils/helpers'

const ProductForm = ({ initialData = {}, onSubmit, isLoading, isEdit = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category?._id || initialData.category || '',
        supplier: initialData.supplier?._id || initialData.supplier || '',
        sellingPrice: initialData.sellingPrice || initialData.price || '',
        purchasePrice: initialData.purchasePrice || initialData.costPrice || '',
        quantity: initialData.quantity || 0,
        minStockLevel: initialData.minStockLevel || 5,
        unit: initialData.unit || 'piece',
        status: initialData.status || 'active',
        description: initialData.description || ''
    })

    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState(initialData.images || [])

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length + imageFiles.length > 5) {
            alert('Maximum 5 images allowed')
            return
        }

        const newFiles = [...imageFiles, ...selectedFiles]
        setImageFiles(newFiles)

        const newPreviews = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            isNew: true,
            file: file
        }))

        // Convert existing strings to objects if they aren't already
        const currentPreviews = imagePreviews.map(p => typeof p === 'string' ? { url: p, isNew: false } : p)
        setImagePreviews([...currentPreviews, ...newPreviews])
    }

    const removeImage = (index) => {
        const imageToRemove = imagePreviews[index]

        if (imageToRemove.isNew) {
            URL.revokeObjectURL(imageToRemove.url)
            setImageFiles(prev => prev.filter(f => f !== imageToRemove.file))
        }

        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const { data: categoriesRes } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAllCategories({ limit: 100 }),
    })

    const { data: suppliersRes } = useQuery({
        queryKey: ['suppliers'],
        queryFn: () => supplierService.getAllSuppliers({ limit: 100 }),
    })

    const categories = categoriesRes?.data?.data || []
    const suppliers = suppliersRes?.data?.data || []

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Extract remaining existing images
        const remainingImages = imagePreviews
            .filter(p => !p.isNew)
            .map(p => typeof p === 'string' ? p : p.url)

        const submissionData = {
            ...formData,
            sellingPrice: Number(formData.sellingPrice),
            purchasePrice: Number(formData.purchasePrice),
            quantity: Number(formData.quantity),
            minStockLevel: Number(formData.minStockLevel),
            images: remainingImages
        }
        onSubmit(submissionData, imageFiles)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                            <FileText className="w-5 h-5 text-green-600" />
                            General Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Wireless Mouse G502"
                                required
                                containerClassName="md:col-span-2"
                            />
                            <Input
                                label="SKU / Barcode"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="Ex: WMS-G502-001"
                                icon={Barcode}
                                required
                            />
                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={[
                                    { value: '', label: 'Select a category' },
                                    ...categories.map(cat => ({ value: cat._id, label: cat.name }))
                                ]}
                                required
                            />
                            <Select
                                label="Primary Supplier"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                icon={Truck}
                                options={[
                                    { value: '', label: 'Select a supplier' },
                                    ...suppliers.map(s => ({ value: s._id, label: s.name }))
                                ]}
                                required
                            />
                            <Select
                                label="Base Unit"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                options={[
                                    { value: 'piece', label: 'Piece' },
                                    { value: 'kg', label: 'Kilogram' },
                                    { value: 'liter', label: 'Liter' },
                                    { value: 'box', label: 'Box' }
                                ]}
                                required
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all outline-none resize-none"
                                    placeholder="Describe the product features and specifications..."
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Pricing & Stock */}
                    <Card className="p-8 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Pricing & Inventory
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Selling Price (Rs.)"
                                name="sellingPrice"
                                type="number"
                                step="0.01"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                            <Input
                                label="Purchase Price (Rs.)"
                                name="purchasePrice"
                                type="number"
                                step="0.01"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                            <Input
                                label="Current Stock Quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                disabled={isEdit}
                            />
                            <Input
                                label="Alert Level (Low Stock)"
                                name="minStockLevel"
                                type="number"
                                value={formData.minStockLevel}
                                onChange={handleChange}
                                placeholder="5"
                                required
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar / Actions */}
                <div className="space-y-6">
                    <Card className="p-6 sticky top-6 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wide">Publishing</h4>
                        <div className="space-y-4">
                            <Select
                                label="Publish Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' }
                                ]}
                                required
                            />

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 border border-green-200">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-xs font-medium leading-relaxed">
                                    Visibility is set to <strong>{formData.status.toUpperCase()}</strong>.
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-3 text-base font-semibold"
                                    loading={isLoading}
                                >
                                    {isEdit ? 'Update Product' : 'Create Product'}
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

                    <Card className="p-6 border-none shadow-xl shadow-gray-200/50 bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Product Gallery</h4>
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">MAX 5</span>
                        </div>

                        {/* Image Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {imagePreviews.map((preview, index) => {
                                const url = typeof preview === 'string' ? preview : preview.url
                                return (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm">
                                        <img
                                            src={preview.isNew ? url : getProductImageUrl(url)}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )
                            })}

                            {imagePreviews.length < 5 && (
                                <label className="relative aspect-square border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight group-hover:text-green-700">Add Photo</span>
                                </label>
                            )}
                        </div>

                        {imagePreviews.length === 0 && (
                            <div className="py-4 text-center">
                                <ImageIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                    Upload high-quality images to<br />increase sales visibility.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </form>
    )
}

export default ProductForm
