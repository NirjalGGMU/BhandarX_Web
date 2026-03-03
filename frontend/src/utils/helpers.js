export const formatCurrency = (amount) => {
  const value = parseFloat(amount)
  if (isNaN(value)) return 'Rs. 0.00'

  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
  }).format(value).replace('NPR', 'Rs.').trim()
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const debounce = (func, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const getProductImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (typeof imagePath !== 'string') return null

  // 1. Absolute URLs or blobs
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath
  }

  // 2. Clean paths
  let path = imagePath.replace(/\\/g, '/')

  // 3. Strip accidental API prefixes
  path = path.replace(/^\/?api\/v\d+/, '')
  if (!path.startsWith('/')) path = '/' + path

  // 4. Cloudinary detect
  if (path.includes('ims/products') && !path.includes('uploads')) {
    const cloudName = 'duif4cibu'
    const publicId = path.startsWith('/') ? path.slice(1) : path
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`
  }

  // 5. Backend server URL
  const serverUrl = 'http://localhost:5000'
  return `${serverUrl}${path}`
}
