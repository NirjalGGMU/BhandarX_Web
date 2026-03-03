const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`card-base ${hover ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
