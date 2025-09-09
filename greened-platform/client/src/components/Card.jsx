export default function Card({ title, children, footer }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-sm text-gray-700 mb-2">{children}</div>
      {footer && <div className="pt-2 border-t border-gray-100">{footer}</div>}
    </div>
  )
}

