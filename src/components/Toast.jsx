import { useEffect } from 'react'

function Toast({ title, detail, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="toast" role="status">
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </div>
  )
}

export default Toast
