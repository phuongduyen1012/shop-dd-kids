/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: UserPage
   ========================================================================== */
import React from 'react'
import TableRole from './TableUsers'

const UserPage = () => {
  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative w-full">
      <div className="border rounded w-full">
        <TableRole />
      </div>
    </div>
  )
}

export default UserPage
