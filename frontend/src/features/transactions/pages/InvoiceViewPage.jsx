import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import salesService from '../../../services/salesService'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import InvoicePreview from '../../sales/components/InvoicePreview'

const InvoiceViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: invoiceRes, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => salesService.getByInvoiceNumber(id),
  })

  const invoice = invoiceRes?.data?.data

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('PDF download feature would be implemented here')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading invoice...</div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Invoice not found</p>
        <Button variant="primary" onClick={() => navigate('/transactions')} className="mt-4">
          Back to Transactions
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/transactions')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </Card>

      {/* Invoice */}
      <Card className="print:shadow-none">
        <InvoicePreview invoice={invoice} />
      </Card>
    </div>
  )
}

export default InvoiceViewPage
