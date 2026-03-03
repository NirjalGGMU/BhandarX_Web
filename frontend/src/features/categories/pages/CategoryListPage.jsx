import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Tag, Plus, Search, Edit2, Trash2,
    CheckCircle2, XCircle, Info
} from 'lucide-react'
import categoryService from '../../../services/categoryService'
import Card from '../../../components/ui/Card'
import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import toast from 'react-hot-toast'
import { ROLES } from '../../../utils/constants'
import { useAuthStore } from '../../../store/authStore'

const CategoryListPage = () => {
    const queryClient = useQueryClient()
    const { user } = useAuthStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        isActive: true
    })

    const isAdmin = user?.role === ROLES.ADMIN
    const canEdit = isAdmin
    const canDelete = isAdmin

    const { data: categoriesRes, isLoading } = useQuery({
        queryKey: ['categories', searchTerm],
        queryFn: () => categoryService.getAllCategories({ search: searchTerm, limit: 100 }),
    })

    const createMutation = useMutation({
        mutationFn: (data) => categoryService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            toast.success('Category created successfully')
            handleCloseModal()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create category')
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            toast.success('Category updated successfully')
            handleCloseModal()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update category')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            toast.success('Category deleted successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete category')
        }
    })

    const categories = categoriesRes?.data?.data || []

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category)
            setFormData({
                name: category.name,
                code: category.code,
                description: category.description || '',
                isActive: category.isActive ?? true
            })
        } else {
            setEditingCategory(null)
            setFormData({ name: '', code: '', description: '', isActive: true })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingCategory(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory._id, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteMutation.mutate(id)
        }
    }

    const columns = [
        {
            key: 'name',
            label: 'Category',
            render: (value, category) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                        <Tag className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{value}</p>
                        <p className="text-[11px] text-gray-400 font-mono uppercase">CODE: {category?.code || '---'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (value) => (
                <span className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                    {value || 'No description'}
                </span>
            ),
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (value) => (
                <Badge variant={value ? 'success' : 'danger'}>
                    <div className="flex items-center gap-1">
                        {value ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {value ? 'Active' : 'Inactive'}
                    </div>
                </Badge>
            ),
        },
        {
            key: '_id',
            label: 'Actions',
            render: (id, category) => (
                <div className="flex items-center justify-end gap-1">
                    {canEdit && (
                        <button
                            onClick={() => handleOpenModal(category)}
                            className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleDelete(id)}
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Organize inventory with structured category management
                    </p>
                </div>
                {canEdit && (
                    <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
                        <Plus className="w-4 h-4" />
                        New Category
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5" hover={false}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Categories</p>
                            <h3 className="text-xl font-bold text-gray-900">{categories.length}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-5" hover={false}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active</p>
                            <h3 className="text-xl font-bold text-gray-900">{categories.filter(c => c.isActive).length}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-5" hover={false}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Inactive</p>
                            <h3 className="text-xl font-bold text-gray-900">{categories.filter(c => !c.isActive).length}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card className="p-3" hover={false}>
                <Input
                    placeholder="Search categories by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                />
            </Card>

            {/* Table */}
            <Card className="overflow-hidden" hover={false}>
                <Table
                    columns={columns}
                    data={categories}
                    loading={isLoading}
                    emptyMessage="No categories found. Create one to get started."
                />
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Category Name"
                            placeholder="e.g. Electronics"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Category Code"
                            placeholder="e.g. ELEC"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            required
                        />
                        <Select
                            label="Status"
                            value={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                            options={[
                                { value: 'true', label: 'Active' },
                                { value: 'false', label: 'Inactive' }
                            ]}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all resize-none placeholder:text-gray-400"
                                placeholder="What kinds of products belong here?"
                            />
                        </div>
                    </div>

                    <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-start gap-2.5">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed">
                            Categories help organize products for reporting and POS filtering. Use clear codes for quick identification.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button variant="outline" className="flex-1" type="button" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-2"
                            type="submit"
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingCategory ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default CategoryListPage
