import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    FileUp,
    CheckCircle2,
    AlertCircle,
    Upload,
    Info,
    FileText,
    Download
} from 'lucide-react'
import productService from '../../../services/productService'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import toast from 'react-hot-toast'

const InventoryImportPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState([])

    const importMutation = useMutation({
        mutationFn: (data) => {
            // In a real app, this would be a multipart/form-data upload
            // For now, we simulate the import logic
            return new Promise((resolve) => setTimeout(resolve, 2000))
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['inventory-products'])
            toast.success('Inventory data imported successfully')
            navigate('/inventory')
        }
    })

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                toast.error('Please upload a valid CSV file')
                return
            }
            setFile(selectedFile)

            // Mock preview
            setPreview([
                { sku: 'WMS-001', name: 'Wireless Mouse', quantity: 50, price: 29.99 },
                { sku: 'KBD-002', name: 'Mechanical Keyboard', quantity: 30, price: 89.99 },
                { sku: 'MON-003', name: 'Gaming Monitor', quantity: 15, price: 299.99 },
            ])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!file) return
        importMutation.mutate(file)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/inventory')}
                    className="group mb-2 p-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover transition-transform" />
                    Back to Inventory
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bulk Import
                </h1>
                <p className="text-gray-500 font-medium mt-1">
                    Upload CSV to mass update your product catalog
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border-none shadow-2xl shadow-gray-200/50">
                        {!file ? (
                            <div className="border-4 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:bg-[#F8F9FA] transition-all cursor-pointer group relative">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-20 h-20 bg-green-50 text-green-700 border border-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-transform">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Drop your CSV here</h3>
                                <p className="text-sm text-gray-400 mt-2">or click to browse files</p>
                                <div className="mt-8 flex items-center justify-center gap-4">
                                    <Badge variant="primary">MAX 10MB</Badge>
                                    <Badge variant="primary">UTF-8 ENCODING</Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6" />
                                        <div>
                                            <p className="text-sm font-medium">{file.name}</p>
                                            <p className="text-[10px] font-bold opacity-70">{(file.size / 1024).toFixed(2)} KB • Ready for processing</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => { setFile(null); setPreview([]); }} className="text-emerald-700 hover:bg-emerald-100">
                                        Change File
                                    </Button>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-gray-100">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                            <tr>
                                                <th className="px-4 py-3">SKU</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Qty</th>
                                                <th className="px-4 py-3">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {preview.map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-3 font-mono font-bold">{row.sku}</td>
                                                    <td className="px-4 py-3 font-bold text-gray-900">{row.name}</td>
                                                    <td className="px-4 py-3 font-semibold text-green-700">{row.quantity}</td>
                                                    <td className="px-4 py-3 font-semibold text-emerald-600">${row.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="p-3 bg-gray-50 text-center">
                                        <p className="text-xs text-gray-400">And {file.size > 1000 ? '142' : '0'} more rows...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-8 border border-gray-200 shadow-sm bg-[#F8F9FA]" hover={false}>
                        <div className="flex gap-6">
                            <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                                <Info className="w-8 h-8 text-green-700" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Import Requirements</h3>
                                <ul className="mt-4 space-y-2 text-sm font-medium text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                        CSV must include columns: SKU, Name, Quantity, Category
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                        Existing SKUs will be updated; new SKUs will be created
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                        Date format should be YYYY-MM-DD
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-8 sticky top-6 bg-white border-none shadow-2xl">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">Actions</h4>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Button
                                    variant="primary"
                                    className="w-full py-3 text-base font-semibold"
                                    onClick={handleSubmit}
                                    loading={importMutation.isPending}
                                    disabled={!file}
                                >
                                    Execute Import
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-100"
                                    onClick={() => navigate('/inventory')}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-xs text-gray-400 mb-4">Templates</p>
                                <a href="/inventory_template.csv" download="Inventory_Template.csv">
                                    <Button variant="ghost" className="w-full justify-start text-xs font-bold text-green-700 px-2" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Inventory_Template.csv
                                    </Button>
                                </a>
                                <a href="/categories_map.csv" download="Categories_Map.csv">
                                    <Button variant="ghost" className="w-full justify-start text-xs font-bold text-green-700 px-2 mt-2" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Categories_Map.csv
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default InventoryImportPage
