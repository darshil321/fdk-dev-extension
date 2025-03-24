import React from 'react'
import './FormCard.css'

const FormCard = ({
  children
}) => {
  return (
    <div className='card-container'>{children}</div>
  )
}

export default FormCard