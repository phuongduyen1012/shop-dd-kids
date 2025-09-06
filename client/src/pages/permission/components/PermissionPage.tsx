/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: PermissionPage
   ========================================================================== */
import React, { useState, useEffect } from 'react'
import TablePermission from './TablePermission'
import TableRole from './TableRole'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { fetchAllPermission } from '../../../api/post/post.api'
import { useTranslation } from 'react-i18next'

interface Permission {
  id: number
  name: string
  description: string
}
const PermissionPage = () => {
  const { t } = useTranslation()
  const [isTableUserVisible, setTableUserVisible] = useState(true)
  const [isTableRoleVisible, setTableRoleVisible] = useState(true)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const handlePermissionsChange = (updatedPermissions: Permission[]) => {
    setPermissions(updatedPermissions)
  }
  const toggleTableUserVisibility = () => {
    setTableUserVisible(!isTableUserVisible)
  }

  const toggleTableRoleVisibility = () => {
    setTableRoleVisible(!isTableRoleVisible)
  }

  useEffect(() => {
    async function fetchData () {
      try {
        const permissionResponse = await fetchAllPermission()
        setPermissions(permissionResponse.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative w-full">
      <div className="border rounded w-full">
        <button
          onClick={toggleTableRoleVisibility}
          className="flex justify-between items-center w-full mb-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          1. {t('permissionpage.role')}
          {isTableRoleVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
        {isTableRoleVisible && <TableRole permissions={permissions} />}
      </div>
      <div className="border rounded mt-2">
        <button
          onClick={toggleTableUserVisibility}
          className="flex justify-between items-center w-full mb-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          2. {t('permissionpage.list')}
          {isTableUserVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
        {isTableUserVisible && <TablePermission onPermissionsChange={handlePermissionsChange}/>}
      </div>
    </div>
  )
}

export default PermissionPage
